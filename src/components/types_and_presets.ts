import { TrendAnalysisResult, VideoScriptData } from "../types";

export const PRESET_NICHES = [
  { id: "tech_ai", label: "Tech & Artificial Intelligence", emoji: "🤖" },
  { id: "finance_side_hustles", label: "Personal Finance & Side Hustles", emoji: "💸" },
  { id: "fitness_biohacking", label: "Fitness, Wellness & Biohacking", emoji: "⚡" },
  { id: "true_crime_mystery", label: "Mystery, True Crime & History", emoji: "🕵️" },
  { id: "travel_gems", label: "Travel & Hidden Gems", emoji: "⛰️" },
  { id: "philosophy_productivity", label: "Stoicism, Philosophy & Motivation", emoji: "🏛️" }
];

export const TONE_OPTIONS = [
  { id: "educational", label: " educational Mind-blowing & Informative" },
  { id: "dramatic", label: "🎭 Dramatic & Suspenseful Storytelling" },
  { id: "high_energy", label: "🔥 High-energy Hype & Hook-packed" },
  { id: "mystical", label: "🌌 Atmospheric, Deep & Poetic" },
  { id: "relatable", label: "🌱 Relatable, Humorous & Conversational" }
];

export const SAMPLE_TRENDS: Record<string, TrendAnalysisResult> = {
  tech_ai: {
    niche: "Tech & Artificial Intelligence",
    updatedAt: "2026-06-04T19:00:00Z",
    overallAnalysis: "The AI niche has shifted from sheer feature listings to 'agentic execution' and real-world impact. Viewers are highly skeptical of generic content but show extreme retention for physical demos, real-time stress testing of models, and side-by-side product comparisons. Lo-fi aesthetic coders with soothing narration are dominating TikTok.",
    trendingTopics: [
      {
        title: "Coding with 0-Clicks",
        niche: "Tech & Artificial Intelligence",
        summary: "The rise of full-autonomous coding agents that write, deploy, and fix apps in under 3 minutes based on natural voice inputs.",
        interestLevel: "High",
        sources: [
          { title: "GitHub Next Trends", url: "https://github.com/trending" },
          { title: "Devin AI Benchmarks", url: "https://news.ycombinator.com" }
        ],
        keyAngles: [
          "The 'No-Code' complete developer: what does a software team look like next month?",
          "Building a complete custom SaaS startup on a subway ride.",
          "Stress-testing AI agents: pushing them until they break."
        ]
      },
      {
        title: "Real-time AI Video Overlays",
        niche: "Tech & Artificial Intelligence",
        summary: "Using local video filter models to translate languages and change facial expressions or backgrounds in real-time streams.",
        interestLevel: "High",
        sources: [
          { title: "Reddit r/MachineLearning", url: "https://reddit.com/r/MachineLearning" }
        ],
        keyAngles: [
          "The death of camera stage fright: streaming as a CGI version of yourself.",
          "Live-translating street food vendors: connecting globally in real-time."
        ]
      }
    ],
    viralPatterns: [
      "Show screen first with immediate visual payoff inside 2 seconds.",
      "Background music uses Synthwave or retro lo-fi beats.",
      "Visual style uses high contrast terminal text overlaid on clean desk B-roll."
    ]
  },
  finance_side_hustles: {
    niche: "Personal Finance & Side Hustles",
    updatedAt: "2026-06-04T19:00:00Z",
    overallAnalysis: "Passive income is being replaced by high-growth service arbitrage. General side-hustle listicles are crashing in view counts. Instead, extreme transparency reports (showing exact bank statements and failed attempts) command massive, loyal audiences who want gritty reality over fantasy.",
    trendingTopics: [
      {
        title: "Local Business AI Automation Audits",
        niche: "Personal Finance & Side Hustles",
        summary: "Going into mom-and-pop local shops, finding their bottlenecks, setting up simple chatbots/Zapier triggers, and charging a retainer.",
        interestLevel: "High",
        sources: [
          { title: "Side Hustle School", url: "https://sidehustleschool.com" }
        ],
        keyAngles: [
          "I automated a local bakery's appointments in 1 hour and they paid my rent.",
          "Why 90% of local businesses are still answering phones manually (The goldmine)."
        ]
      },
      {
        title: "The Solopreneur Micro-SaaS",
        niche: "Personal Finance & Side Hustles",
        summary: "Writing ultra-targeted single-function extensions for Chrome or Figma and scaling them to $5k MRC.",
        interestLevel: "Medium",
        sources: [
          { title: "IndieHackers", url: "https://indiehackers.com" }
        ],
        keyAngles: [
          "Ditching the 9-5 with only 120 lines of code.",
          "The Figma plugin that paid for a Tesla."
        ]
      }
    ],
    viralPatterns: [
      "Open with a screenshot of bank payouts or clean dashboards.",
      "Voiceover is highly direct, calm, and warning rather than hyperactive.",
      "Green screen background with a breakdown of a live case study."
    ]
  }
};

