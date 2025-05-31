export type PlatformType = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';

export type AccountStatus = 'connected' | 'error' | 'expired' | 'pending';

export type AuthMethod = 'oauth' | 'credentials' | 'api';

export interface SocialPlatform {
  id: PlatformType;
  name: string;
  color: string;
  description: string;
  authMethod: AuthMethod;
  permissions?: string[];
  isAvailable: boolean;
}

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  username: string;
  profileName: string;
  profileImage?: string;
  profileUrl?: string;
  status: AccountStatus;
  followers?: number;
  following?: number;
  posts?: number;
  lastSync?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectableAccount {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  followers?: number;
  isBusinessAccount?: boolean;
  accountType?: string;
}

export interface SocialAccountCreate {
  platform: PlatformType;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  selectedAccountId?: string; // For selecting specific pages/accounts during OAuth
}

export interface SocialAccountUpdate {
  username?: string;
  profileName?: string;
  profileImage?: string;
  status?: AccountStatus;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface OAuthAuthorizationUrl {
  url: string;
  state: string;
}

export interface OAuthCallback {
  code: string;
  state: string;
  platform: PlatformType;
}

export interface SocialAccountStats {
  totalAccounts: number;
  connectedAccounts: number;
  errorAccounts: number;
  totalFollowers: number;
  platformBreakdown: Record<PlatformType, number>;
}
