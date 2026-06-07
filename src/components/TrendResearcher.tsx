import React, { useState } from "react";
import { Search, Flame, ExternalLink, Sparkles, AlertCircle} from "lucide-react";
import { PRESET_NICHES, SAMPLE_TRENDS } from "./types_and_presets";
import { TrendAnalysisResult, TrendTopic } from "../types";

interface TrendResearcherProps {
  onSelectAngle: (niche: string, angle: string) => void;
  onTrendAnalyzed: (trends: TrendAnalysisResult) => void;
  currentTrends: TrendAnalysisResult | null;
}

export const TrendResearcher: React.FC<TrendResearcherProps> = ({
  onSelectAngle,
  onTrendAnalyzed,
  currentTrends
}) => {
  const [selectedPreset, setSelectedPreset] = useState("tech_ai");
  const [customNiche, setCustomNiche] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePresetChange = (nicheId: string) => {
    setSelectedPreset(nicheId);
    setCustomNiche("");
    // Pre-load sample data so the user instantly sees content
    if (SAMPLE_TRENDS[nicheId]) {
      onTrendAnalyzed(SAMPLE_TRENDS[nicheId]);
    }
  };

  const executeTrendResearch = async () => {
    setIsSearching(true);
    setErrorMessage("");
    const nicheName = customNiche.trim() || 
      PRESET_NICHES.find(n => n.id === selectedPreset)?.label || "Tech & AI";

    try {
      const response = await fetch("/api/research-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: nicheName }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to execute real-time search grounding research.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      onTrendAnalyzed(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to query real-time trending models. Falling back to offline context.");
      // Fallback
      if (SAMPLE_TRENDS[selectedPreset]) {
        onTrendAnalyzed(SAMPLE_TRENDS[selectedPreset]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Set default initial trends on load
  React.useEffect(() => {
    if (!currentTrends && SAMPLE_TRENDS[selectedPreset]) {
      onTrendAnalyzed(SAMPLE_TRENDS[selectedPreset]);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl" id="trend-researcher">
      {/* Header */}
      <div className="p-4 border-b border-[#27272a] bg-[#111113] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100 tracking-tight">Social Trend Desk</h2>
            <p className="text-xs text-gray-400">Search grounded social trend radar</p>
          </div>
        </div>
        <div className="text-[10px] uppercase font-mono text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-full font-medium tracking-wider">
          Realtime Grounding
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto max-h-[820px] scrollbar-thin">
        {/* Presets Grid */}
        <div>
          <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 block">Choose Your Niche</label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_NICHES.map((n) => (
              <button
                key={n.id}
                id={`niche-btn-${n.id}`}
                onClick={() => handlePresetChange(n.id)}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-xs transition duration-200 border cursor-pointer ${
                  selectedPreset === n.id && !customNiche
                    ? "bg-[#27272a] border-[#e4e4e7] text-white"
                    : "bg-[#0c0c0e] border-[#1e1e21] text-gray-400 hover:text-gray-200 hover:border-[#38383e]"
                }`}
              >
                <span>{n.emoji}</span>
                <span className="truncate">{n.label.split(" & ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 block">Or Enter Custom Niche</label>
          <div className="relative">
            <input
              type="text"
              id="custom-niche-input"
              value={customNiche}
              onChange={(e) => {
                setCustomNiche(e.target.value);
                setSelectedPreset("");
              }}
              placeholder="e.g. Vintage Watches, Minimalist Housing, Solo Camping..."
              className="w-full bg-[#09090b] border border-[#27272a] text-xs rounded-lg pl-3 pr-10 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition"
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Action Trigger */}
        <button
          id="btn-trigger-research"
          onClick={executeTrendResearch}
          disabled={isSearching}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-500/40 disabled:to-amber-600/40 text-black font-semibold py-3 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Searching Google Live Radar...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Real-Time Trends</span>
            </>
          )}
        </button>

        {errorMessage && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-300 leading-normal">{errorMessage}</p>
          </div>
        )}

        {/* Research Results Display */}
        {currentTrends && (
          <div className="flex flex-col gap-4 mt-2 border-t border-[#27272a]/70 pt-4 animate-fade-in">
            {/* Sentiment Summary */}
            <div className="bg-[#111113] p-3.5 border border-[#27272a] rounded-lg">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-semibold">Real-Time Market Opportunity</span>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed font-sans">{currentTrends.overallAnalysis}</p>
            </div>

            {/* Rising Topics */}
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2.5 block">Hot Topics to Profit From</span>
              <div className="flex flex-col gap-3">
                {currentTrends.trendingTopics.map((topic: TrendTopic, i: number) => (
                  <div key={i} className="bg-[#0c0c0e] border border-[#212124] hover:border-[#38383c] p-4 rounded-xl transition">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-xs font-semibold text-gray-200 font-sans tracking-tight">{topic.title}</h4>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        topic.interestLevel === "High" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {topic.interestLevel} Interest
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{topic.summary}</p>

                    {/* Sources (Citations) */}
                    {topic.sources && topic.sources.length > 0 && (
                      <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 border-t border-[#1c1c1f]">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">sources:</span>
                        {topic.sources.map((src, srcIdx) => (
                          <a
                            key={srcIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-amber-400/80 hover:text-amber-300 hover:underline transition truncate max-w-[140px]"
                          >
                            <span className="truncate">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Storytelling Angles */}
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2 block">Choose An Angle to Create Script:</span>
                      <div className="flex flex-col gap-1.5">
                        {topic.keyAngles.map((angle: string, angleIdx: number) => (
                          <button
                            key={angleIdx}
                            onClick={() => onSelectAngle(topic.niche, angle)}
                            className="text-left bg-[#131316] hover:bg-amber-500/10 hover:text-amber-400 text-gray-300 p-2 border border-[#212124] hover:border-amber-500/20 rounded-md text-[11px] leading-relaxed transition cursor-pointer flex items-start gap-1."
                          >
                            <span className="text-amber-500/60 font-mono text-[10px] mr-1.5 shrink-0">#{angleIdx + 1}</span>
                            <span>{angle}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral stylistic patterns */}
            {currentTrends.viralPatterns && currentTrends.viralPatterns.length > 0 && (
              <div className="p-3 bg-[#111113] border border-[#222225] rounded-xl mb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 block">Stylistic Hooks Seen Trending</span>
                <ul className="list-disc pl-4 text-[11px] text-gray-400 leading-relaxed flex flex-col gap-1.5">
                  {currentTrends.viralPatterns.map((pattern, idx) => (
                    <li key={idx}><span className="text-gray-300">{pattern}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
