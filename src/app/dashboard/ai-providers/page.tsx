'use client';

/**
 * AI Providers Management Page
 * 
 * This page allows users to manage their AI provider configurations. Users can:
 * - View a list of all their configured AI providers
 * - Add new AI providers with API keys
 * - Edit existing provider configurations
 * - Activate or deactivate providers
 * - Delete provider configurations
 * 
 * The page communicates with the following API endpoints:
 * - GET /ai-providers/me - List all providers
 * - POST /ai-providers - Create a new provider
 * - PATCH /ai-providers/:id - Update an existing provider
 * - DELETE /ai-providers/:id - Remove a provider
 */

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAIProviderStore } from '@/store/useAIProviderStore';
import { AIProvider, AIProviderCreate, AIProviderUpdate } from '@/types/AIProvider';
import ProviderForm from '@/components/ai-providers/provider-form';
import ProvidersList from '@/components/ai-providers/providers-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function AIProvidersPage() {
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  
  const { providers, isLoading, error, fetchProviders, addProvider, updateProvider, deleteProvider } = useAIProviderStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleAddProvider = async (data: AIProviderCreate | AIProviderUpdate) => {
    await addProvider(data as AIProviderCreate);
    setIsAddingProvider(false);
  };

  const handleUpdateProvider = async (data: AIProviderUpdate) => {
    if (!editingProvider) return;
    await updateProvider(editingProvider.id, data);
    setEditingProvider(null);
  };

  const handleCancel = () => {
    setIsAddingProvider(false);
    setEditingProvider(null);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateProvider(id, { isActive });
  };

  if (error) {
    toast({
      title: 'Error',
      description: error,
      variant: 'destructive',
    });
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Providers</h1>
          <p className="text-muted-foreground">
            Manage your AI provider configurations and API keys
          </p>
        </div>
        {!isAddingProvider && !editingProvider && (
          <Button onClick={() => setIsAddingProvider(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        )}
      </div>

      {isLoading && !providers.length ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <>
          {isAddingProvider && (
            <ProviderForm 
              onSubmit={handleAddProvider} 
              onCancel={handleCancel} 
            />
          )}

          {editingProvider && (
            <ProviderForm 
              provider={editingProvider} 
              onSubmit={handleUpdateProvider} 
              onCancel={handleCancel} 
            />
          )}

          {!isAddingProvider && !editingProvider && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Providers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <ProvidersList 
                  providers={providers} 
                  onEdit={setEditingProvider} 
                  onDelete={deleteProvider}
                  onToggleActive={handleToggleActive}
                />
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                <ProvidersList 
                  providers={providers.filter(p => p.isActive)} 
                  onEdit={setEditingProvider} 
                  onDelete={deleteProvider}
                  onToggleActive={handleToggleActive}
                />
              </TabsContent>
              
              <TabsContent value="inactive" className="mt-6">
                <ProvidersList 
                  providers={providers.filter(p => !p.isActive)} 
                  onEdit={setEditingProvider} 
                  onDelete={deleteProvider}
                  onToggleActive={handleToggleActive}
                />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About AI Providers</CardTitle>
          <CardDescription>
            Connect to various AI providers to enhance your Infinity AI experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">OpenAI</h3>
              <p className="text-sm text-muted-foreground">
                Connect to OpenAI&apos;s GPT models for advanced text generation and analysis.
                Available models include gpt-4-turbo, gpt-4o, gpt-3.5-turbo.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Google Gemini</h3>
              <p className="text-sm text-muted-foreground">
                Google&apos;s Gemini models provide multimodal capabilities with excellent 
                performance. Models include gemini-pro and gemini-ultra.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Anthropic Claude</h3>
              <p className="text-sm text-muted-foreground">
                Anthropic&apos;s Claude models excel at thoughtful, nuanced responses and 
                longer context windows. Models include claude-3-opus and claude-3-sonnet.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Mistral AI</h3>
              <p className="text-sm text-muted-foreground">
                Mistral AI provides efficient and powerful models with excellent 
                performance-to-size ratio. Models include mistral-large and mistral-medium.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
