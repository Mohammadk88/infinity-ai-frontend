'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  SendHorizontal, 
  Sparkles, 
  X, 
  Image, 
  FileText, 
  MessageSquare, 
  Megaphone,
  Copy, 
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type PromptType = 'text' | 'image' | 'ads' | 'social';

type PromptOption = {
  id: PromptType;
  label: string;
  icon: React.ReactNode;
  promptPrefix: string;
  placeholder: string;
};

export default function PromptGenerator() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PromptType>('text');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const promptTypes: PromptOption[] = [
    { 
      id: 'text', 
      label: t('promptGenerator.types.text', 'Text'),
      icon: <FileText className="w-4 h-4" />,
      promptPrefix: "Generate marketing copy about: ",
      placeholder: t('promptGenerator.placeholders.text', 'Type something to generate marketing copy...') 
    },
    { 
      id: 'image', 
      label: t('promptGenerator.types.image', 'Image'), 
      icon: <Image className="w-4 h-4" />,
      promptPrefix: "Generate an image of: ",
      placeholder: t('promptGenerator.placeholders.image', 'Describe the image you want to generate...') 
    },
    { 
      id: 'ads', 
      label: t('promptGenerator.types.ads', 'Ads'),
      icon: <Megaphone className="w-4 h-4" />,
      promptPrefix: "Create ad copy for: ",
      placeholder: t('promptGenerator.placeholders.ads', 'Type a product or service for ad copy...') 
    },
    { 
      id: 'social', 
      label: t('promptGenerator.types.social', 'Social'), 
      icon: <MessageSquare className="w-4 h-4" />,
      promptPrefix: "Generate a social media post about: ",
      placeholder: t('promptGenerator.placeholders.social', 'Describe your social media post topic...') 
    }
  ];

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setTimeout(() => {
        resetWidget();
      }, 300);
    }
  };

  const resetWidget = () => {
    setPromptValue('');
    setGeneratedOutput(null);
    setIsExpanded(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptValue.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      setIsExpanded(true);

      // Mock API call - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      const currentOption = promptTypes.find(p => p.id === selectedType);
      const mockResponse = `Generated ${selectedType} content for: "${promptValue}".\n\n` +
        `This is a sample response from the Infinity AI Marketing Platform, based on ` +
        `the prompt: "${currentOption?.promptPrefix}${promptValue}".`;

      setGeneratedOutput(mockResponse);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedOutput('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTypeChange = (type: PromptType) => {
    setSelectedType(type);
    setGeneratedOutput(null);
  };

  const handleCopyToClipboard = async () => {
    if (!generatedOutput) return;
    
    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopySuccess(true);
      
      // Reset success icon after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const currentOption = promptTypes.find(p => p.id === selectedType) || promptTypes[0];

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={toggleWidget}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600",
          "shadow-lg hover:shadow-xl transition-all duration-300 text-white",
          "flex items-center justify-center",
          isOpen ? "rotate-45" : "animate__animated animate__pulse animate__infinite animate__slower",
        )}
        aria-label={isOpen ? "Close AI prompt generator" : "Open AI prompt generator"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </Button>

      {/* Prompt Generator Widget */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-80 md:w-96 transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          "animate__animated",
          isOpen ? "animate__zoomIn" : "animate__zoomOut",
        )}
      >
        <Card className="overflow-hidden shadow-xl border-indigo-200 dark:border-indigo-900/40">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center text-white">
              <Sparkles className="h-5 w-5 mr-2" />
              <h3 className="font-medium">
                {t('promptGenerator.title', 'AI Prompt Generator')}
              </h3>
            </div>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              Infinity AI
            </span>
          </div>

          <div className="p-4">
            {/* Type Selector */}
            <div className="flex space-x-1 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
              {promptTypes.map((type) => (
                <button
                  key={type.id}
                  className={cn(
                    "flex-1 flex items-center justify-center text-xs py-1.5 px-2 rounded",
                    "transition-all duration-200 relative overflow-hidden",
                    selectedType === type.id
                      ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  )}
                  onClick={() => handleTypeChange(type.id)}
                >
                  {type.icon}
                  <span className="ml-1.5">{type.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="sr-only">Prompt</Label>
                <div className="relative">
                  <Input
                    id="prompt"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={currentOption.placeholder}
                    className={cn(
                      "pr-10 focus:ring-2 focus:ring-indigo-500/30 transition-all",
                      "border-slate-300 dark:border-slate-700",
                      "placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    )}
                    disabled={isGenerating}
                    required
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-0 top-0 h-full px-3 text-slate-400",
                      "hover:text-indigo-600 dark:hover:text-indigo-400",
                      "transition-all duration-200",
                      isGenerating && "animate-pulse text-indigo-600 dark:text-indigo-400"
                    )}
                    disabled={isGenerating || !promptValue.trim()}
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>

              {(isGenerating || generatedOutput) && (
                <div className={cn(
                  "bg-slate-50 dark:bg-slate-800/50 rounded-md p-3 transition-all duration-300",
                  "border border-slate-200 dark:border-slate-700/70",
                  isExpanded ? "max-h-60 overflow-y-auto" : "max-h-0 overflow-hidden p-0 border-0"
                )}>
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping"></div>
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping delay-75"></div>
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping delay-150"></div>
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{t('promptGenerator.generating', 'Generating...')}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {t('promptGenerator.result', 'Generated Result:')}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          onClick={handleCopyToClipboard}
                          title={t('promptGenerator.copy', 'Copy to clipboard')}
                        >
                          {copySuccess ? (
                            <Check className="h-3.5 w-3.5 text-green-500 animate__animated animate__fadeIn" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span className="sr-only">{t('promptGenerator.copy', 'Copy to clipboard')}</span>
                        </Button>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{generatedOutput}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
                {t('promptGenerator.hint', 'Powered by advanced AI to enhance your marketing content')}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}