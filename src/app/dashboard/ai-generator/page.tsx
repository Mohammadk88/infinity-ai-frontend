'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  FileText, 
  Image, 
  Video, 
  Copy,
  Download,
  RefreshCw,
  Wand2
} from 'lucide-react';

export default function AIGeneratorPage() {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const contentTypes = [
    {
      id: 'social',
      title: 'Social Media Posts',
      description: 'Create engaging posts for social platforms',
      icon: <FileText className="h-5 w-5" />,
      badge: 'Popular'
    },
    {
      id: 'blog',
      title: 'Blog Articles',
      description: 'Generate SEO-optimized blog content',
      icon: <FileText className="h-5 w-5" />,
      badge: 'New'
    },
    {
      id: 'image',
      title: 'AI Images',
      description: 'Create stunning visuals with AI',
      icon: <Image className="h-5 w-5" />,
      badge: 'Premium'
    },
    {
      id: 'video',
      title: 'Video Scripts',
      description: 'Write compelling video scripts',
      icon: <Video className="h-5 w-5" />
    }
  ];

  const templates = [
    'Product announcement',
    'Behind the scenes',
    'Customer testimonial',
    'Educational content',
    'Promotional campaign',
    'Industry insights'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`Generated content based on: "${prompt}"\n\nThis is a mock response. In a real implementation, this would connect to your AI provider API to generate actual content based on the user's prompt and selected content type.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            {t('aiGenerator.title', 'AI Content Generator')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('aiGenerator.description', 'Create amazing content with the power of AI')}
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          ✨ {t('aiGenerator.credits', '50 Credits')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Types</CardTitle>
              <CardDescription>Choose what you want to create</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contentTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {type.icon}
                    <div>
                      <p className="font-medium text-sm">{type.title}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  {type.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {type.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template) => (
                  <Button
                    key={template}
                    variant="ghost"
                    size="sm"
                    className="justify-start h-auto p-2 text-left"
                    onClick={() => setPrompt(template)}
                  >
                    <Wand2 className="h-3 w-3 mr-2" />
                    {template}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Generation Area */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>
                Describe what you want to create and let AI do the magic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="text" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="text">Text Content</TabsTrigger>
                  <TabsTrigger value="image">Image Generation</TabsTrigger>
                  <TabsTrigger value="video">Video Scripts</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      placeholder="Describe what you want to create... (e.g., 'Write a social media post about our new product launch')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tone</label>
                      <Input placeholder="Professional, Casual, Funny..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Length</label>
                      <Input placeholder="Short, Medium, Long..." />
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>

                  {generatedContent && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Generated Content</label>
                      <div className="relative">
                        <Textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          className="min-h-[200px] pr-20"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Image generation coming soon!</p>
                    <p className="text-sm">Connect your AI providers to enable this feature.</p>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Video script generation coming soon!</p>
                    <p className="text-sm">This feature will be available in the next update.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Generations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>Your latest AI-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent generations yet</p>
            <p className="text-sm">Start creating content to see your history here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
