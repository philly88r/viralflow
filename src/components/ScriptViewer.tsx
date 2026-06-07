import React, { useState } from "react";
import { 
  FileText, Tv, ListChecks, HelpCircle, Copy, Check, Sparkles, 
  Lightbulb, Music, Play, Video, ChevronRight, MessageSquare, Layers
} from "lucide-react";
import { VideoScriptData, VideoScene } from "../types";

interface ScriptViewerProps {
  script: VideoScriptData | null;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  const [activeTab, setActiveTab] = useState<"storyboard" | "strategist" | "editor">("storyboard");
  const [copiedText, setCopiedText] = useState<Record<string, boolean>>({});
  const [playbackSceneId, setPlaybackSceneId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedText((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const calculateTotalDuration = (scenes: VideoScene[]) => {
    return scenes.reduce((acc, scene) => acc + (scene.duration || 0), 0);
  };

  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 bg-[#18181b] border border-[#27272a] rounded-xl text-center min-h-[400px]" id="script-viewer-empty">
        <div className="p-4 bg-[#232326] rounded-full text-gray-500 mb-4 animate-bounce">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-semibold text-gray-200">No Script Loaded</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Select trending social angles or type a custom topic in the Trend Desk on the left to start generating.
        </p>
      </div>
    );
  }

  const totalDir = calculateTotalDuration(script.scenes);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl flex flex-col h-full animate-fade-in" id="script-viewer">
      {/* Top Banner Info */}
      <div className="p-5 border-b border-[#27272a] bg-gradient-to-r from-[#17171a] via-[#111113] to-[#17171a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border ${
              script.videoType === "shorts" 
                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                : "bg-[#2563eb]/10 text-[#60a5fa] border-[#2563eb]/20"
            }`}>
              {script.videoType === "shorts" ? "9:16 Short-Form" : "16:9 Long-Form"}
            </span>
            <span className="text-[10px] font-mono text-gray-400 bg-[#27272a] px-2.5 py-0.5 rounded-full capitalize">
              Tone: {script.tone}
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              ⚡ Est. Pacing: {totalDir}s
            </span>
          </div>
          <h2 className="text-base font-bold text-gray-100 tracking-tight font-sans">{script.title}</h2>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">Concept: {script.concept}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#0c0c0e] p-1 border border-[#212124] rounded-lg self-start md:self-center">
          <button
            onClick={() => setActiveTab("storyboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "storyboard"
                ? "bg-[#27272a] text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-amber-500" />
            <span>Storyboard Room</span>
          </button>
          
          <button
            onClick={() => setActiveTab("strategist")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "strategist"
                ? "bg-[#27272a] text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Trend Strategist</span>
          </button>

          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "editor"
                ? "bg-[#27272a] text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
            <span>Assembly Instructions</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[660px] scrollbar-thin">
        {/* TAB 1: STORYBOARD */}
        {activeTab === "storyboard" && (
          <div className="flex flex-col gap-6">
            {/* Hook Banner */}
            <div className="bg-[#111113] border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
              <div className="p-1 rounded bg-amber-500/10 text-amber-500 mt-0.5 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Hook Strategy Designed</dt>
                <dd className="text-xs text-gray-200 mt-1 font-sans font-medium">{script.psychologicalHook}</dd>
              </div>
            </div>

            {/* Scenes Timeline */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Scene Storyboard Flow</span>
              {script.scenes.map((scene, i) => (
                <div 
                  key={scene.id || i} 
                  className={`border rounded-xl transition overflow-hidden relative ${
                    playbackSceneId === scene.id 
                      ? "border-amber-500/50 bg-amber-500/[0.02]" 
                      : "border-[#212124] bg-[#0c0c0e]"
                  }`}
                >
                  {/* Scene Ribbon */}
                  <div className="px-4 py-2 bg-[#121214] border-b border-[#212124] flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        ⏱️ Duration: <strong className="text-gray-200">{scene.duration}s</strong>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(scene.scriptText, `scene-script-${i}`)}
                        className="p-1.5 text-gray-400 hover:text-gray-200 rounded hover:bg-[#1a1a1d] transition cursor-pointer"
                        title="Copy Voiceover Text"
                      >
                        {copiedText[`scene-script-${i}`] ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-mono px-1">
                            <Copy className="w-3 h-3" /> Voiceover
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Visual Description & Director's Prompt */}
                    <div className="md:col-span-7 flex flex-col gap-3">
                      <div>
                        <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">Director's Eye (Visual Style)</span>
                        <p className="text-xs text-gray-300 leading-relaxed bg-[#111113] p-2.5 rounded-lg border border-[#212124] font-sans">
                          {scene.visualDescription}
                        </p>
                      </div>

                      {/* Stock / B-Roll prompt box */}
                      <div className="bg-[#141416]/50 border border-dashed border-[#2b2b30] p-3 rounded-lg">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Video className="w-3 h-3 text-amber-500" /> B-Roll Search / AI Prompt
                          </span>
                          <button
                            onClick={() => copyToClipboard(scene.bRollPrompt, `broll-prompt-${i}`)}
                            className="text-[10px] font-mono text-gray-500 hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
                          >
                            {copiedText[`broll-prompt-${i}`] ? (
                              <Check className="w-2.5 h-2.5 text-green-400" />
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" /> Copy B-Roll Prompt
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono italic leading-normal select-all">
                          "{scene.bRollPrompt}"
                        </p>
                      </div>
                    </div>

                    {/* Speech / Voiceover & Audio FX and SFX layer */}
                    <div className="md:col-span-5 flex flex-col justify-between gap-3 bg-[#111113]/40 border-l border-[#212124]/70 pl-0 md:pl-4">
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">Narrator Hook (What is Said)</span>
                        <div className="p-3 bg-[#09090b] text-gray-100 font-medium text-xs border border-emerald-500/10 rounded-lg leading-relaxed relative min-h-[50px] shadow-inner font-sans">
                          "{scene.scriptText}"
                        </div>
                      </div>

                      {/* Music & SFX Instruction */}
                      <div className="bg-indigo-950/10 p-3.5 border border-indigo-900/10 rounded-lg flex items-start gap-2">
                        <Music className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-300">SFX / Music Track Layer</span>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{scene.audioSfx}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGIST */}
        {activeTab === "strategist" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* Clickable Titles */}
            <div className="bg-[#111113] border border-[#212124] p-4 rounded-xl">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-semibold block mb-2.5">
                🔥 High CTR Clickbait Options
              </span>
              <div className="flex flex-col gap-2">
                {script.titlesOptions.map((title, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 bg-[#09090b] border border-[#212124] p-3 rounded-lg hover:border-[#33333c] transition">
                    <span className="text-xs font-semibold text-gray-200 tracking-tight">{title}</span>
                    <button
                      onClick={() => copyToClipboard(title, `title-${idx}`)}
                      className="text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
                    >
                      {copiedText[`title-${idx}`] ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience & Niche Strategist Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111113] border border-[#212124] p-4 rounded-xl">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold block mb-2.5">
                  👤 Target Demographics
                </span>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#09090b] border border-[#212124] p-3 rounded-lg">
                  {script.targetAudience}
                </p>
              </div>

              <div className="bg-[#111113] border border-[#212124] p-4 rounded-xl">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block mb-2.5">
                  🧪 Psychological Triggers
                </span>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#09090b] border border-[#212124] p-3 rounded-lg">
                  {script.psychologicalHook}
                </p>
              </div>
            </div>

            {/* Viral Hashtags */}
            <div className="bg-[#111113] border border-[#212124] p-4 rounded-xl">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">Recommended Algorithm Tagging</span>
              <div className="flex flex-wrap gap-2">
                {script.viralTagsCount.map((tag, idx) => (
                  <span key={idx} className="bg-[#27272a]/50 text-gray-300 px-3 py-1.5 rounded-lg border border-[#2d2d31] text-xs font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategist Notes */}
            <div className="bg-amber-950/10 border border-amber-500/20 p-4 rounded-xl relative overflow-hidden">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">
                🗣️ Parting Advice from the Strategist
              </span>
              <p className="text-xs text-gray-300 leading-normal mt-1 block">
                {script.strategistNotes}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: EDITOR ASSEMBLY */}
        {activeTab === "editor" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
              🛠️ Post-Production Timeline Assembly Directions
            </span>
            {script.assemblyInstructions.map((step, idx) => (
              <div key={idx} className="bg-[#0c0c0e] border border-[#212124] p-4 rounded-xl flex items-start gap-4 hover:border-[#313134] transition">
                <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 text-xs font-mono font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <h4 className="text-xs font-semibold text-gray-200">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.instruction}</p>
                  
                  {step.pacingNote && (
                    <div className="mt-1.5 p-2 bg-[#121214] border-l-2 border-emerald-500 text-[10px] font-mono text-emerald-300">
                      💡 Retention Note: {step.pacingNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
