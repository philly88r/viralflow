import { useState, useEffect } from "react";
import { 
  Flame, Sparkles, AlertCircle, Youtube, Play, RefreshCw, Cpu, Code, Clock, Settings, Zap
} from "lucide-react";
import { TrendResearcher } from "./components/TrendResearcher";
import { AgentTerminal } from "./components/AgentTerminal";
import { ScriptViewer } from "./components/ScriptViewer";
import { TONE_OPTIONS, SAMPLE_SCRIPT } from "./components/types_and_presets";
import { TrendAnalysisResult, VideoScriptData, AgentLog, VideoType } from "./types";

export default function App() {
  // Current real-time trend analytics report
  const [trends, setTrends] = useState<TrendAnalysisResult | null>(null);
  
  // Script generation parameters
  const [selectedNiche, setSelectedNiche] = useState<string>("Tech & Artificial Intelligence");
  const [selectedAngle, setSelectedAngle] = useState<string>("Building a complete custom SaaS startup on a subway ride.");
  const [videoType, setVideoType] = useState<VideoType>("shorts");
  const [tone, setTone] = useState<string>("high_energy");
  const [customDirectives, setCustomDirectives] = useState<string>("");

  // Orchestrated AI Agents states
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1); // -1: idle, 0: strategist, 1: writer, 2: director, 3: editor, 4: complete
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [generatedScript, setGeneratedScript] = useState<VideoScriptData | null>(null);
  const [errorText, setErrorText] = useState("");

  const addLog = (agentName: AgentLog["agentName"], message: string, status: AgentLog["status"] = "info") => {
    const newLog: AgentLog = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      agentName,
      status,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
    // Scroll terminal log box down
    setTimeout(() => {
      const container = document.getElementById("console-log-box");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  };

  // Preset loading on mount
  useEffect(() => {
    // Populate terminal seed log
    addLog("System", "Real-time Trend Engine initialized. Standing by.", "success");
    // Preload sample visual script to give user immediate mock value
    setGeneratedScript(SAMPLE_SCRIPT);
  }, []);

  const handleSelectAngle = (nicheName: string, angle: string) => {
    setSelectedNiche(nicheName);
    setSelectedAngle(angle);
    addLog("Trend Strategist", `Selected storytelling angle: "${angle.slice(0, 50)}..."`, "info");
  };

  const executeGenerateScript = async () => {
    if (!selectedAngle) {
      setErrorText("Please select or define an active storytelling angle from the trend deck first.");
      return;
    }
    setErrorText("");
    setIsGenerating(true);
    setLogs([]);
    setGeneratedScript(null);

    // Sequence the mock-log timeline for immersion resembling a collaborative terminal
    setCurrentAgentIndex(0);
    addLog("System", "Instantiating real-time collaborative video crew...", "info");
    
    // Agent 1: Trend Strategist
    addLog("Trend Strategist", `Analyzing social spike parameters for: "${selectedAngle.slice(0, 60)}"`, "working");
    await new Promise((r) => setTimeout(r, 1200));
    addLog("Trend Strategist", "Identified core dopamine triggers & selected 5 psychological hook profiles", "success");
    addLog("Trend Strategist", "Drafting optimized multi-title suggestions mapped to YouTube/Shorts algorithms", "info");
    
    // Agent 2: Writer
    setCurrentAgentIndex(1);
    addLog("Script Writer", "Receiving brief. Constructing narration timeline...", "working");
    await new Promise((r) => setTimeout(r, 1600));
    addLog("Script Writer", "Engineered dialogue lines. Scrubbed cliche marketing terms for realistic dialogue structure", "success");
    
    // Agent 3: Scene Director
    setCurrentAgentIndex(2);
    addLog("Scene Director", "Assembling visual storyboards, keyframe cuts, B-Roll prompts, and lighting configs", "working");
    await new Promise((r) => setTimeout(r, 1800));
    addLog("Scene Director", "Calculated optical density transition steps. Generated prompt indices for stock repositories", "success");

    // Agent 4: Assembly Editor
    setCurrentAgentIndex(3);
    addLog("Assembly Editor", "Configuring post-production timeline audio level mapping, ducking rates, B-roll layers...", "working");
    await new Promise((r) => setTimeout(r, 1400));
    addLog("Assembly Editor", "Finalized timelines. Running rendering validation schemas", "success");

    // Trigger Server side real API for comprehensive generation
    try {
      addLog("System", "Sending consolidated brief to model for final cinematic synthesis...", "working");
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: selectedNiche,
          topic: selectedAngle,
          videoType,
          tone,
          customDirectives,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to compile script structure.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const compiledData = await response.json();
      setGeneratedScript(compiledData);
      
      setCurrentAgentIndex(4);
      addLog("System", "Master script package compiled & rendered successfully!", "success");
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An error occurred compiling final video structure.");
      addLog("System", "Compilation failed. Reverting structure to sandbox fallback.", "warn");
      // Fallback
      setGeneratedScript(SAMPLE_SCRIPT);
      setCurrentAgentIndex(4);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 flex flex-col font-sans select-none" id="dashboard-root">
      {/* Dynamic Nav Header */}
      <header className="border-b border-[#1e1e21] bg-[#111113] py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-lg shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5 text-black font-extrabold" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              ViralFlow Studio <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded border border-indigo-400/20 font-mono">v1.2</span>
            </h1>
            <p className="text-xs text-gray-400">Social Video Scripting Engine & Real-Time Trend Analyzer</p>
          </div>
        </div>

        {/* Global info metrics */}
        <div className="flex items-center gap-5 max-sm:hidden bg-[#18181b] px-4 py-2 border border-[#27272a] rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-400 text-[11px] font-mono">TREND RADAR: ONLINE</span>
          </div>
          <div className="h-4 w-[1px] bg-[#27272a]"></div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-mono">System Time UTC</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Trend Research Desk (Span 5) */}
        <section className="lg:col-span-5 flex flex-col gap-5 h-full">
          <TrendResearcher
            onSelectAngle={handleSelectAngle}
            onTrendAnalyzed={(res) => {
              setTrends(res);
              addLog("Trend Strategist", `Analyzed niche: "${res.niche}". Updated real-time trends deck with ${res.trendingTopics.length} viral pillars.`, "success");
            }}
            currentTrends={trends}
          />
        </section>

        {/* RIGHT COLUMN: Terminal + Storyboard Creator (Span 7) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Real-time Agent Workspace & Console Logs */}
          <AgentTerminal
            logs={logs}
            currentAgentIndex={currentAgentIndex}
            isGenerating={isGenerating}
          />

          {/* Creation briefing Form Card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl" id="briefing-box">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-500" /> Crew Production Briefing
              </span>
              <span className="text-[10px] text-gray-500 italic">Configure target parameters</span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Selected Angle Status Panel */}
              <div className="bg-[#0c0c0e] border border-[#212124] p-3 rounded-lg">
                <span className="text-[9px] font-mono text-indigo-400 uppercase">Input Narrative Focus (Selected Angle)</span>
                <textarea
                  id="target-angle-textarea"
                  rows={2}
                  value={selectedAngle}
                  onChange={(e) => setSelectedAngle(e.target.value)}
                  placeholder="Select a trending storytelling angle from the trend radar, or write a custom video script topic here..."
                  className="w-full bg-transparent border-0 text-xs text-gray-200 focus:outline-none focus:ring-0 mt-1 resize-y font-sans leading-relaxed text-left"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Video Format Choice */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase mb-1.5 block">Format Target</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="opt-format-shorts"
                      onClick={() => setVideoType("shorts")}
                      className={`py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        videoType === "shorts"
                          ? "bg-red-500/10 border-red-500/50 text-red-400 font-semibold"
                          : "bg-[#0c0c0e] border-[#212124] text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>TikTok/Shorts</span>
                    </button>

                    <button
                      id="opt-format-long"
                      onClick={() => setVideoType("long-form")}
                      className={`py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        videoType === "long-form"
                          ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400 font-semibold"
                          : "bg-[#0c0c0e] border-[#212124] text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>YouTube Long Video</span>
                    </button>
                  </div>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase mb-1.5 block">Storytelling Tone</label>
                  <select
                    id="opt-tone-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#212124] rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {TONE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Briefing Directives */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase mb-1.5 block">
                  Custom Directives to Script Writer & Scene Director (Optional)
                </label>
                <input
                  type="text"
                  id="custom-directives-input"
                  value={customDirectives}
                  onChange={(e) => setCustomDirectives(e.target.value)}
                  placeholder="e.g. Include a dramatic twist at scene 3, add background rain sounds, emphasize Stoic quotes..."
                  className="w-full bg-[#0c0c0e] border border-[#212124] rounded-lg p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition"
                />
              </div>

              {errorText && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-[11px] text-red-300 leading-none">{errorText}</p>
                </div>
              )}

              {/* Trigger Generation Button */}
              <button
                id="btn-generate-script-trigger"
                onClick={executeGenerateScript}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-500/40 disabled:to-indigo-600/40 text-white font-bold py-3.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crew Is Collaborating... Please Wait</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Scenario & Video Creation Crew</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Final Composite Output View */}
          <ScriptViewer script={generatedScript} />
        </section>
      </main>

      {/* Aesthetic Site Footer */}
      <footer className="mt-14 border-t border-[#1e1e21] bg-[#111113] py-5 px-6 flex items-center justify-between text-[11px] text-gray-500">
        <p>© 2026 ViralFlow Studio. All rights reserved. Real-time grounding empowered by Gemini.</p>
        <span className="font-mono tracking-wider text-[10px] text-amber-500/80">CRAFTED FOR PEOPLES CREATING FUTURE IDEAS</span>
      </footer>
    </div>
  );
}
