export type LinkCategory = 'stream' | 'gaming_id' | 'social' | 'community' | 'support';

export type PlatformType =
  | 'twitch'
  | 'youtube'
  | 'kick'
  | 'discord'
  | 'steam'
  | 'riot'
  | 'battlenet'
  | 'xbox'
  | 'playstation'
  | 'epic'
  | 'tiktok'
  | 'twitter'
  | 'instagram'
  | 'spotify'
  | 'merch'
  | 'donation'
  | 'custom';

export interface GamerLink {
  id: string;
  platform: PlatformType;
  label: string;
  url: string;
  usernameOrHandle: string;
  category: LinkCategory;
  isHighlighted?: boolean;
  actionType: 'open_url' | 'copy_tag' | 'both';
  enabled: boolean;
  subtitle?: string;
}

export type ProfileStatus = 'streaming' | 'competitive' | 'offline' | 'casual';

export type ThemeStyle = 'obsidian' | 'cyberpunk' | 'emerald' | 'crimson' | 'solargold' | 'monochrome';

export interface MainGame {
  name: string;
  rank?: string;
  role?: string;
}

export interface SetupSpec {
  category: string;
  item: string;
}

export interface StreamSchedule {
  day: string;
  time: string;
  activity: string;
}

export interface GamerProfile {
  gamerTag: string;
  realName?: string;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
  region: string;
  teamOrClan: string;
  status: ProfileStatus;
  statusText: string;
  statusUrl: string;
  badges: string[];
  mainGames: MainGame[];
  theme: ThemeStyle;
  cardLayout: 'grid' | 'list';
  featuredVideoUrl?: string;
  featuredVideoTitle?: string;
  setupSpecs: SetupSpec[];
  schedule: StreamSchedule[];
  links: GamerLink[];
}
