export type WorkspaceTab = "overview" | "materials" | "analytics";

export type TimelineItem = {
  day: string;
  title: string;
  description: string;
  active?: boolean;
};

export type ChecklistItem = {
  id: number;
  name: string;
  completed: boolean;
};

export type ChannelSuggestion = {
  name: string;
  label: string;
  reach: string;
  reason: string;
  active?: boolean;
};

export type PostDraft = {
  type: string;
  content: string;
  hashtags: string;
};

export type StoryFrame = {
  title: string;
  description: string;
  copy: string;
  visual: string;
};

export type WorkspaceAnalyticsMetric = {
  label: string;
  subtitle: string;
  value: string;
  change: string;
  trend: "up" | "neutral" | "down";
};

export type WorkspaceData = {
  sessionId: string;
  idea: string;
  market: string;
  audience: string;
  positioning: string;
  source: "gmi" | "fallback";
  workspace: {
    timeline: TimelineItem[];
    checklist: ChecklistItem[];
    channels: ChannelSuggestion[];
    seo: {
      highTraffic: Array<{ term: string; volume: string }>;
      longTail: string[];
      title: string;
    };
  };
  materials: {
    currentChannel: string;
    bestTime: string;
    frequency: string;
    posts: PostDraft[];
    storyFrames: StoryFrame[];
    hashtags: string[];
  };
  analytics: {
    metrics: WorkspaceAnalyticsMetric[];
    traffic: Array<{ day: string; value: number }>;
    channels: Array<{ name: string; value: number; color: string }>;
    contentPerformance: Array<{
      title: string;
      type: string;
      views: string;
      likes?: number;
      comments?: number;
      completion?: string;
      badge?: string;
    }>;
    alerts: Array<{
      tone: "warning" | "info";
      title: string;
      message: string;
    }>;
  };
};
