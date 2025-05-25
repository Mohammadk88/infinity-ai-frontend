'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Palette,
  Brush,
  Eye,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Monitor,
  Settings,
  X,
  Download,
  Upload,
  Sparkles,
  Zap,
  Waves,
  Droplets
} from 'lucide-react';

interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  glassIntensity: number;
  animationSpeed: number;
  colorMode: 'light' | 'dark' | 'system';
  preset: string;
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#8b5cf6',
  accentColor: '#06b6d4',
  borderRadius: 8,
  glassIntensity: 20,
  animationSpeed: 300,
  colorMode: 'system',
  preset: 'default'
};

const colorPresets = [
  { name: 'Violet Dream', primary: '#8b5cf6', accent: '#06b6d4', icon: <Sparkles className="h-4 w-4" /> },
  { name: 'Ocean Breeze', primary: '#0ea5e9', accent: '#10b981', icon: <Waves className="h-4 w-4" /> },
  { name: 'Sunset Glow', primary: '#f97316', accent: '#eab308', icon: <Zap className="h-4 w-4" /> },
  { name: 'Forest Fresh', primary: '#10b981', accent: '#06b6d4', icon: <Droplets className="h-4 w-4" /> },
  { name: 'Royal Purple', primary: '#7c3aed', accent: '#ec4899', icon: <Palette className="h-4 w-4" /> },
  { name: 'Electric Blue', primary: '#2563eb', accent: '#06b6d4', icon: <Sparkles className="h-4 w-4" /> }
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [hasChanges, setHasChanges] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('infinity-theme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          setTheme({ ...defaultTheme, ...parsedTheme });
        } catch (error) {
          console.error('Failed to load theme:', error);
        }
      }
    }
  }, []);

  // Apply theme changes to CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Convert hex to HSL for CSS custom properties
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      root.style.setProperty('--primary', hexToHsl(theme.primaryColor));
      root.style.setProperty('--accent', hexToHsl(theme.accentColor));
      root.style.setProperty('--radius', `${theme.borderRadius}px`);
      root.style.setProperty('--glass-intensity', `${theme.glassIntensity}%`);
      root.style.setProperty('--animation-speed', `${theme.animationSpeed}ms`);

      // Handle color mode
      if (theme.colorMode === 'system') {
        root.classList.remove('light', 'dark');
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme.colorMode);
      }
    }
  }, [theme]);

  const handleThemeChange = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    handleThemeChange({
      primaryColor: preset.primary,
      accentColor: preset.accent,
      preset: preset.name
    });
  };

  const saveTheme = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('infinity-theme', JSON.stringify(theme));
      setHasChanges(false);
    }
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setHasChanges(true);
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'infinity-theme.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setTheme({ ...defaultTheme, ...importedTheme });
          setHasChanges(true);
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-96 glass-card border-l border-border/50",
              "shadow-premium backdrop-blur-xl overflow-y-auto",
              className
            )}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Theme Customizer</h2>
                    <p className="text-sm text-muted-foreground">Personalize your experience</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-lg hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Color Mode */}
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: 'light' as const, icon: Sun, label: 'Light' },
                      { mode: 'dark' as const, icon: Moon, label: 'Dark' },
                      { mode: 'system' as const, icon: Monitor, label: 'System' }
                    ].map(({ mode, icon: Icon, label }) => (
                      <Button
                        key={mode}
                        variant={theme.colorMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleThemeChange({ colorMode: mode })}
                        className="flex flex-col h-auto py-3 space-y-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Color Presets */}
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Color Presets</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "h-auto p-3 flex flex-col space-y-2 transition-premium",
                          "hover:bg-background/50 hover:scale-105",
                          theme.preset === preset.name && "ring-2 ring-primary bg-primary/5"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          {preset.icon}
                        </div>
                        <span className="text-xs font-medium">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Colors */}
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Custom Colors</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Primary Color</Label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => handleThemeChange({ primaryColor: e.target.value })}
                        className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer"
                      />
                      <div className="flex-1 text-xs font-mono text-muted-foreground">
                        {theme.primaryColor}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Accent Color</Label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => handleThemeChange({ accentColor: e.target.value })}
                        className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer"
                      />
                      <div className="flex-1 text-xs font-mono text-muted-foreground">
                        {theme.accentColor}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Style Settings */}
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Style Settings</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Border Radius: {theme.borderRadius}px</Label>
                    <Slider
                      value={[theme.borderRadius]}
                      onValueChange={([value]) => handleThemeChange({ borderRadius: value })}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Glass Effect: {theme.glassIntensity}%</Label>
                    <Slider
                      value={[theme.glassIntensity]}
                      onValueChange={([value]) => handleThemeChange({ glassIntensity: value })}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Animation Speed: {theme.animationSpeed}ms</Label>
                    <Slider
                      value={[theme.animationSpeed]}
                      onValueChange={([value]) => handleThemeChange({ animationSpeed: value })}
                      min={100}
                      max={1000}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Button
                      onClick={saveTheme}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetTheme}
                      className="px-3"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={exportTheme}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importTheme}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <Card className="glass-card border-border/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-primary">Primary Color</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This shows how your primary color looks in action.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-accent">Accent Color</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Accent colors provide visual hierarchy and emphasis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
