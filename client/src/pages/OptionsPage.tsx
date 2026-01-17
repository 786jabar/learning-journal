import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, Bell, Eye, Palette, Zap, Shield, 
  Download, Trash2, RefreshCw, Save
} from "lucide-react";

export default function OptionsPage() {
  const { toast } = useToast();
  const [options, setOptions] = useState({
    soundEnabled: true,
    musicVolume: 50,
    notificationsEnabled: true,
    animationsEnabled: true,
    autoSave: true,
    compactMode: false,
    fontSize: "medium",
    language: "english",
  });

  const handleOptionChange = (key: string, value: boolean | number | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`option-${key}`, JSON.stringify(value));
  };

  const saveOptions = () => {
    Object.entries(options).forEach(([key, value]) => {
      localStorage.setItem(`option-${key}`, JSON.stringify(value));
    });
    toast({
      title: "Options Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const resetOptions = () => {
    const defaults = {
      soundEnabled: true,
      musicVolume: 50,
      notificationsEnabled: true,
      animationsEnabled: true,
      autoSave: true,
      compactMode: false,
      fontSize: "medium",
      language: "english",
    };
    setOptions(defaults);
    toast({
      title: "Options Reset",
      description: "All options have been reset to defaults.",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="text-options-title">Options</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <div className="space-y-6">
          <Card data-testid="card-audio-options">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Audio
              </CardTitle>
              <CardDescription>Sound and music preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled" className="flex items-center gap-2">
                  Sound Effects
                </Label>
                <Switch
                  id="sound-enabled"
                  checked={options.soundEnabled}
                  onCheckedChange={(checked) => handleOptionChange("soundEnabled", checked)}
                  data-testid="switch-sound-enabled"
                />
              </div>
              <div className="space-y-2">
                <Label>Music Volume: {options.musicVolume}%</Label>
                <Slider
                  value={[options.musicVolume]}
                  onValueChange={([value]) => handleOptionChange("musicVolume", value)}
                  max={100}
                  step={5}
                  data-testid="slider-music-volume"
                />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-display-options">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Display
              </CardTitle>
              <CardDescription>Visual preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations-enabled">Animations</Label>
                <Switch
                  id="animations-enabled"
                  checked={options.animationsEnabled}
                  onCheckedChange={(checked) => handleOptionChange("animationsEnabled", checked)}
                  data-testid="switch-animations-enabled"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <Switch
                  id="compact-mode"
                  checked={options.compactMode}
                  onCheckedChange={(checked) => handleOptionChange("compactMode", checked)}
                  data-testid="switch-compact-mode"
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={options.fontSize} 
                  onValueChange={(value) => handleOptionChange("fontSize", value)}
                >
                  <SelectTrigger data-testid="select-font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-general-options">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                General
              </CardTitle>
              <CardDescription>General app behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">Notifications</Label>
                <Switch
                  id="notifications-enabled"
                  checked={options.notificationsEnabled}
                  onCheckedChange={(checked) => handleOptionChange("notificationsEnabled", checked)}
                  data-testid="switch-notifications-enabled"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-Save</Label>
                <Switch
                  id="auto-save"
                  checked={options.autoSave}
                  onCheckedChange={(checked) => handleOptionChange("autoSave", checked)}
                  data-testid="switch-auto-save"
                />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={options.language} 
                  onValueChange={(value) => handleOptionChange("language", value)}
                >
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={saveOptions} className="gap-2" data-testid="button-save-options">
              <Save className="h-4 w-4" />
              Save Options
            </Button>
            <Button variant="outline" onClick={resetOptions} className="gap-2" data-testid="button-reset-options">
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
