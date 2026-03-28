export type SourceKind = "gmi" | "fallback";
export type ChatStage = "market" | "audience" | "hook" | "done";
export type MarketId = "us" | "jp" | "eu" | "sea";

export type ApiError = {
  code: string;
  message: string;
};

export type ApiEnvelope<T> = {
  source: SourceKind;
  data: T;
  error?: ApiError | null;
};

export type ChatOption = {
  id: string;
  label: string;
  description: string;
  badge?: string;
};

export type ChatResponse = {
  stage: ChatStage;
  assistant: string;
  options: ChatOption[];
  suggestedIdea: string;
};

export type AudienceProfile = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  painPoint: string;
  willingnessToPay: string;
};

export type HookOption = {
  id: string;
  title: string;
  subtitle: string;
  heat: number;
};

export type PositioningCard = {
  productTitle: string;
  productSubtitle: string;
  marketLabel: string;
  marketInsight: string;
  targetAudience: AudienceProfile;
  hooks: HookOption[];
  selectedHook: string;
  brandName: string;
  oneLiner: string;
  localizationAngle: string;
};

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

export type ChannelRecommendation = {
  name: string;
  emoji: string;
  badges: string[];
  stat: string;
  reach: string;
  actionLabel: string;
};

export type MaterialPost = {
  type: string;
  content: string;
  hashtags: string;
};

export type StoryFrame = {
  title: string;
  description: string;
  text: string;
  visual: string;
};

export type Metric = {
  label: string;
  subtitle: string;
  value: string;
  change: string;
  trend: "up" | "neutral" | "down";
};

export type TrafficPoint = {
  day: string;
  value: number;
};

export type ChannelSplit = {
  name: string;
  value: number;
};

export type ContentPerformance = {
  title: string;
  type: string;
  views: string;
  likes?: number;
  comments?: number;
  completion?: string;
  badge?: string | null;
};

export type WorkspaceData = {
  title: string;
  subtitle: string;
  channel: string;
  publishWindow: string;
  publishCadence: string;
  timeline: TimelineItem[];
  checklist: ChecklistItem[];
  channelRecommendation: ChannelRecommendation;
  standbyChannels: string[];
  posts: MaterialPost[];
  storyFrames: StoryFrame[];
  hashtags: string[];
  metrics: Metric[];
  traffic: TrafficPoint[];
  channelSplit: ChannelSplit[];
  contentPerformance: ContentPerformance[];
  warnings: string[];
  recommendations: string[];
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  description: string;
  benefits: string[];
  accent: string;
  aura: string;
  rating: number;
  reviews: number;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type LandingData = {
  brandName: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  shippingNote: string;
  storyTitle: string;
  storyBody: string;
  products: Product[];
  faqs: FAQItem[];
  editPrompts: string[];
};

export type DemoSession = {
  idea: string;
  market?: MarketId;
  audienceId?: string;
  hookId?: string;
  positioning?: PositioningCard;
  workspace?: WorkspaceData;
  landing?: LandingData;
  source?: SourceKind;
  cartCount?: number;
};
