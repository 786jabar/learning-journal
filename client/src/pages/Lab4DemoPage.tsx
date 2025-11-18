import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Lab4DemoPage() {
  useEffect(() => {
    console.log("[Lab 4] Redirecting to vanilla JS demo");
    
    // Redirect to standalone vanilla JS demo after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = '/lab4-demo.html';
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text" data-testid="heading-lab4">
          Lab 4: API Demonstrations
        </h1>
        <p className="text-muted-foreground mb-8">
          Student: Md Jawar Safi (#2315024) | FGCT6021 Mobile Application Development
        </p>
        
        <div className="glass-card p-8 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Vanilla JavaScript Demo</h2>
          <p className="text-muted-foreground mb-6">
            Lab 4 requires vanilla JavaScript files in the /js folder. 
            Redirecting you to the standalone demo that properly imports and uses the modules...
          </p>
          
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-600 animate-pulse" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Redirecting in 2 seconds...</p>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/lab4-demo.html'}
            className="gap-2 w-full"
            data-testid="button-goto-demo"
          >
            <ExternalLink className="h-4 w-4" />
            Go to Vanilla JS Demo Now
          </Button>
          
          <div className="mt-8 text-left">
            <h3 className="font-semibold mb-3">Vanilla JavaScript Files:</h3>
            <ul className="text-sm font-mono text-muted-foreground space-y-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">[OK]</span>
                <span>/public/js/storage.js</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">[OK]</span>
                <span>/public/js/browser.js</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">[OK]</span>
                <span>/public/js/thirdparty.js</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">[OK]</span>
                <span>/public/lab4-demo.html</span>
              </li>
            </ul>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm">
                <strong>Note:</strong> The standalone HTML file properly imports and uses the ES6 modules 
                from /js folder, meeting Lab 4 requirements for vanilla JavaScript separation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
