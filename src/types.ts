export type VideoType = 'shorts' | 'long-form';

export interface TrendTopic {
  title: string;
  niche: string;
  summary: string;
  interestLevel: 'High' | 'Medium' | 'Low';
  sources: { title: string; url: string }[];
  keyAngles: string[];
}

export interface TrendAnalysisResult {
  niche: string;
  updatedAt: string;
  trendingTopics: TrendTopic[];
  overallAnalysis: string;
  viralPatterns: string[];
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  visualDescription: string; // Camera, visuals, b-roll, text overlays
  scriptText: string; // Voiceover or on-camera text
  audioSfx: string; // Sound effects and background music style
  bRollPrompt: string; // Prompt suitable for stock footage search or image generation
}

export interface AssemblyStep {
  title: string;
  instruction: string;
  pacingNote: string;
}

export interface VideoScriptData {
  title: string;
  videoType: VideoType;
  tone: string;
  concept: string;
  targetAudience: string;
  psychologicalHook: string;
  titlesOptions: string[];
  viralTagsCount: string[];
  scenes: VideoScene[];
  assemblyInstructions: AssemblyStep[];
  strategistNotes: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: 'Trend Strategist' | 'Script Writer' | 'Scene Director' | 'Assembly Editor' | 'System';
  status: 'info' | 'success' | 'warn' | 'working';
  message: string;
}
