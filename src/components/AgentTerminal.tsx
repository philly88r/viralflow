import React from "react";
import { Cpu, CheckCircle, Clock, Play, Loader } from "lucide-react";
import { AgentLog } from "../types";

interface AgentTerminalProps {
  logs: AgentLog[];
  currentAgentIndex: number; // -1 if not running, 4 if completed, 0-3 for current active agent
  isGenerating: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  logs,
  currentAgentIndex,
  isGenerating
}) => {
  const steps = [
    { title: "Trend Strategist", desc: "Narrowing psychological angles & target profiles" },
    { title: "Script Writer", desc: "Crafting non-cliche, highly engaging visual narration" },
    { title: "Scene Director", desc: "Edits, typography styles, camera angles, storyboards" },
    { title: "Assembly Editor", desc: "Sound design overlay, background tracks, exact pacing" }
  ];

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl" id="agent-terminal">
      {/* Header */}
      <div className="p-4 border-b border-[#27272a] bg-[#111113] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100 tracking-tight">Agent Crew Workspace</h2>
            <p className="text-xs text-gray-400">Collaborative intelligence console</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isGenerating && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-505 bg-indigo-500"></span>
            </span>
          )}
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-[#222225] px-2 py-0.5 rounded">
            {isGenerating ? "processing" : "idle"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Agent workflow indicators */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = currentAgentIndex > idx;
            const isActive = currentAgentIndex === idx && isGenerating;
            const isPending = currentAgentIndex < idx || (!isGenerating && currentAgentIndex !== 4);

            let borderClass = "border-[#1e1e21] bg-[#0c0c0e]";
            let textClass = "text-gray-500";
            let iconColor = "text-gray-600";

            if (isCompleted) {
              borderClass = "border-green-500/20 bg-green-500/5";
              textClass = "text-gray-300";
              iconColor = "text-green-500";
            } else if (isActive) {
              borderClass = "border-indigo-500/30 bg-indigo-500/5 animate-pulse";
              textClass = "text-indigo-200";
              iconColor = "text-indigo-400";
            }

            return (
              <div key={idx} className={`p-2.5 rounded-lg border flex flex-col items-center text-center transition-all ${borderClass}`}>
                <div className="mb-1.5">
                  {isCompleted ? (
                    <CheckCircle className={`w-4 h-4 ${iconColor}`} />
                  ) : isActive ? (
                    <Loader className={`w-4 h-4 animate-spin ${iconColor}`} />
                  ) : (
                    <Clock className={`w-4 h-4 ${iconColor}`} />
                  )}
                </div>
                <h4 className={`text-[10px] font-semibold transition ${textClass}`}>{step.title}</h4>
                <p className="text-[8px] text-gray-500 leading-tight mt-0.5 max-sm:hidden truncate w-full">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live console terminal output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-[#111113] px-3.5 py-1.5 border border-[#27272a] border-b-0 rounded-t-lg">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">CREW_SESSION_OUTPUT</span>
            <span className="text-[9px] font-mono text-gray-500">Live logs</span>
          </div>

          <div
            id="console-log-box"
            className="bg-[#09090b] border border-[#27272a] rounded-b-lg p-3.5 h-[160px] overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-2 scrollbar-thin select-text"
          >
            {logs.length === 0 ? (
              <div className="text-gray-600 italic flex items-center gap-2 h-full justify-center">
                <Play className="w-3.5 h-3.5" />
                <span>Configure script params below and trigger generation to spin up the agents.</span>
              </div>
            ) : (
              logs.map((log) => {
                let statusColor = "text-indigo-400";
                if (log.status === "success") statusColor = "text-green-400";
                if (log.status === "warn") statusColor = "text-amber-500";
                if (log.status === "working") statusColor = "text-indigo-400 animate-pulse";

                return (
                  <div key={log.id} className="flex gap-2 items-start border-b border-[#1c1c1f]/40 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-600 shrink-0 text-[10px]">[{log.timestamp.slice(11, 19)}]</span>
                    <span className="text-gray-400 shrink-0 font-bold text-[10px]">&lt;{log.agentName}&gt;</span>
                    <span className={`${statusColor} flex-1 text-gray-300 font-sans`}>{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
