import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

// Lazy initialization of the Gemini Client
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("Your GEMINI_API_KEY is currently set to a placeholder or undefined. To activate real-time search grounding and script AI agents, please go to the Settings gear icon (top right corner of AI Studio), click 'Secrets', click '+ ADD SECRET', name it 'GEMINI_API_KEY' with your real API key from https://aistudio.google.com/.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Trend research route with Google Search Grounding to find real-time trends
app.post("/api/research-trends", async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) {
      return res.status(400).json({ error: "Niche parameter is required" });
    }

    const ai = getGeminiClient();

    // Stage 1: Gather raw real-time research using search grounding
    const searchQuery = `What is currently trending, viral, or heavily discussed on TikTok, YouTube, and Twitter in the niche of "${niche}"? What are creators talking about right now, and what are rising angles? Please find actual recent news, topics, or rising search spikes.`;
    
    const searchResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: searchQuery,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchResultsText = searchResponse.text;
    
    // Extract sources if any exist in the grounding metadata
    const sources: { title: string; url: string }[] = [];
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Grounding Source",
            url: chunk.web.uri,
          });
        }
      });
    }

    // Stage 2: Prompt Gemini to structure the real-time research text into an elegant JSON format
    const structuringPrompt = `
You are a Social Media Trend Analyst. Your job is to parse the raw real-time search context provided below and convert it inside a clean, structured JSON analysis report.

Raw research data:
"""
${searchResultsText}
"""

Niche analyzed: "${niche}"
Current Date Context: June 2026.

Produce a structured JSON report that follows the requested JSON schema. Be highly descriptive, identify at least 3 concrete hot topics, rising custom storytelling angles for each, and identify viral patterns (such as pacing styles, music types, hook formats, or edit-pacing) seen in this niche.
`;

    const structuredResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: structuringPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            niche: { type: Type.STRING },
            overallAnalysis: { type: Type.STRING, description: "A smart executive summary of current sentiment, spikes, and content opportunities." },
            trendingTopics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Highly clickable keyword or topic title." },
                  niche: { type: Type.STRING },
                  summary: { type: Type.STRING, description: "Brief description of why this is spiking or popular right now." },
                  interestLevel: { type: Type.STRING, description: "Must be either 'High', 'Medium', or 'Low'." },
                  keyAngles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-4 unique, creative narrative angles creators can use to stand out (storytelling perspective, visual hook ideas)."
                  }
                },
                required: ["title", "niche", "summary", "interestLevel", "keyAngles"]
              }
            },
            viralPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Current high-performing visual, audio, or stylistic content patterns (e.g. lo-fi ambient backgrounds, high-speed ASMR B-roll, green-screen commentary format)."
            }
          },
          required: ["niche", "overallAnalysis", "trendingTopics", "viralPatterns"]
        }
      }
    });

    const structuredText = structuredResponse.text;
    const parsedData = JSON.parse(structuredText);

    // Inject our verified citations/sources into the final response topics
    if (parsedData.trendingTopics && parsedData.trendingTopics.length > 0) {
      parsedData.trendingTopics.forEach((topic: any, idx: number) => {
        // distribute existing sources logically or add general sources
        topic.sources = sources.slice(idx * 2, (idx + 1) * 2);
        if (topic.sources.length === 0 && sources.length > 0) {
          topic.sources = [sources[0]];
        }
      });
    }

    parsedData.updatedAt = new Date().toISOString();
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in trend research:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during trend research." });
  }
});

