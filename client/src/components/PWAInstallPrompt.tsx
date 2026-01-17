import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed || Date.now() - parseInt(dismissed) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isStandalone || (!deferredPrompt && !isIOS)) {
    return null;
  }

  if (!showPrompt && !isIOS) {
    return null;
  }

  if (isIOS && !isStandalone) {
    const iosDismissed = localStorage.getItem('ios-install-dismissed');
    if (iosDismissed && Date.now() - parseInt(iosDismissed) < 7 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
        <Card className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 border-purple-500/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-300" />
                <CardTitle className="text-white text-lg" data-testid="text-ios-install-title">
                  Install Learning Journal
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-300 hover:text-white"
                onClick={() => {
                  localStorage.setItem('ios-install-dismissed', Date.now().toString());
                  setIsIOS(false);
                }}
                data-testid="button-dismiss-ios-install"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-purple-200">
              Add to your home screen for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-purple-100 space-y-2">
              <p>1. Tap the <strong>Share</strong> button in Safari</p>
              <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              <p>3. Tap <strong>"Add"</strong> to install</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 border-purple-500/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-300" />
              <CardTitle className="text-white text-lg" data-testid="text-install-title">
                Install Learning Journal
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-300 hover:text-white"
              onClick={handleDismiss}
              data-testid="button-dismiss-install"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-purple-200">
            Play offline anytime, anywhere!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            onClick={handleInstallClick}
            data-testid="button-install-app"
          >
            <Download className="mr-2 h-4 w-4" />
            Install Now
          </Button>
          <Button
            variant="outline"
            className="border-purple-400 text-purple-200 hover:bg-purple-800/50"
            onClick={handleDismiss}
            data-testid="button-later"
          >
            Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
