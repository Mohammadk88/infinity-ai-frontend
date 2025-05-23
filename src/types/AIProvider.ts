export interface AIProvider {
  id: string;
  provider: string;        // openai, gemini, etc.
  apiKey: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}

// For creating a new provider
export interface AIProviderCreate {
  provider: string;
  apiKey: string;
  model: string;
  isActive: boolean;
}

// For updating an existing provider
export interface AIProviderUpdate {
  provider?: string;
  apiKey?: string;
  model?: string;
  isActive?: boolean;
}
