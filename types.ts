export interface TeaserSegment {
  phase: string; // "The Incline", "The Drop", etc.
  startTime: string;
  endTime: string;
  duration: string;
  startWord: string;
  endWord: string;
  contentQuote: string; // The actual text content
  bRoll?: string; // Optional B-Roll suggestion
}

export interface ReelClip {
  reelNumber: number;
  startTime: string;
  endTime: string;
  duration: string;
  startWord: string;
  endWord: string;
  contentQuote: string;
  notes: string; // Why it was selected
  bRoll?: string; // Optional B-Roll suggestion
}

export interface AnalysisResult {
  teaser: TeaserSegment[];
  reels: ReelClip[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}