export const SAMPLE_SCRIPT: VideoScriptData = {
  title: "The Subway SaaS Challenge",
  videoType: "shorts",
  tone: "high_energy",
  concept: "Deploying a complete fully-functional web application inside a single 22-minute subway commute using autonomous AI coding agents.",
  targetAudience: "Aspiring developers, tech enthusiasts, side-hustlers, and builders tired of long development cycles.",
  psychologicalHook: "The 'Commute Proof' curiosity gap. If a functional business can be shipped during a subway ride, it removes all excuses of time or complexity from the viewer's mind.",
  titlesOptions: [
    "I built a $100/day app on a single subway ride 🚇",
    "Autonomous coding is getting out of hand...",
    "Shipping a SaaS before my train stopped",
    "No code? No problem. The 20-minute app speedrun",
    "They said AI coding agents were hype. I tested it."
  ],
  viralTagsCount: ["#startup", "#autonomousAI", "#codingagent", "#solopreneur", "#techtrends", "#productivityhack"],
  scenes: [
    {
      id: "s1",
      sceneNumber: 1,
      duration: 7,
      visualDescription: "Extreme close up of a glowing train terminal, transitioning immediately to a first-person view of a laptop open on a lap inside a moving subway car. Bold, neon-yellow captions slide in: '20 MINUTES.'",
      scriptText: "Most startups spend six months writing code and launching. Today, we have twenty-two minutes. The length of one subway ride.",
      audioSfx: "Distant hum of subway tracks transitioning to a fast, ticking digital clock sound. [subway train roar] ducks under a deep, energetic synthesizer bassline.",
      bRollPrompt: "Cinematic close-up first-person view of a modern laptop open on a subway commuter's lap, train interior passing by in motion blur, high contrast warm lighting, photorealistic."
    },
    {
      id: "s2",
      sceneNumber: 2,
      duration: 9,
      visualDescription: "Split screen: On the left, the narrator's face speaking with high engagement. On the right, the screen recording of the laptop showing an AI agent terminal spinning up code at lightning speed. Neon progress bar on screen.",
      scriptText: "I'm prompting an autonomous developer agent with a single voice note: 'Build a local neighborhood plant-watering tracker widget.' Let's watch the agent spin up the database and frontend.",
      audioSfx: "High-speed mechanical keyboard rattling sound effects. Background synth beat increases in speed and intensity.",
      bRollPrompt: "Computer screen interface showing terminal commands, code compilation, and terminal outputs running rapidly, digital matrix style, clean UI."
    },
    {
      id: "s3",
      sceneNumber: 3,
      duration: 8,
      visualDescription: "Macro pan shot of the train window reflections. Cuts back to the screen as the AI auto-corrects a broken API parameter without human assistance. Small warning symbol pops up and turns green.",
      scriptText: "Seven minutes in, we hit a deployment error. But the agent reads the log, rewrites the fetch handle, and deploys it anyway. 0 lines written by me.",
      audioSfx: "Digital prompt notification sound. [swoosh] transition. Gentle bass drop.",
      bRollPrompt: "Close-up profile of a coder focused, looking at a laptop screen in a dark cinematic ambient light, warm and cool tones, shallow depth of field."
    },
    {
      id: "s4",
      sceneNumber: 4,
      duration: 10,
      visualDescription: "Wide-angle action shot as the passenger stands up, holding the laptop. The screen shows 'DEPLOYMENT SUCCESSFUL - LIVE AT...' with a QR code. The train pulls into the destination platform.",
      scriptText: "Station arrival. The train stops, and the app is live. Scan this QR on the screen to test it yourself. A real-world tracking app, launched in under twenty-two minutes.",
      audioSfx: "Pneumatic train door hiss sound [hiss]. High frequency synth riser peaks and resolves to a crisp, punchy low-frequency thump in sync with doors opening.",
      bRollPrompt: "Subway terminal in Tokyo or New York, doors sliding open, crowds moving, bright ambient lighting, cinematic, high end anamorphic lens feel."
    },
    {
      id: "s5",
      sceneNumber: 5,
      duration: 6,
      visualDescription: "Narrator points directly at the camera with the subway station behind them. Strong yellow text on screen: 'BUILD NEXT.'",
      scriptText: "The barrier to entry is officially zero. What app are you building on your commute tomorrow? Drop your ideas below.",
      audioSfx: "Synthesizer beat fades into a warm, lingering echo. Soft wind sound effects [whoosh].",
      bRollPrompt: "Urban city street right outside a subway exit at dusk, neon signs reflecting, modern look, rich depth of field."
    }
  ],
  assemblyInstructions: [
    {
      title: "Opening 3-Second Retention Loop",
      instruction: "Add [subway rail rumble] and immediately increase the audio level in the first 0.5s. Crop the laptop screen shot at a tight 9:16 aspect ratio with high saturation to draw the eye immediately.",
      pacingNote: "Cut exactly on the syllable 'ride' in the first scene."
    },
    {
      title: "Captions Aesthetic Config",
      instruction: "Use double-line centered captions in Montserrat Bold. Color target phrases in high contrast neon yellow (#F0E51A). Apply a tiny scale bounce (1.1x -> 1.0x) on every major keyword transition.",
      pacingNote: "Word-by-word pacing is crucial; do not cluster more than 3 words per caption chunk."
    },
    {
      title: "Audio Ducking & Music Style",
      instruction: "Use 'Phonk' or 'Synthwave' high-energy background music with beats aligned to scene cuts. Duck the music background gain to -18dB during narration, and spike it by +8dB during transitions between Scene 3 and 4.",
      pacingNote: "Allow the pneumatic train door hiss sound to play in complete silence for 0.5 seconds to reset the viewer's audio threshold."
    }
  ],
  strategistNotes: "For this Short/Shorts, use a dual-layer YouTube caption and PIN the link to the live deployed widget in the first comment. This triggers immediate user interaction which tells the algorithm to push this video further. TikTok thumbnail should be the laptop displaying 'DEPLOYED' inside the subway car."
};
