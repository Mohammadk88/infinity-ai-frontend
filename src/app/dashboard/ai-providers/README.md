# AI Providers Management

This feature allows users to manage their AI provider configurations within the Infinity AI System.

## Features

- View a list of all configured AI providers
- Add new AI providers with API keys
- Edit existing provider configurations
- Activate or deactivate providers
- Delete provider configurations

## Technical Implementation

The AI Providers page is built using:

- Next.js 15 with App Router
- TailwindCSS for styling
- TypeScript for type safety
- Zustand for state management
- ShadcnUI for UI components

## API Endpoints

The feature interacts with the following API endpoints:

- `GET /ai-providers/me` - List all providers for the current user
- `POST /ai-providers` - Create a new provider
- `PATCH /ai-providers/:id` - Update an existing provider
- `DELETE /ai-providers/:id` - Remove a provider

## Data Structure

```typescript
interface AIProvider {
  id: string;
  provider: string;        // openai, gemini, etc.
  apiKey: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}
```

## Files

- `/src/types/AIProvider.ts` - Type definitions
- `/src/store/useAIProviderStore.ts` - Zustand store for state management
- `/src/services/api/aiProviderService.ts` - API service
- `/src/components/ai-providers/provider-form.tsx` - Form component
- `/src/components/ai-providers/providers-list.tsx` - List component
- `/src/app/dashboard/ai-providers/page.tsx` - Main page
- `/src/app/dashboard/ai-providers/layout.tsx` - Page layout
- `/src/app/dashboard/ai-providers/loading.tsx` - Loading state
- `/src/app/dashboard/ai-providers/error.tsx` - Error handling

## Future Improvements

- Add model suggestions based on provider selection
- Implement model validation for each provider
- Add testing coverage for API interactions
- Create usage statistics for each provider
