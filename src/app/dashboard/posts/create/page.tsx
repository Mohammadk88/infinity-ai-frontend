'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ImageIcon,
  Sparkles,
  Zap,
  Plus,
  X,
  Upload,
  Eye,
  CheckCircle2,
  Loader2,
  Hash,
  MessageSquare,
  Heart,
  Repeat,
  Send,
  Save,
  Settings,
  Wand2,
  TrendingUp,
  AtSign,
  MapPin,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Form schema for post creation
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(2200, 'Content must be less than 2200 characters'),
  platforms: z.array(z.string()).min(1, 'At least one platform must be selected'),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  isScheduled: z.boolean(),
  tags: z.array(z.string()),
  location: z.string().optional(),
  mentionUsers: z.array(z.string()),
  enableComments: z.boolean(),
  enableSharing: z.boolean(),
  postType: z.enum(['text', 'image', 'video', 'carousel']),
  aiOptimized: z.boolean(),
  targetAudience: z.string().optional(),
  campaignId: z.string().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  isConnected: boolean;
  characterLimit: number;
  supportedFormats: string[];
  features: string[];
}

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
}

interface AIOptimization {
  suggestedHashtags: string[];
  engagementPrediction: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  bestPostingTime: string;
  audienceInsights: string;
  contentSuggestions: string[];
}

