import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, HardDrive, FileText, Copy, Bell, MapPin, Cloud, Quote, Github, ExternalLink, Video, Users, MessageCircle, BarChart3 } from "lucide-react";

export default function Lab4DemoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // State for form inputs
  const [theme, setTheme] = useState("light");
  const [sessionName, setSessionName] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [clipboardText, setClipboardText] = useState("");
  const [githubUsername, setGithubUsername] = useState("786jabar");
  const [tiktokUsername, setTiktokUsername] = useState("charlidamelio");
  
  // State for TikTok data
  const [tiktokData, setTiktokData] = useState<any>(null);
  const [tiktokTab, setTiktokTab] = useState("profile");

  // State for outputs
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  // Helper function to set output
  const setOutput = (key: string, value: string) => {
    setOutputs(prev => ({ ...prev, [key]: value }));
  };

  // === LOCALSTORAGE ===
  const handleSaveTheme = async () => {
    setLoading(prev => ({ ...prev, localStorage: true }));
    try {
      localStorage.setItem('lab4-theme', theme);
      setOutput('localStorage', `Theme "${theme}" saved to LocalStorage!\n\nThis data persists even after browser restart.`);
      toast({ title: "Success", description: "Theme saved to LocalStorage" });
    } catch (error) {
      setOutput('localStorage', `Error: ${error instanceof Error ? error.message : 'Failed to save'}`);
      toast({ title: "Error", description: "Failed to save theme", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, localStorage: false }));
    }
  };

  const handleLoadTheme = async () => {
    setLoading(prev => ({ ...prev, localStorage: true }));
    try {
      const saved = localStorage.getItem('lab4-theme');
      if (saved) {
        setTheme(saved);
        setOutput('localStorage', `Theme "${saved}" loaded from LocalStorage!\n\nValue retrieved and applied to dropdown.`);
        toast({ title: "Success", description: "Theme loaded from LocalStorage" });
      } else {
        setOutput('localStorage', 'No saved theme found. Please save a theme first.');
        toast({ title: "Info", description: "No saved theme found" });
      }
    } catch (error) {
      setOutput('localStorage', `Error: ${error instanceof Error ? error.message : 'Failed to load'}`);
    } finally {
      setLoading(prev => ({ ...prev, localStorage: false }));
    }
  };

  // === SESSIONSTORAGE ===
  const handleSaveSession = async () => {
    if (!sessionName.trim()) {
      toast({ title: "Warning", description: "Please enter your name", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, sessionStorage: true }));
    try {
      const sessionData = {
        name: sessionName,
        timestamp: new Date().toISOString(),
        visits: (parseInt(sessionStorage.getItem('visitCount') || '0')) + 1
      };
      sessionStorage.setItem('lab4-user', JSON.stringify(sessionData));
      sessionStorage.setItem('visitCount', sessionData.visits.toString());
      setOutput('sessionStorage', `Session Data Saved!\n\nName: ${sessionData.name}\nVisits: ${sessionData.visits}\nTimestamp: ${new Date(sessionData.timestamp).toLocaleString()}\n\nData will clear when tab closes.`);
      toast({ title: "Success", description: "Session data saved" });
    } catch (error) {
      setOutput('sessionStorage', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setLoading(prev => ({ ...prev, sessionStorage: false }));
    }
  };

  const handleLoadSession = async () => {
    setLoading(prev => ({ ...prev, sessionStorage: true }));
    try {
      const saved = sessionStorage.getItem('lab4-user');
      if (saved) {
        const data = JSON.parse(saved);
        setOutput('sessionStorage', `Session Data Retrieved!\n\nName: ${data.name}\nSaved at: ${new Date(data.timestamp).toLocaleString()}\nVisits: ${data.visits}`);
        toast({ title: "Success", description: "Session data loaded" });
      } else {
        setOutput('sessionStorage', 'No session data found. Please save first.');
        toast({ title: "Info", description: "No session data found" });
      }
    } catch (error) {
      setOutput('sessionStorage', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setLoading(prev => ({ ...prev, sessionStorage: false }));
    }
  };

  // === INDEXEDDB ===
  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({ title: "Warning", description: "Please fill in both title and content", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, indexedDB: true }));
    try {
      const note = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toISOString()
      };
      
      const db = await openIndexedDB();
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      await new Promise((resolve, reject) => {
        const request = store.put(note);
        request.onsuccess = resolve;
        request.onerror = reject;
      });
      
      setOutput('indexedDB', `Note Saved to IndexedDB!\n\nID: ${note.id}\nTitle: "${noteTitle}"\nContent: "${noteContent}"\nCreated: ${new Date(note.createdAt).toLocaleString()}`);
      setNoteTitle('');
      setNoteContent('');
      toast({ title: "Success", description: "Note saved to IndexedDB" });
    } catch (error) {
      setOutput('indexedDB', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, indexedDB: false }));
    }
  };

  const handleLoadNotes = async () => {
    setLoading(prev => ({ ...prev, indexedDB: true }));
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const notes: any[] = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
      });
      
      if (notes.length === 0) {
        setOutput('indexedDB', 'No notes in database. Save a note first!');
      } else {
        const output = `Found ${notes.length} note(s)!\n\n` + notes.map((note, i) => 
          `Note #${i + 1}:\n  Title: "${note.title}"\n  Content: "${note.content}"\n  Created: ${new Date(note.createdAt).toLocaleString()}`
        ).join('\n\n');
        setOutput('indexedDB', output);
      }
      toast({ title: "Success", description: `Loaded ${notes.length} notes` });
    } catch (error) {
      setOutput('indexedDB', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setLoading(prev => ({ ...prev, indexedDB: false }));
    }
  };

  // IndexedDB helper
  const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('Lab4Database', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  };

  // === CLIPBOARD ===
  const handleCopyText = async () => {
    if (!clipboardText.trim()) {
      toast({ title: "Warning", description: "Please enter text to copy", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, clipboard: true }));
    try {
      await navigator.clipboard.writeText(clipboardText);
      setOutput('clipboard', `Text Copied to Clipboard!\n\nCopied: "${clipboardText}"\n\nTry pasting (Ctrl+V) anywhere to verify!`);
      toast({ title: "Success", description: "Text copied to clipboard" });
    } catch (error) {
      setOutput('clipboard', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
      toast({ title: "Error", description: "Failed to copy text", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, clipboard: false }));
    }
  };

  // === NOTIFICATIONS ===
  const handleRequestNotification = async () => {
    setLoading(prev => ({ ...prev, notification: true }));
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setOutput('notification', 'Permission Granted!\n\nYou can now receive desktop notifications.\n\nClick "Send Test Notification" to try it!');
        toast({ title: "Success", description: "Notification permission granted" });
      } else {
        setOutput('notification', 'Permission Denied\n\nNotifications blocked. Enable in browser settings and refresh.');
        toast({ title: "Info", description: "Notification permission denied" });
      }
    } catch (error) {
      setOutput('notification', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setLoading(prev => ({ ...prev, notification: false }));
    }
  };

  const handleSendNotification = async () => {
    setLoading(prev => ({ ...prev, notification: true }));
    try {
      if (Notification.permission === 'granted') {
        new Notification('Lab 4 Demo', {
          body: 'This is a test notification from the React demo!',
          icon: '/favicon.ico'
        });
        setOutput('notification', 'Notification Sent!\n\nCheck your desktop/system notifications panel.');
        toast({ title: "Success", description: "Notification sent" });
      } else {
        setOutput('notification', 'Permission required. Click "Request Permission" first.');
        toast({ title: "Warning", description: "Permission required", variant: "destructive" });
      }
    } catch (error) {
      setOutput('notification', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setLoading(prev => ({ ...prev, notification: false }));
    }
  };

  // === GEOLOCATION ===
  const handleGetLocation = async () => {
    setLoading(prev => ({ ...prev, geolocation: true }));
    setOutput('geolocation', 'Getting your location...\n\nPlease allow location access when prompted.');
    try {
      const position: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      // Reverse geocoding
      setOutput('geolocation', 'Location found! Getting area name...');
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, {
          headers: { 'User-Agent': 'LearningJournal-Lab4-Student2315024' }
        });
        const data = await response.json();
        const address = data.address || {};
        const locationParts = [
          address.city || address.town || address.village,
          address.state || address.region,
          address.country
        ].filter(Boolean);
        const areaName = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown location';
        
        setOutput('geolocation', `Location Found!\n\nArea: ${areaName}\n\nLatitude: ${lat}\nLongitude: ${lng}\nAccuracy: ±${position.coords.accuracy.toFixed(0)} meters`);
        toast({ title: "Success", description: `Location: ${areaName}` });
      } catch {
        setOutput('geolocation', `Location Found!\n\nLatitude: ${lat}\nLongitude: ${lng}\nAccuracy: ±${position.coords.accuracy.toFixed(0)} meters\n\n(Area name unavailable)`);
      }
    } catch (error) {
      setOutput('geolocation', `Error: ${error instanceof Error ? error.message : 'Location access denied'}`);
      toast({ title: "Error", description: "Location access denied", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, geolocation: false }));
    }
  };

  // === WEATHER ===
  const handleGetWeather = async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    setOutput('weather', 'Getting weather...\n\nStep 1: Getting location...\nStep 2: Fetching weather data...');
    try {
      const position: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      const data = await response.json();
      const weather = data.current_weather;
      
      const weatherCodes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        61: 'Slight rain',
        80: 'Slight rain showers'
      };
      
      const description = weatherCodes[weather.weathercode] || 'Weather conditions';
      setOutput('weather', `Weather Data Loaded!\n\n${description}\n\nTemperature: ${weather.temperature}°C\nWind Speed: ${weather.windspeed} km/h\nUpdated: ${new Date(weather.time).toLocaleString()}`);
      toast({ title: "Success", description: `${description}, ${weather.temperature}°C` });
    } catch (error) {
      setOutput('weather', `Error: ${error instanceof Error ? error.message : 'Failed'}`);
      toast({ title: "Error", description: "Failed to get weather", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, weather: false }));
    }
  };

  // === QUOTES ===
  const handleGetQuote = async () => {
    setLoading(prev => ({ ...prev, quotes: true }));
    setOutput('quotes', 'Fetching quote...\n\nConnecting to Quotable API...');
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setOutput('quotes', `Quote Received!\n\n"${data.content}"\n\n— ${data.author}\n\nTags: ${data.tags.join(', ')}`);
      toast({ title: "Quote", description: data.author });
    } catch (error) {
      setOutput('quotes', `Error: ${error instanceof Error ? error.message : 'API unavailable'}`);
      toast({ title: "Error", description: "Failed to get quote", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, quotes: false }));
    }
  };

  // === GITHUB ===
  const handleGetGitHubUser = async () => {
    if (!githubUsername.trim()) {
      toast({ title: "Warning", description: "Please enter a username", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, github: true }));
    setOutput('github', `Fetching GitHub user...\n\nLoading profile for: ${githubUsername}`);
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}`);
      if (!response.ok) throw new Error('User not found');
      const user = await response.json();
      setOutput('github', `GitHub Profile Loaded!\n\nUsername: ${user.login}\nName: ${user.name || 'Not provided'}\nBio: ${user.bio || 'No bio'}\n\nFollowers: ${user.followers}\nFollowing: ${user.following}\nPublic Repos: ${user.public_repos}\nLocation: ${user.location || 'Not specified'}\n\nProfile: ${user.html_url}`);
      toast({ title: "Success", description: `Loaded profile for ${user.login}` });
    } catch (error) {
      setOutput('github', `Error: ${error instanceof Error ? error.message : 'User not found'}`);
      toast({ title: "Error", description: "Failed to get user", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, github: false }));
    }
  };

  // === TIKTOK ===
  // Demo mode: TikTok's official API requires OAuth and developer credentials
  const handleGetTikTokProfile = async () => {
    if (!tiktokUsername.trim()) {
      toast({ title: "Warning", description: "Please enter a TikTok username", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, tiktok: true }));
    try {
      // Demo mode: Generate sample data
      const profileData = {
        username: tiktokUsername,
        displayName: tiktokUsername.charAt(0).toUpperCase() + tiktokUsername.slice(1),
        avatar: `https://ui-avatars.com/api/?name=${tiktokUsername}&size=200&background=random`,
        bio: `TikTok creator @${tiktokUsername}`,
        followers: Math.floor(Math.random() * 100000) + 1000,
        following: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 1000000) + 10000,
        videos: Math.floor(Math.random() * 500) + 10,
        verified: false,
        profileUrl: `https://www.tiktok.com/@${tiktokUsername}`
      };
      
      setTiktokData(profileData);
      setTiktokTab('profile');
      toast({ 
        title: "Demo Mode", 
        description: "Showing sample data. Real API requires TikTok developer credentials." 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tiktok: false }));
    }
  };

  const handleGetTikTokFollowers = async () => {
    if (!tiktokUsername.trim()) {
      toast({ title: "Warning", description: "Please enter a TikTok username", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, tiktokFollowers: true }));
    try {
      // Demo mode: Generate mock followers
      const followers = Array.from({ length: 10 }, (_, i) => ({
        username: `user${Math.floor(Math.random() * 10000)}`,
        displayName: `TikTok User ${i + 1}`,
        avatar: `https://ui-avatars.com/api/?name=User${i + 1}&size=100&background=random`,
        isFollowing: Math.random() > 0.5,
        followerCount: Math.floor(Math.random() * 50000)
      }));
      
      setTiktokData((prev: any) => ({ ...prev, followers }));
      setTiktokTab('followers');
      toast({ 
        title: "Demo Mode", 
        description: `Loaded ${followers.length} sample followers` 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load followers", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tiktokFollowers: false }));
    }
  };

  const handleGetTikTokStats = async () => {
    if (!tiktokUsername.trim()) {
      toast({ title: "Warning", description: "Please enter a TikTok username", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, tiktokStats: true }));
    try {
      // Demo mode: Generate mock video stats
      const stats = {
        totalVideos: Math.floor(Math.random() * 500) + 10,
        totalViews: Math.floor(Math.random() * 10000000) + 100000,
        totalLikes: Math.floor(Math.random() * 1000000) + 10000,
        totalComments: Math.floor(Math.random() * 100000) + 1000,
        totalShares: Math.floor(Math.random() * 50000) + 500,
        averageViews: 0,
        averageLikes: 0
      };
      
      stats.averageViews = Math.floor(stats.totalViews / stats.totalVideos);
      stats.averageLikes = Math.floor(stats.totalLikes / stats.totalVideos);
      
      setTiktokData((prev: any) => ({ ...prev, stats }));
      setTiktokTab('stats');
      toast({ 
        title: "Demo Mode", 
        description: "Sample video statistics loaded" 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load stats", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tiktokStats: false }));
    }
  };

  const handleGetTikTokComments = async () => {
    if (!tiktokUsername.trim()) {
      toast({ title: "Warning", description: "Please enter a TikTok username", variant: "destructive" });
      return;
    }
    setLoading(prev => ({ ...prev, tiktokComments: true }));
    try {
      const sampleComments = [
        'This is amazing!', 'Love your content!', 'Keep it up!',
        'So creative!', 'Best video ever!', 'You inspire me!',
        'Can\'t stop watching!', 'Absolutely stunning!',
        'This made my day!', 'More please!'
      ];
      
      // Demo mode: Generate mock comments
      const comments = Array.from({ length: 10 }, (_, i) => ({
        id: `comment_${Date.now()}_${i}`,
        username: `commenter${Math.floor(Math.random() * 10000)}`,
        text: sampleComments[Math.floor(Math.random() * sampleComments.length)],
        likes: Math.floor(Math.random() * 1000),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        replies: Math.floor(Math.random() * 20)
      }));
      
      setTiktokData((prev: any) => ({ ...prev, comments }));
      setTiktokTab('comments');
      toast({ 
        title: "Demo Mode", 
        description: `Loaded ${comments.length} sample comments` 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load comments", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tiktokComments: false }));
    }
  };

  // Render output function
  const renderOutput = (key: string) => {
    const output = outputs[key];
    if (!output) return <p className="text-muted-foreground italic text-sm">Result will appear here...</p>;
    
    const lines = output.split('\n');
    return (
      <pre className="text-xs font-mono whitespace-pre-wrap">
        {lines.map((line, i) => {
          if (line.includes('Error:') || line.includes('[ERROR]')) {
            return <span key={i} className="text-destructive block">{line}</span>;
          } else if (line.includes('Success') || line.includes('[OK]')) {
            return <span key={i} className="text-green-500 block">{line}</span>;
          } else if (line.includes('Warning') || line.includes('[WARNING]')) {
            return <span key={i} className="text-yellow-500 block">{line}</span>;
          } else if (line.includes('Info') || line.includes('[INFO]')) {
            return <span key={i} className="text-blue-500 block">{line}</span>;
          }
          return <span key={i} className="block">{line}</span>;
        })}
      </pre>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero */}
      <div className="text-center mb-12 p-8 glass-card rounded-3xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="heading-lab4">
          Lab 4: API Demonstrations
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Comprehensive API Integration Showcase
        </p>
        <p className="text-muted-foreground mb-4">
          Storage APIs • Browser APIs • Third-Party APIs
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm">
          <span className="font-semibold">Student: Md Jawar Safi (#2315024)</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">FGCT6021 Mobile Application Development</span>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <a href="/lab4-demo.html" target="_blank">
              <ExternalLink className="h-4 w-4" />
              View Vanilla JS Demo
            </a>
          </Button>
        </div>
      </div>

      {/* Storage APIs */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">Storage APIs</h2>
          <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary rounded-md">
            LocalStorage • SessionStorage • IndexedDB
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LocalStorage */}
          <Card data-testid="card-localstorage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                LocalStorage
              </CardTitle>
              <CardDescription>Persistent storage surviving browser restarts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveTheme} disabled={loading.localStorage} className="flex-1" data-testid="button-save-theme">
                  {loading.localStorage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Theme'}
                </Button>
                <Button onClick={handleLoadTheme} variant="secondary" disabled={loading.localStorage} className="flex-1" data-testid="button-load-theme">
                  Load
                </Button>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-localstorage">
                {renderOutput('localStorage')}
              </div>
            </CardContent>
          </Card>

          {/* SessionStorage */}
          <Card data-testid="card-sessionstorage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SessionStorage
              </CardTitle>
              <CardDescription>Temporary storage clearing when tab closes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your name..."
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                data-testid="input-session-name"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleSaveSession} disabled={loading.sessionStorage} className="flex-1" data-testid="button-save-session">
                  {loading.sessionStorage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
                <Button onClick={handleLoadSession} variant="secondary" disabled={loading.sessionStorage} className="flex-1" data-testid="button-load-session">
                  Load
                </Button>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-sessionstorage">
                {renderOutput('sessionStorage')}
              </div>
            </CardContent>
          </Card>

          {/* IndexedDB */}
          <Card data-testid="card-indexeddb">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                IndexedDB
              </CardTitle>
              <CardDescription>Advanced database for structured data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                data-testid="input-note-title"
              />
              <Textarea
                placeholder="Note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[80px]"
                data-testid="textarea-note-content"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleSaveNote} disabled={loading.indexedDB} className="flex-1" data-testid="button-save-note">
                  {loading.indexedDB ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Note'}
                </Button>
                <Button onClick={handleLoadNotes} variant="secondary" disabled={loading.indexedDB} className="flex-1" data-testid="button-load-notes">
                  Load All
                </Button>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-indexeddb">
                {renderOutput('indexedDB')}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Browser APIs */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">Browser APIs</h2>
          <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary rounded-md">
            Clipboard • Notifications • Geolocation
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Clipboard */}
          <Card data-testid="card-clipboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Clipboard API
              </CardTitle>
              <CardDescription>Copy text without manual selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to copy..."
                value={clipboardText}
                onChange={(e) => setClipboardText(e.target.value)}
                className="min-h-[80px]"
                data-testid="textarea-clipboard-text"
              />
              
              <Button onClick={handleCopyText} disabled={loading.clipboard} className="w-full" data-testid="button-copy-text">
                {loading.clipboard ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Copy to Clipboard'}
              </Button>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-clipboard">
                {renderOutput('clipboard')}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card data-testid="card-notification">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications API
              </CardTitle>
              <CardDescription>Send desktop notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleRequestNotification} disabled={loading.notification} className="flex-1" data-testid="button-request-notification">
                  {loading.notification ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request'}
                </Button>
                <Button onClick={handleSendNotification} variant="secondary" disabled={loading.notification} className="flex-1" data-testid="button-send-notification">
                  Send Test
                </Button>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-notification">
                {renderOutput('notification')}
              </div>
            </CardContent>
          </Card>

          {/* Geolocation */}
          <Card data-testid="card-geolocation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geolocation API
              </CardTitle>
              <CardDescription>Get user's geographic location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGetLocation} disabled={loading.geolocation} className="w-full" data-testid="button-get-location">
                {loading.geolocation ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get My Location'}
              </Button>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-location">
                {renderOutput('geolocation')}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Third-Party APIs */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">Third-Party APIs</h2>
          <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary rounded-md">
            Weather • Quotes • GitHub • TikTok
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather */}
          <Card data-testid="card-weather">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Weather API
              </CardTitle>
              <CardDescription>Real-time weather data from Open-Meteo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGetWeather} disabled={loading.weather} className="w-full" data-testid="button-get-weather">
                {loading.weather ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Weather'}
              </Button>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-weather">
                {renderOutput('weather')}
              </div>
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card data-testid="card-quotes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5" />
                Quotes API
              </CardTitle>
              <CardDescription>Random inspirational quotes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGetQuote} disabled={loading.quotes} className="w-full" data-testid="button-get-quote">
                {loading.quotes ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Random Quote'}
              </Button>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-quote">
                {renderOutput('quotes')}
              </div>
            </CardContent>
          </Card>

          {/* GitHub */}
          <Card data-testid="card-github">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub API
              </CardTitle>
              <CardDescription>Fetch public GitHub profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="GitHub username..."
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                data-testid="input-github-username"
              />
              
              <Button onClick={handleGetGitHubUser} disabled={loading.github} className="w-full" data-testid="button-get-github-user">
                {loading.github ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get User Profile'}
              </Button>
              
              <div className="p-3 bg-secondary/50 rounded-md min-h-[100px]" data-testid="output-github">
                {renderOutput('github')}
              </div>
            </CardContent>
          </Card>

          {/* TikTok - Spans 2 columns for larger display */}
          <Card className="md:col-span-2" data-testid="card-tiktok">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                TikTok API (Demo Mode)
              </CardTitle>
              <CardDescription>
                View profile, followers, likes, comments, and stats (Demo data - Real API requires TikTok developer credentials)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="TikTok username..."
                  value={tiktokUsername}
                  onChange={(e) => setTiktokUsername(e.target.value)}
                  data-testid="input-tiktok-username"
                  className="flex-1"
                />
                <Button onClick={handleGetTikTokProfile} disabled={loading.tiktok} data-testid="button-get-tiktok-profile">
                  {loading.tiktok ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Profile'}
                </Button>
              </div>

              {tiktokData && (
                <Tabs value={tiktokTab} onValueChange={setTiktokTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile" className="gap-1" data-testid="tab-tiktok-profile">
                      <Video className="h-3 w-3" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="followers" className="gap-1" data-testid="tab-tiktok-followers">
                      <Users className="h-3 w-3" />
                      Followers
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="gap-1" data-testid="tab-tiktok-stats">
                      <BarChart3 className="h-3 w-3" />
                      Stats
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="gap-1" data-testid="tab-tiktok-comments">
                      <MessageCircle className="h-3 w-3" />
                      Comments
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-4" data-testid="content-tiktok-profile">
                    <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={tiktokData.avatar} alt={tiktokData.username} />
                        <AvatarFallback>{tiktokData.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">@{tiktokData.username}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{tiktokData.displayName}</p>
                        <p className="text-sm mb-3">{tiktokData.bio}</p>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="font-bold text-lg">{tiktokData.followers?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{tiktokData.following?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Following</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{tiktokData.likes?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{tiktokData.videos}</div>
                            <div className="text-xs text-muted-foreground">Videos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleGetTikTokFollowers} disabled={loading.tiktokFollowers} size="sm" variant="outline" className="flex-1" data-testid="button-load-followers">
                        {loading.tiktokFollowers ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Load Followers'}
                      </Button>
                      <Button onClick={handleGetTikTokStats} disabled={loading.tiktokStats} size="sm" variant="outline" className="flex-1" data-testid="button-load-stats">
                        {loading.tiktokStats ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Load Stats'}
                      </Button>
                      <Button onClick={handleGetTikTokComments} disabled={loading.tiktokComments} size="sm" variant="outline" className="flex-1" data-testid="button-load-comments">
                        {loading.tiktokComments ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Load Comments'}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Followers Tab */}
                  <TabsContent value="followers" className="space-y-3" data-testid="content-tiktok-followers">
                    {tiktokData.followers?.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {tiktokData.followers.map((follower: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={follower.avatar} alt={follower.username} />
                              <AvatarFallback>{follower.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">@{follower.username}</div>
                              <div className="text-xs text-muted-foreground">{follower.displayName}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {follower.followerCount?.toLocaleString()} followers
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Click "Load Followers" to view follower list</p>
                        <Button onClick={handleGetTikTokFollowers} disabled={loading.tiktokFollowers} data-testid="button-load-followers">
                          {loading.tiktokFollowers ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Followers'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="space-y-3" data-testid="content-tiktok-stats">
                    {tiktokData.stats ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.totalVideos}</div>
                          <div className="text-sm text-muted-foreground">Total Videos</div>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.totalViews?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Views</div>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.totalLikes?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Likes</div>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.totalComments?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Comments</div>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.totalShares?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Shares</div>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold">{tiktokData.stats.averageViews?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Avg Views/Video</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Click "Load Stats" to view video statistics</p>
                        <Button onClick={handleGetTikTokStats} disabled={loading.tiktokStats} data-testid="button-load-stats">
                          {loading.tiktokStats ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Stats'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Comments Tab */}
                  <TabsContent value="comments" className="space-y-3" data-testid="content-tiktok-comments">
                    {tiktokData.comments?.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {tiktokData.comments.map((comment: any, i: number) => (
                          <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">@{comment.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{comment.text}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>{comment.likes} likes</span>
                              <span>{comment.replies} replies</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Click "Load Comments" to view recent comments</p>
                        <Button onClick={handleGetTikTokComments} disabled={loading.tiktokComments} data-testid="button-load-comments">
                          {loading.tiktokComments ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Comments'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {!tiktokData && (
                <div className="p-8 text-center text-muted-foreground bg-secondary/20 rounded-lg">
                  <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Enter a TikTok username and click "Load Profile" to view demo data</p>
                  <p className="text-xs mt-2">Demo mode shows sample data. Real API requires TikTok developer credentials.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-8 border-t">
        <p>Lab 4: API Integration Demonstrations</p>
        <p>Student: Md Jawar Safi (#2315024) | FGCT6021 Mobile Application Development</p>
        <p className="mt-2">React + TypeScript + Shadcn/UI | Storage, Browser & Third-Party APIs</p>
      </footer>
    </div>
  );
}
