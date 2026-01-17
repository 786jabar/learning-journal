import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/lib/theme-provider";
import { 
  Moon, Sun, User, Shield, Database, Download, 
  Trash2, HardDrive, CloudOff, RefreshCw, Key,
  Smartphone, Monitor
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [storageUsed, setStorageUsed] = useState("Calculating...");
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("device-id") || "Not set";
    setDeviceId(id);
    
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        const usedMB = ((usage || 0) / (1024 * 1024)).toFixed(2);
        const quotaMB = ((quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageUsed(`${usedMB} MB / ${quotaMB} MB`);
      });
    } else {
      setStorageUsed("Not available");
    }
  }, []);

  const clearLocalStorage = () => {
    const deviceId = localStorage.getItem("device-id");
    localStorage.clear();
    if (deviceId) localStorage.setItem("device-id", deviceId);
    toast({
      title: "Local Storage Cleared",
      description: "All local data has been cleared (device ID preserved).",
    });
  };

  const clearIndexedDB = async () => {
    try {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
      toast({
        title: "IndexedDB Cleared",
        description: "All IndexedDB databases have been deleted.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not clear IndexedDB.",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const data = {
      localStorage: { ...localStorage },
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as a JSON file.",
    });
  };

  const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      toast({
        title: "Service Worker Unregistered",
        description: "All service workers have been unregistered. Reload to re-register.",
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="text-settings-title">Settings</h1>
          <p className="text-muted-foreground">Manage your app configuration</p>
        </div>

        <div className="space-y-6">
          <Card data-testid="card-appearance-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  data-testid="switch-dark-mode"
                />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-device-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Device
              </CardTitle>
              <CardDescription>Device identification and info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Device ID</Label>
                  <p className="text-sm text-muted-foreground">Unique identifier for this device</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs" data-testid="badge-device-id">
                  {deviceId.substring(0, 16)}...
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-storage-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Storage
              </CardTitle>
              <CardDescription>Manage local data storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Storage Used</Label>
                  <p className="text-sm text-muted-foreground">Current storage consumption</p>
                </div>
                <Badge variant="secondary" data-testid="badge-storage-used">{storageUsed}</Badge>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={exportData} className="gap-2" data-testid="button-export-data">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" onClick={clearLocalStorage} className="gap-2" data-testid="button-clear-localstorage">
                  <Trash2 className="h-4 w-4" />
                  Clear LocalStorage
                </Button>
                <Button variant="outline" onClick={clearIndexedDB} className="gap-2" data-testid="button-clear-indexeddb">
                  <Database className="h-4 w-4" />
                  Clear IndexedDB
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-pwa-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudOff className="h-5 w-5 text-primary" />
                PWA Settings
              </CardTitle>
              <CardDescription>Progressive Web App configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Service Worker</Label>
                  <p className="text-sm text-muted-foreground">Manages offline functionality</p>
                </div>
                <Button variant="outline" size="sm" onClick={unregisterServiceWorker} className="gap-2" data-testid="button-unregister-sw">
                  <RefreshCw className="h-4 w-4" />
                  Unregister
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50" data-testid="card-danger-zone">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => {
                  localStorage.clear();
                  indexedDB.databases().then(dbs => {
                    dbs.forEach(db => { if (db.name) indexedDB.deleteDatabase(db.name); });
                  });
                  window.location.reload();
                }}
                className="gap-2"
                data-testid="button-reset-all"
              >
                <Trash2 className="h-4 w-4" />
                Reset Everything
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will delete all local data and reload the app.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
