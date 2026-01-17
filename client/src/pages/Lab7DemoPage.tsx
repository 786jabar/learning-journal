import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  HardDrive,
  Globe,
  Bell,
  Loader2
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Lab7DemoPage() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swStatus, setSwStatus] = useState<'checking' | 'registered' | 'not-registered'>('checking');
  const [cacheStatus, setCacheStatus] = useState<string[]>([]);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [notificationSupported] = useState(() => typeof window !== 'undefined' && 'Notification' in window);
  const [notificationPermission, setNotificationPermission] = useState<string>(() => 
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "Back Online", description: "Internet connection restored" });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: "Offline", description: "No internet connection", variant: "destructive" });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setSwStatus(reg ? 'registered' : 'not-registered');
      });
    } else {
      setSwStatus('not-registered');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const checkCacheStatus = async () => {
    setLoading(prev => ({ ...prev, cache: true }));
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        setCacheStatus(cacheNames);
        toast({ title: "Cache Status", description: `Found ${cacheNames.length} cache(s)` });
      } else {
        setCacheStatus(['Cache API not supported']);
      }
    } catch (error) {
      setCacheStatus(['Error checking cache']);
    } finally {
      setLoading(prev => ({ ...prev, cache: false }));
    }
  };

  const handleInstall = async () => {
    if (!installPrompt) {
      toast({ 
        title: "Install Info", 
        description: "App may already be installed or use browser menu to install" 
      });
      return;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        toast({ title: "Installed!", description: "App added to home screen" });
      }
      setInstallPrompt(null);
    } catch (error) {
      toast({ title: "Error", description: "Installation failed", variant: "destructive" });
    }
  };

  const updateServiceWorker = async () => {
    setLoading(prev => ({ ...prev, sw: true }));
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          toast({ title: "Success", description: "Service worker updated" });
        } else {
          toast({ title: "Info", description: "No service worker to update" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, sw: false }));
    }
  };

  const requestNotificationPermission = async () => {
    if (!notificationSupported) {
      toast({ title: "Not Supported", description: "Notifications are not supported in this browser", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, notification: true }));
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('PWA Notifications Enabled!', {
          body: 'You will now receive push notifications',
          icon: '/icons/icon-192x192.png'
        });
        toast({ title: "Enabled", description: "Notifications are now enabled" });
      } else {
        toast({ title: "Denied", description: "Notification permission denied", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to request permission", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, notification: false }));
    }
  };

  const clearAllCaches = async () => {
    setLoading(prev => ({ ...prev, clearCache: true }));
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        setCacheStatus([]);
        toast({ title: "Cleared", description: "All caches have been cleared" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear caches", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, clearCache: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Lab 7: PWA Features</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Progressive Web App capabilities: offline support, installability, caching, and push notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card data-testid="card-online-status">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
                Network Status
              </CardTitle>
              <CardDescription>Real-time online/offline detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                {isOnline ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400" data-testid="text-online-status">Online</p>
                      <p className="text-sm text-muted-foreground">Connected to internet</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400" data-testid="text-offline-status">Offline</p>
                      <p className="text-sm text-muted-foreground">No internet connection</p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Uses navigator.onLine and online/offline events
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-service-worker">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Service Worker
              </CardTitle>
              <CardDescription>Background script for offline caching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                {swStatus === 'checking' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : swStatus === 'registered' ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400" data-testid="text-sw-registered">Registered</p>
                      <p className="text-sm text-muted-foreground">SW is active</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-semibold" data-testid="text-sw-not-registered">Not Registered</p>
                      <p className="text-sm text-muted-foreground">SW not available</p>
                    </div>
                  </>
                )}
              </div>
              <Button 
                onClick={updateServiceWorker} 
                disabled={loading.sw}
                className="w-full"
                data-testid="button-update-sw"
              >
                {loading.sw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Update Service Worker
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-install">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Install App
              </CardTitle>
              <CardDescription>Add to home screen for native experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                {isInstalled ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400" data-testid="text-pwa-installed">Installed</p>
                      <p className="text-sm text-muted-foreground">Running as PWA</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold" data-testid="text-pwa-not-installed">Not Installed</p>
                      <p className="text-sm text-muted-foreground">Install for best experience</p>
                    </div>
                  </>
                )}
              </div>
              <Button 
                onClick={handleInstall}
                disabled={isInstalled}
                className="w-full"
                data-testid="button-install-pwa"
              >
                <Download className="h-4 w-4 mr-2" />
                {isInstalled ? 'Already Installed' : 'Install PWA'}
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-cache">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Cache Storage
              </CardTitle>
              <CardDescription>View and manage cached resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={checkCacheStatus} 
                  disabled={loading.cache}
                  className="w-full"
                  data-testid="button-check-cache"
                >
                  {loading.cache ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <HardDrive className="h-4 w-4 mr-2" />}
                  Check Cache
                </Button>
                <Button 
                  onClick={clearAllCaches}
                  disabled={loading.clearCache}
                  variant="outline"
                  className="w-full"
                  data-testid="button-clear-cache"
                >
                  {loading.clearCache ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Clear All Caches
                </Button>
              </div>
              {cacheStatus.length > 0 && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium mb-2">Active Caches:</p>
                  <div className="flex flex-wrap gap-1">
                    {cacheStatus.map((cache, i) => (
                      <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-cache-${i}`}>
                        {cache}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-notifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>Enable browser notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm">
                  <span className="font-medium">Permission: </span>
                  <Badge 
                    variant={
                      notificationPermission === 'granted' ? 'default' :
                      notificationPermission === 'denied' ? 'destructive' : 'secondary'
                    }
                    data-testid="badge-notification-permission"
                  >
                    {notificationPermission}
                  </Badge>
                </p>
              </div>
              <Button 
                onClick={requestNotificationPermission}
                disabled={loading.notification || notificationPermission === 'granted' || !notificationSupported}
                className="w-full"
                data-testid="button-enable-notifications"
              >
                {loading.notification ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                {!notificationSupported ? 'Not Supported' : notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-manifest">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Web App Manifest
              </CardTitle>
              <CardDescription>App metadata and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 p-2 rounded bg-muted" data-testid="manifest-name">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium" data-testid="text-manifest-name">Learning Journal</span>
                </div>
                <div className="flex justify-between gap-4 p-2 rounded bg-muted" data-testid="manifest-display">
                  <span className="text-muted-foreground">Display:</span>
                  <span className="font-medium" data-testid="text-manifest-display">Standalone</span>
                </div>
                <div className="flex justify-between gap-4 p-2 rounded bg-muted" data-testid="manifest-theme">
                  <span className="text-muted-foreground">Theme Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span className="font-medium" data-testid="text-manifest-color">#7c3aed</span>
                  </div>
                </div>
                <div className="flex justify-between gap-4 p-2 rounded bg-muted" data-testid="manifest-url">
                  <span className="text-muted-foreground">Start URL:</span>
                  <span className="font-medium" data-testid="text-manifest-url">/</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8" data-testid="card-pwa-checklist">
          <CardHeader>
            <CardTitle>PWA Checklist</CardTitle>
            <CardDescription>Requirements for a Progressive Web App</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>HTTPS (secure context)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Web App Manifest</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                {swStatus === 'registered' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-500" />
                )}
                <span>Service Worker</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Responsive Design</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Offline Support (IndexedDB)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>App Icons (192x192, 512x512)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
