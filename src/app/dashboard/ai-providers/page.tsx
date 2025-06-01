'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BrainCircuit,
  Settings,
  Plus,
  ExternalLink,
  Key,
  Shield,
  Info
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  isEnabled: boolean;
  tier: 'free' | 'business' | 'agency';
  features: string[];
  apiKeyRequired: boolean;
  status: 'active' | 'inactive' | 'error';
  usage?: {
    current: number;
    limit: number;
    period: string;
  };
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: 'Advanced language models including GPT-4 for content generation',
      icon: '🤖',
      isConnected: true,
      isEnabled: true,
      tier: 'free',
      features: ['Text Generation', 'Content Writing', 'Code Generation'],
      apiKeyRequired: true,
      status: 'active',
      usage: {
        current: 1250,
        limit: 2000,
        period: 'month'
      }
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'High-quality AI assistant for complex reasoning and analysis',
      icon: '🧠',
      isConnected: false,
      isEnabled: false,
      tier: 'business',
      features: ['Advanced Reasoning', 'Long-form Content', 'Analysis'],
      apiKeyRequired: true,
      status: 'inactive'
    },
    {
      id: 'stability',
      name: 'Stability AI',
      description: 'State-of-the-art image generation and editing capabilities',
      icon: '🎨',
      isConnected: true,
      isEnabled: true,
      tier: 'business',
      features: ['Image Generation', 'Image Editing', 'Style Transfer'],
      apiKeyRequired: true,
      status: 'active',
      usage: {
        current: 45,
        limit: 100,
        period: 'month'
      }
    },
    {
      id: 'google',
      name: 'Google Gemini',
      description: 'Multimodal AI for text, image, and video understanding',
      icon: '⚡',
      isConnected: false,
      isEnabled: false,
      tier: 'agency',
      features: ['Multimodal AI', 'Video Analysis', 'Real-time Processing'],
      apiKeyRequired: true,
      status: 'inactive'
    },
    {
      id: 'cohere',
      name: 'Cohere',
      description: 'Enterprise-grade language models for business applications',
      icon: '🔗',
      isConnected: false,
      isEnabled: false,
      tier: 'agency',
      features: ['Enterprise AI', 'Custom Models', 'Advanced Security'],
      apiKeyRequired: true,
      status: 'inactive'
    }
  ]);

  const [newApiKey, setNewApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleToggleProvider = (providerId: string) => {
    setProviders(prev => prev.map(provider =>
      provider.id === providerId
        ? { ...provider, isEnabled: !provider.isEnabled }
        : provider
    ));
  };

  const handleConnectProvider = (providerId: string) => {
    if (!newApiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    setProviders(prev => prev.map(provider =>
      provider.id === providerId
        ? { ...provider, isConnected: true, status: 'active' as const }
        : provider
    ));
    
    setNewApiKey('');
    setSelectedProvider(null);
    alert('Provider connected successfully!');
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-primary/10 text-primary border-primary/20';
      case 'business': return 'bg-primary/15 text-primary border-primary/30';
      case 'agency': return 'bg-primary/20 text-primary border-primary/40';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary';
      case 'inactive': return 'text-muted-foreground';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">AI Providers</h1>
          </div>
          <p className="text-muted-foreground">
            Connect and manage your AI service providers for enhanced content generation
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Provider
        </Button>
      </div>

      {/* Plan Notice */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary">Custom AI Provider Support</h3>
              <p className="text-primary/80 text-sm mt-1">
                Advanced AI provider integration is available with Small Business ($59/month) and Agency plans. 
                Upgrade to connect multiple providers and access enterprise-grade AI capabilities.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold mt-2">
                View Pricing Plans →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {/* Providers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className={cn(
                "relative transition-all duration-200",
                provider.isConnected 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border hover:shadow-md hover:border-primary/20"
              )}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTierBadgeColor(provider.tier)}>
                            {provider.tier.charAt(0).toUpperCase() + provider.tier.slice(1)}
                          </Badge>
                          <div className={cn("flex items-center space-x-1", getStatusColor(provider.status))}>
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              provider.status === 'active' ? "bg-primary" :
                              provider.status === 'error' ? "bg-destructive" : "bg-muted-foreground"
                            )} />
                            <span className="text-xs font-medium capitalize">{provider.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={provider.isEnabled}
                      onCheckedChange={() => handleToggleProvider(provider.id)}
                      disabled={!provider.isConnected}
                    />
                  </div>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Usage (if connected) */}
                  {provider.isConnected && provider.usage && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Usage this {provider.usage.period}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{provider.usage.current.toLocaleString()} / {provider.usage.limit.toLocaleString()}</span>
                          <span className="text-muted-foreground">
                            {Math.round((provider.usage.current / provider.usage.limit) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                            style={{ width: `${Math.min((provider.usage.current / provider.usage.limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4">
                  {provider.isConnected ? (
                    <div className="flex w-full space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Docs
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => setSelectedProvider(provider.id)}
                      disabled={provider.tier === 'business' || provider.tier === 'agency'}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {provider.tier === 'business' || provider.tier === 'agency' ? 'Upgrade Required' : 'Connect'}
                    </Button>
                  )}
                </CardFooter>

                {/* Connection Modal Overlay */}
                {selectedProvider === provider.id && (
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center p-4">
                    <div className="w-full space-y-4">
                      <div className="text-center">
                        <h3 className="font-semibold">Connect {provider.name}</h3>
                        <p className="text-sm text-muted-foreground">Enter your API key to connect</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apikey">API Key</Label>
                        <Input
                          id="apikey"
                          type="password"
                          placeholder="sk-..."
                          value={newApiKey}
                          onChange={(e) => setNewApiKey(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedProvider(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConnectProvider(provider.id)}
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,295</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Connected Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{providers.filter(p => p.isConnected).length}</div>
                <p className="text-xs text-muted-foreground">Out of {providers.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24</div>
                <p className="text-xs text-muted-foreground">vs direct usage</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Usage Details</CardTitle>
              <CardDescription>Monitor your AI provider usage and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.filter(p => p.isConnected && p.usage).map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{provider.icon}</span>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {provider.usage!.current.toLocaleString()} / {provider.usage!.limit.toLocaleString()} requests
                          </p>
                        </div>
                      </div>
                      <Badge className={getTierBadgeColor(provider.tier)}>
                        {Math.round((provider.usage!.current / provider.usage!.limit) * 100)}% used
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        style={{ width: `${Math.min((provider.usage!.current / provider.usage!.limit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Global AI Settings</CardTitle>
              <CardDescription>Configure default behavior for all AI providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-fallback</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch to backup provider if primary fails
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Rate limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically manage request rates to prevent quota exceeded
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Usage notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when approaching usage limits
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Privacy</span>
              </CardTitle>
              <CardDescription>Manage how your data is handled by AI providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Encrypt API keys</Label>
                  <p className="text-sm text-muted-foreground">
                    Store API keys with enterprise-grade encryption
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Data retention</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete request logs after 30 days
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