// 3. Script & Direction generation route
app.post("/api/generate-script", async (req, res) => {
  try {
    const { niche, topic, videoType, tone, customDirectives } = req.body;
    if (!niche || !topic) {
      return res.status(400).json({ error: "Niche and topic are required parameters" });
    }

    const ai = getGeminiClient();

    const scriptPrompt = `
You are an Elite Video Production Crew consisting of 4 agents:
1. **Trend Strategist**: Finds the perfect angle, visual hooks, psychological triggers (e.g. micro-doses of dopamine, curiosity gap, emotional pay-offs), and maps the exact target demographic.
2. **Creative Script Writer**: Writes world-class narrations/storytelling lines avoiding lazy cliches, ensuring cinematic flow and narrative tension.
3. **Scene Director**: Decides visual pacing, detailed camera direction, captions/text overlay aesthetics, and prompts for b-roll frames.
4. **Assembly Editor**: Packages everything into a detailed master timeline sheet with audio/sound engineering details and concrete post-production advice.

Compile a masterpiece script proposal for:
- **Topic**: "${topic}"
- **Niche**: "${niche}"
- **Video Format**: ${videoType === "shorts" ? "Short-Form (9:16 Vertical, TikTok/YouTube Shorts, 45-60 seconds long)" : "Long-Form video (16:9 Landscape, YouTube, 3-5 minutes continuous audio flow)"}
- **Tone requested**: "${tone}"
- **Custom Briefing Notes**: "${customDirectives || "None"}"

Please produce a structured JSON response matching the schema defined below. Ensure the narration script is natural, compelling, and ready to be read aloud (e.g. no bracketed text in the actual spoken script, but keep it high-quality).

For shorts/TikTok: Aim for 5-8 continuous scenes spanning exactly 45-60 seconds. High density shot transitions (every 3-7 seconds).
For YouTube long-form: Aim for 10-15 detailed scenes spanning index-pacing of continuous storytelling (total duration around 180-300 seconds), prioritizing standard literary structures and beautiful worldbuilding.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: scriptPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, optimized internal project title for this script." },
            videoType: { type: Type.STRING },
            tone: { type: Type.STRING },
            concept: { type: Type.STRING, description: "The overarching creative theme or 'big idea' of this video." },
            targetAudience: { type: Type.STRING, description: "Detailed target viewer profile." },
            psychologicalHook: { type: Type.STRING, description: "The psychological or emotional trigger used to command attention (e.g., secondary gain, fear of missing out, nostalgia)." },
            titlesOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 highly clickable, low-cringe, high CTR title suggestions."
            },
            viralTagsCount: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended highly optimized hashtags or tagging keywords."
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  duration: { type: Type.INTEGER, description: "Duration in seconds for this single scene." },
                  visualDescription: { type: Type.STRING, description: "Detailed visual instructions. Action, camera angle, crop, graphics overlays, transitions, lighting style." },
                  scriptText: { type: Type.STRING, description: "Exact voiceover spoken script or on-screen narrator words. Do NOT include bracketed or spoken-direction text here, just read-out words." },
                  audioSfx: { type: Type.STRING, description: "Background music changes, volume ducking instructions, specific sound effects ([swoosh], [deep wind riser], [glass bell ring])." },
                  bRollPrompt: { type: Type.STRING, description: "Extremely detailed description or image-generation prompt for setting up this scene's stock footage or design." }
                },
                required: ["sceneNumber", "duration", "visualDescription", "scriptText", "audioSfx", "bRollPrompt"]
              }
            },
            assemblyInstructions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Step name (e.g. 'Intro Hook Sound Design', 'Caption Pacing Style')." },
                  instruction: { type: Type.STRING, description: "Exact implementation steps for the editor." },
                  pacingNote: { type: Type.STRING, description: "Advice on maintaining high retention rates in this phase." }
                },
                required: ["title", "instruction", "pacingNote"]
              }
            },
            strategistNotes: { type: Type.STRING, description: "Strategic parting advice from the Trend Strategist on how to market, thumbnail, or seed comments to spark high engagement." }
          },
          required: [
            "title", "videoType", "tone", "concept", "targetAudience", "psychologicalHook", 
            "titlesOptions", "viralTagsCount", "scenes", "assemblyInstructions", "strategistNotes"
          ]
        }
      }
    });

    const parsedScript = JSON.parse(response.text);
    res.json(parsedScript);
  } catch (err: any) {
    console.error("Error in script generation:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during scripting." });
  }
});

// Setup Vite & static serving
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
  });
}

startViteServer();