export default function CreatePostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [aiOptimization, setAIOptimization] = useState<AIOptimization | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [aiPrompt, setAIPrompt] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // Available social platforms (mock data - would come from API)
  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      isConnected: true,
      characterLimit: 63206,
      supportedFormats: ['image', 'video', 'carousel'],
      features: ['hashtags', 'mentions', 'location', 'scheduling']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
      isConnected: true,
      characterLimit: 2200,
      supportedFormats: ['image', 'video', 'carousel'],
      features: ['hashtags', 'mentions', 'location', 'scheduling']
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
      isConnected: true,
      characterLimit: 280,
      supportedFormats: ['image', 'video'],
      features: ['hashtags', 'mentions', 'scheduling']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      isConnected: true,
      characterLimit: 3000,
      supportedFormats: ['image', 'video'],
      features: ['hashtags', 'mentions', 'scheduling']
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
      isConnected: false,
      characterLimit: 5000,
      supportedFormats: ['video'],
      features: ['hashtags', 'scheduling']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Play className="h-5 w-5" />,
      color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950/50 dark:text-neutral-400',
      isConnected: false,
      characterLimit: 2200,
      supportedFormats: ['video'],
      features: ['hashtags', 'mentions', 'scheduling']
    }
  ];

  // Form setup with React Hook Form
  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      platforms: [],
      isScheduled: false,
      tags: [],
      mentionUsers: [],
      enableComments: true,
      enableSharing: true,
      postType: 'text',
      aiOptimized: false,
    },
  });

  // Watch form values for real-time updates
  const watchedContent = form.watch('content');
  const watchedPlatforms = form.watch('platforms');

  // Update character count when content changes
  useEffect(() => {
    setCharacterCount(watchedContent?.length || 0);
  }, [watchedContent]);

  // Update selected platforms when form changes
  useEffect(() => {
    setSelectedPlatforms(watchedPlatforms || []);
  }, [watchedPlatforms]);

  // Get minimum character limit from selected platforms
  const getMinCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 2200;
    const limits = selectedPlatforms.map(platformId => {
      const platform = socialPlatforms.find(p => p.id === platformId);
      return platform?.characterLimit || 2200;
    });
    return Math.min(...limits);
  };

  // Platform selection handler
  const handlePlatformToggle = (platformId: string) => {
    const currentPlatforms = form.getValues('platforms') || [];
    const platform = socialPlatforms.find(p => p.id === platformId);
    
    if (!platform?.isConnected) return;

    if (currentPlatforms.includes(platformId)) {
      const newPlatforms = currentPlatforms.filter(id => id !== platformId);
      form.setValue('platforms', newPlatforms);
    } else {
      form.setValue('platforms', [...currentPlatforms, platformId]);
    }
  };

  // Media file upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const mediaType: 'image' | 'video' = file.type.startsWith('image/') ? 'image' : 'video';
      const url = URL.createObjectURL(file);
      
      const newMedia: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        type: mediaType,
        url,
        alt: '',
        caption: ''
      };
      
      setMediaFiles(prev => [...prev, newMedia]);
    });

    // Update post type based on media
    if (files.length > 1) {
      form.setValue('postType', 'carousel');
    } else if (files[0]?.type.startsWith('video/')) {
      form.setValue('postType', 'video');
    } else if (files[0]?.type.startsWith('image/')) {
      form.setValue('postType', 'image');
    }
  };

  // Remove media file
  const handleRemoveMedia = (mediaId: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(media => media.id !== mediaId);
      
      // Update post type based on remaining media
      if (updated.length === 0) {
        form.setValue('postType', 'text');
      } else if (updated.length > 1) {
        form.setValue('postType', 'carousel');
      } else {
        const mediaType = updated[0].type;
        form.setValue('postType', mediaType === 'video' ? 'video' : 'image');
      }
      
      return updated;
    });
  };

  // AI content generation
  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAI(true);
    
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `🌟 Exciting news! ${aiPrompt} 

Join us on this incredible journey as we continue to innovate and deliver amazing experiences. 

#Innovation #Technology #Growth #Community`;
      
      form.setValue('content', mockContent);
      
      // Mock AI optimization data
      setAIOptimization({
        suggestedHashtags: ['#innovation', '#technology', '#growth', '#community', '#success'],
        engagementPrediction: {
          likes: Math.floor(Math.random() * 500) + 100,
          comments: Math.floor(Math.random() * 50) + 10,
          shares: Math.floor(Math.random() * 30) + 5,
          reach: Math.floor(Math.random() * 2000) + 500
        },
        bestPostingTime: '6:00 PM today',
        audienceInsights: 'Your audience is most active during evening hours (5-8 PM)',
        contentSuggestions: [
          'Consider adding a call-to-action',
          'Include relevant hashtags for better reach',
          'Add location if event-related'
        ]
      });
      
      form.setValue('aiOptimized', true);
      setAIPrompt('');
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle hashtag input
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !form.getValues('tags').includes(tag.trim())) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, tag.trim()]);
    }
    setTagInput('');
  };

  // Handle mention input
  const handleAddMention = (mention: string) => {
    if (mention.trim() && !form.getValues('mentionUsers').includes(mention.trim())) {
      const currentMentions = form.getValues('mentionUsers') || [];
      form.setValue('mentionUsers', [...currentMentions, mention.trim()]);
    }
    setMentionInput('');
  };

  // Remove tag
  const handleRemoveTag = (tagIndex: number) => {
    const currentTags = form.getValues('tags') || [];
    const updatedTags = currentTags.filter((_, index) => index !== tagIndex);
    form.setValue('tags', updatedTags);
  };

  // Remove mention
  const handleRemoveMention = (mentionIndex: number) => {
    const currentMentions = form.getValues('mentionUsers') || [];
    const updatedMentions = currentMentions.filter((_, index) => index !== mentionIndex);
    form.setValue('mentionUsers', updatedMentions);
  };

  // Form submission handler
  const onSubmit = async (data: CreatePostForm) => {
    await handlePostAction('publish', data);
  };

  // Handle different post actions (publish, schedule, draft)
  const handlePostAction = async (action: 'publish' | 'schedule' | 'draft', data?: CreatePostForm) => {
    setIsLoading(true);
    
    try {
      const formData = data || form.getValues();
      
      // Validate required fields based on action
      if (action !== 'draft') {
        if (!formData.content.trim()) {
          toast({
            title: t('common.error', 'Error'),
            description: t('posts.create.contentRequired', 'Content is required to publish or schedule a post.'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        if (selectedPlatforms.length === 0) {
          toast({
            title: t('common.error', 'Error'),
            description: t('posts.create.platformRequired', 'Please select at least one platform.'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }

      // Prepare post data with media files
      const postData = {
        ...formData,
        platforms: selectedPlatforms,
        mediaFiles: mediaFiles,
        status: action === 'draft' ? 'draft' : (formData.isScheduled ? 'scheduled' : 'published'),
        scheduledAt: formData.isScheduled && formData.scheduledDate && formData.scheduledTime 
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : null,
      };

      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} post data:`, postData);
      
      // TODO: Replace with actual API call
      const response = await mockApiCall(postData);
      
      if (response.success) {
        let title = '';
        let description = '';
        
        switch (action) {
          case 'publish':
            title = t('posts.create.publishSuccess', 'Post published successfully!');
            description = t('posts.create.publishedSuccess', 'Your post has been published across selected platforms.');
            break;
          case 'schedule':
            title = t('posts.create.scheduleSuccess', 'Post scheduled successfully!');
            description = t('posts.create.scheduledSuccess', 'Your post has been scheduled for {{date}}', {
              date: new Date(postData.scheduledAt!).toLocaleString()
            });
            break;
          case 'draft':
            title = t('posts.create.draftSuccess', 'Draft saved successfully!');
            description = t('posts.create.draftSavedSuccess', 'Your post has been saved as a draft.');
            break;
        }
        
        toast({ title, description });
        
        // Redirect based on action
        if (action === 'draft') {
          router.push('/dashboard/posts?tab=drafts');
        } else {
          router.push('/dashboard/posts');
        }
      } else {
        throw new Error(response.error || 'Failed to process post');
      }
      
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      toast({
        title: t('common.error', 'Error'),
        description: t('posts.create.error', 'Failed to {{action}} post. Please try again.', { action }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API call - replace with actual implementation
  const mockApiCall = async (postData: Record<string, unknown>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      return { success: false, error: 'Network error occurred' };
    }
    
    return { 
      success: true, 
      data: { 
        id: Date.now(), 
        ...postData,
        createdAt: new Date().toISOString()
      } 
    };
  };

  // Handle preview post
  const handlePreviewPost = () => {
    const formData = form.getValues();
    
    if (!formData.content.trim()) {
      toast({
        title: t('common.error', 'Error'),
        description: t('posts.create.contentRequired', 'Content is required to preview the post.'),
        variant: 'destructive',
      });
      return;
    }
    
    setShowPreviewDialog(true);
  };

  // Get character limit color based on usage
  const getCharacterLimitColor = () => {
    const limit = getMinCharacterLimit();
    const percentage = (characterCount / limit) * 100;
    
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('posts.create.title', 'Create Social Post')}
          </h1>
          <p className="text-muted-foreground">
            {t('posts.create.subtitle', 'Create and schedule content across your social media platforms')}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    {t('posts.create.selectPlatforms', 'Select Platforms')}
                  </CardTitle>
                  <CardDescription>
                    {t('posts.create.selectPlatformsDesc', 'Choose which social media platforms to post to')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {socialPlatforms.map((platform) => (
                            <div
                              key={platform.id}
                              className={cn(
                                "border rounded-lg p-3 cursor-pointer transition-all",
                                "hover:border-primary/50",
                                selectedPlatforms.includes(platform.id) 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border",
                                !platform.isConnected && "opacity-50 cursor-not-allowed"
                              )}
                              onClick={() => handlePlatformToggle(platform.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", platform.color)}>
                                  {platform.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{platform.name}</span>
                                    {selectedPlatforms.includes(platform.id) && (
                                      <CheckCircle2 className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {platform.isConnected ? (
                                      `${platform.characterLimit.toLocaleString()} chars`
                                    ) : (
                                      t('posts.create.notConnected', 'Not connected')
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content Creation */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {t('posts.create.content', 'Post Content')}
                      </CardTitle>
                      <CardDescription>
                        {t('posts.create.contentDesc', 'Write your post content or generate it with AI')}
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAIPanel(!showAIPanel)}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t('posts.create.aiAssist', 'AI Assist')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Generation Panel */}
                  <AnimatePresence>
                    {showAIPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            {t('posts.create.aiGenerator', 'AI Content Generator')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={t('posts.create.aiPrompt', 'Describe what you want to post about...')}
                            value={aiPrompt}
                            onChange={(e) => setAIPrompt(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAIGeneration()}
                          />
                          <Button
                            type="button"
                            onClick={handleAIGeneration}
                            disabled={isGeneratingAI || !aiPrompt.trim()}
                            size="sm"
                          >
                            {isGeneratingAI ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('posts.create.titleLabel', 'Post Title')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('posts.create.titlePlaceholder', 'Enter a title for your post...')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>{t('posts.create.contentLabel', 'Content')}</span>
                          <span className={cn("text-sm", getCharacterLimitColor())}>
                            {characterCount.toLocaleString()}/{getMinCharacterLimit().toLocaleString()}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('posts.create.contentPlaceholder', 'What\'s on your mind?')}
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {selectedPlatforms.length > 0 && (
                            t('posts.create.characterLimit', 'Character limit based on selected platforms')
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags and Mentions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hashtags */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {t('posts.create.hashtags', 'Hashtags')}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('posts.create.addHashtag', 'Add hashtag...')}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(tagInput);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(tagInput)}
                          disabled={!tagInput.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues('tags')?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            #{tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent"
                              onClick={() => handleRemoveTag(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mentions */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <AtSign className="h-4 w-4" />
                        {t('posts.create.mentions', 'Mentions')}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('posts.create.addMention', 'Add mention...')}
                          value={mentionInput}
                          onChange={(e) => setMentionInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMention(mentionInput);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddMention(mentionInput)}
                          disabled={!mentionInput.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues('mentionUsers')?.map((mention, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            @{mention}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent"
                              onClick={() => handleRemoveMention(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    {t('posts.create.media', 'Media')}
                  </CardTitle>
                  <CardDescription>
                    {t('posts.create.mediaDesc', 'Add images or videos to your post')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {t('posts.create.uploadMedia', 'Click to upload or drag and drop')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('posts.create.supportedFormats', 'PNG, JPG, GIF, MP4 up to 10MB')}
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mediaFiles.map((media) => (
                          <div key={media.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={media.alt || 'Uploaded media'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  muted
                                />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveMedia(media.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {media.type === 'video' && (
                              <Play className="absolute inset-0 m-auto h-8 w-8 text-white bg-black/50 rounded-full p-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scheduling */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {t('posts.create.scheduling', 'Scheduling')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isScheduled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('posts.create.schedulePost', 'Schedule Post')}
                          </FormLabel>
                          <FormDescription>
                            {t('posts.create.scheduleDesc', 'Schedule this post for later')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('isScheduled') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('posts.create.date', 'Date')}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('posts.create.time', 'Time')}</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* AI Optimization Results */}
              {aiOptimization && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {t('posts.create.aiOptimization', 'AI Optimization')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {t('posts.create.predictions', 'Engagement Predictions')}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{aiOptimization.engagementPrediction.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-blue-500" />
                          <span>{aiOptimization.engagementPrediction.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat className="h-3 w-3 text-green-500" />
                          <span>{aiOptimization.engagementPrediction.shares}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-purple-500" />
                          <span>{aiOptimization.engagementPrediction.reach}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/40 my-4" />

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('posts.create.bestTime', 'Best Posting Time')}
                      </h4>
                      <p className="text-sm text-muted-foreground">{aiOptimization.bestPostingTime}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {t('posts.create.suggestedHashtags', 'Suggested Hashtags')}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {aiOptimization.suggestedHashtags.slice(0, 3).map((tag, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleAddTag(tag.replace('#', ''))}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Post Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {t('posts.create.settings', 'Post Settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableComments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('posts.create.enableComments', 'Enable Comments')}
                          </FormLabel>
                          <FormDescription>
                            {t('posts.create.enableCommentsDesc', 'Allow users to comment')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableSharing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('posts.create.enableSharing', 'Enable Sharing')}
                          </FormLabel>
                          <FormDescription>
                            {t('posts.create.enableSharingDesc', 'Allow users to share')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t('posts.create.location', 'Location')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('posts.create.locationPlaceholder', 'Add location...')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handlePreviewPost}
                  disabled={!form.watch('content')?.trim()}
                >
                  <Eye className="h-4 w-4" />
                  {t('posts.create.preview', 'Preview Post')}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handlePostAction('draft')}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {t('posts.create.saveDraft', 'Save as Draft')}
                </Button>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading || selectedPlatforms.length === 0}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : form.watch('isScheduled') ? (
                    <>
                      <Calendar className="h-4 w-4" />
                      {t('posts.create.schedulePost', 'Schedule Post')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('posts.create.publishNow', 'Publish Now')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('posts.create.previewTitle', 'Post Preview')}
            </DialogTitle>
            <DialogDescription>
              {t('posts.create.previewDesc', 'See how your post will appear on different platforms')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedPlatforms.map((platformId) => {
              const platform = socialPlatforms.find(p => p.id === platformId);
              if (!platform) return null;
              
              return (
                <div key={platformId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", platform.color)}>
                      {platform.icon}
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    {form.watch('title') && (
                      <h3 className="font-semibold text-lg">{form.watch('title')}</h3>
                    )}
                    
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {form.watch('content')}
                    </p>
                    
                    {form.watch('tags')?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {form.watch('tags').map((tag, index) => (
                          <span key={index} className="text-primary text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {form.watch('mentionUsers')?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {form.watch('mentionUsers').map((mention, index) => (
                          <span key={index} className="text-blue-600 text-sm">
                            @{mention}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {mediaFiles.slice(0, 4).map((media) => (
                          <div key={media.id} className="aspect-square rounded overflow-hidden bg-muted">
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={media.alt || 'Preview'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-black/10">
                                <Play className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                        {mediaFiles.length > 4 && (
                          <div className="aspect-square rounded overflow-hidden bg-muted flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{mediaFiles.length - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {form.watch('location') && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {form.watch('location')}
                      </div>
                    )}
                    
                    {form.watch('isScheduled') && form.watch('scheduledDate') && form.watch('scheduledTime') && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Scheduled for {form.watch('scheduledDate')} at {form.watch('scheduledTime')}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Character count: {form.watch('content')?.length || 0} / {platform.characterLimit}
                  </div>
                </div>
              );
            })}
            
            {selectedPlatforms.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('posts.create.selectPlatformsToPreview', 'Select platforms to see preview')}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
