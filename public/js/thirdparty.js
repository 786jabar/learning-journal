// Lab 4: Third-Party API Demonstrations
// Student: Md Jawar Safi (#2315024)
// This file demonstrates Weather API and Quotes API

console.log("[API] Third-Party API Module Loaded");

// ===== 1. WEATHER API (OpenWeatherMap) =====
export const WeatherAPI = {
  // Free tier - no API key required for basic functionality
  // Using OpenMeteo instead (completely free, no API key)
  baseURL: 'https://api.open-meteo.com/v1',
  
  // Get weather by coordinates
  getWeatherByCoords: async function(latitude, longitude) {
    try {
      const url = `${this.baseURL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`;
      
      console.log('[WEATHER] Fetching weather data...');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[OK] Weather data received:', data);
      
      return {
        success: true,
        data: {
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode,
          time: data.current_weather.time,
          description: this.getWeatherDescription(data.current_weather.weathercode)
        }
      };
    } catch (error) {
      console.error('[ERROR] Weather API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get weather description from code
  getWeatherDescription: function(code) {
    const weatherCodes = {
      0: '[SUN] Clear sky',
      1: '[WEATHER] Mainly clear',
      2: '[CLOUDY] Partly cloudy',
      3: '[CLOUDS] Overcast',
      45: '[FOG] Foggy',
      48: '[FOG] Depositing rime fog',
      51: '[RAIN] Light drizzle',
      53: '[RAIN] Moderate drizzle',
      55: '[RAIN] Dense drizzle',
      61: '[HEAVY_RAIN] Slight rain',
      63: '[HEAVY_RAIN] Moderate rain',
      65: '[HEAVY_RAIN] Heavy rain',
      71: '[SNOW] Slight snow',
      73: '[SNOW] Moderate snow',
      75: '[SNOW] Heavy snow',
      77: '[SNOW] Snow grains',
      80: '[RAIN] Slight rain showers',
      81: '[RAIN] Moderate rain showers',
      82: '[HEAVY_RAIN] Violent rain showers',
      85: '[SNOW] Slight snow showers',
      86: '[SNOW] Heavy snow showers',
      95: '[STORM] Thunderstorm',
      96: '[STORM] Thunderstorm with hail',
      99: '[STORM] Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || '[TEMP] Unknown weather';
  },
  
  // Format weather for display
  formatWeather: function(weatherData) {
    return `
      ${weatherData.description}
      Temperature: ${weatherData.temperature}°C
      Wind: ${weatherData.windspeed} km/h
      Updated: ${new Date(weatherData.time).toLocaleString()}
    `;
  }
};

// ===== 2. QUOTES API (Quotable.io) =====
export const QuotesAPI = {
  baseURL: 'https://api.quotable.io',
  
  // Get random quote
  getRandomQuote: async function() {
    try {
      console.log('[QUOTE] Fetching random quote...');
      const response = await fetch(`${this.baseURL}/random`);
      
      if (!response.ok) {
        throw new Error(`Quotes API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[OK] Quote received:', data);
      
      return {
        success: true,
        data: {
          content: data.content,
          author: data.author,
          tags: data.tags
        }
      };
    } catch (error) {
      console.error('[ERROR] Quotes API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get quote by tag
  getQuoteByTag: async function(tag) {
    try {
      console.log(`[QUOTE] Fetching quote with tag: ${tag}...`);
      const response = await fetch(`${this.baseURL}/random?tags=${tag}`);
      
      if (!response.ok) {
        throw new Error(`Quotes API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[OK] Quote received:', data);
      
      return {
        success: true,
        data: {
          content: data.content,
          author: data.author,
          tags: data.tags
        }
      };
    } catch (error) {
      console.error('[ERROR] Quotes API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get list of available tags
  getTags: async function() {
    try {
      console.log('[TAGS] Fetching available tags...');
      const response = await fetch(`${this.baseURL}/tags`);
      
      if (!response.ok) {
        throw new Error(`Quotes API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[OK] Received ${data.length} tags`);
      
      return {
        success: true,
        data: data.map(tag => tag.name)
      };
    } catch (error) {
      console.error('[ERROR] Tags API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Format quote for display
  formatQuote: function(quote) {
    return `"${quote.content}"\n\n— ${quote.author}`;
  }
};

// ===== 3. GITHUB API (Public API - No Auth Required) =====
export const GitHubAPI = {
  baseURL: 'https://api.github.com',
  
  // Get user profile
  getUserProfile: async function(username) {
    try {
      console.log(`[GITHUB] Fetching GitHub user: ${username}...`);
      const response = await fetch(`${this.baseURL}/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[OK] User data received:', data);
      
      return {
        success: true,
        data: {
          name: data.name,
          login: data.login,
          avatar_url: data.avatar_url,
          bio: data.bio,
          followers: data.followers,
          following: data.following,
          public_repos: data.public_repos,
          location: data.location,
          html_url: data.html_url
        }
      };
    } catch (error) {
      console.error('[ERROR] GitHub API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get user repositories
  getRepos: async function(username) {
    try {
      console.log(`[GITHUB] Fetching repos for: ${username}...`);
      const response = await fetch(`${this.baseURL}/users/${username}/repos?sort=updated&per_page=10`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[OK] Received ${data.length} repositories`);
      
      return {
        success: true,
        data: data.map(repo => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          updated: repo.updated_at
        }))
      };
    } catch (error) {
      console.error('[ERROR] GitHub API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// ===== 4. TIKTOK API (Demo Mode) =====
/**
 * TikTok API Integration
 * 
 * IMPORTANT: TikTok's official API requires OAuth authentication and developer credentials.
 * This implementation runs in demo mode with sample data.
 * 
 * To use the real TikTok API:
 * 1. Register at https://developers.tiktok.com/
 * 2. Create a new app in the TikTok Developer Portal
 * 3. Obtain your Client Key and Client Secret
 * 4. Implement OAuth 2.0 flow for user authorization
 * 5. Use the authorized access tokens to call TikTok endpoints
 * 
 * Available TikTok API Endpoints (with credentials):
 * - User Info: /v2/user/info/
 * - User Videos: /v2/video/list/
 * - Video Comments: /v2/comment/list/
 * - Video Analytics: /v2/video/query/
 * 
 * API Documentation: https://developers.tiktok.com/doc/
 * Rate Limits: Varies by endpoint (typically 100-1000 requests/day for free tier)
 * 
 * Alternative: Use third-party services like RapidAPI's TikTok endpoints
 * which handle authentication and provide simpler REST APIs.
 */
export const TikTokAPI = {
  // Note: Currently running in demo mode
  // Replace with real API calls once you have TikTok developer credentials
  
  // Get user profile with demo data
  getUserProfile: async function(username) {
    try {
      console.log(`[TIKTOK] Fetching TikTok user: ${username}...`);
      
      // Demo mode: Return mock data structure
      // In production, you would use RapidAPI TikTok endpoint or similar service
      const demoData = {
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        avatar: `https://ui-avatars.com/api/?name=${username}&size=200&background=random`,
        bio: `TikTok creator @${username}`,
        followers: Math.floor(Math.random() * 100000) + 1000,
        following: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 1000000) + 10000,
        videos: Math.floor(Math.random() * 500) + 10,
        verified: false,
        profileUrl: `https://www.tiktok.com/@${username}`
      };
      
      console.log('[OK] TikTok profile data (demo mode):', demoData);
      
      return {
        success: true,
        demo: true,
        data: demoData,
        message: 'Demo mode: Showing sample data. To use real TikTok API, register at developers.tiktok.com'
      };
    } catch (error) {
      console.error('[ERROR] TikTok API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get user's recent followers (demo data)
  getFollowers: async function(username, limit = 10) {
    try {
      console.log(`[TIKTOK] Fetching followers for: ${username}...`);
      
      // Demo mode: Generate mock followers
      const followers = Array.from({ length: limit }, (_, i) => ({
        username: `user${Math.floor(Math.random() * 10000)}`,
        displayName: `TikTok User ${i + 1}`,
        avatar: `https://ui-avatars.com/api/?name=User${i + 1}&size=100&background=random`,
        isFollowing: Math.random() > 0.5,
        followerCount: Math.floor(Math.random() * 50000)
      }));
      
      console.log(`[OK] Retrieved ${followers.length} followers (demo mode)`);
      
      return {
        success: true,
        demo: true,
        data: followers,
        message: 'Demo mode: Showing sample follower data'
      };
    } catch (error) {
      console.error('[ERROR] TikTok followers error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get user's video stats (demo data)
  getVideoStats: async function(username) {
    try {
      console.log(`[TIKTOK] Fetching video stats for: ${username}...`);
      
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
      
      console.log('[OK] Video stats retrieved (demo mode):', stats);
      
      return {
        success: true,
        demo: true,
        data: stats,
        message: 'Demo mode: Showing sample video statistics'
      };
    } catch (error) {
      console.error('[ERROR] TikTok video stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get recent comments on user's videos (demo data)
  getRecentComments: async function(username, limit = 10) {
    try {
      console.log(`[TIKTOK] Fetching recent comments for: ${username}...`);
      
      const sampleComments = [
        'This is amazing!',
        'Love your content!',
        'Keep it up!',
        'So creative!',
        'Best video ever!',
        'You inspire me!',
        'Can\'t stop watching!',
        'Absolutely stunning!',
        'This made my day!',
        'More please!'
      ];
      
      // Demo mode: Generate mock comments
      const comments = Array.from({ length: limit }, (_, i) => ({
        id: `comment_${Date.now()}_${i}`,
        username: `commenter${Math.floor(Math.random() * 10000)}`,
        text: sampleComments[Math.floor(Math.random() * sampleComments.length)],
        likes: Math.floor(Math.random() * 1000),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        replies: Math.floor(Math.random() * 20)
      }));
      
      console.log(`[OK] Retrieved ${comments.length} comments (demo mode)`);
      
      return {
        success: true,
        demo: true,
        data: comments,
        message: 'Demo mode: Showing sample comments'
      };
    } catch (error) {
      console.error('[ERROR] TikTok comments error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Format profile for display
  formatProfile: function(profile) {
    return `
Username: @${profile.username}
Display Name: ${profile.displayName}
Bio: ${profile.bio}

Followers: ${profile.followers.toLocaleString()}
Following: ${profile.following.toLocaleString()}
Total Likes: ${profile.likes.toLocaleString()}
Videos: ${profile.videos}
${profile.verified ? '✓ Verified Account' : ''}

Profile: ${profile.profileUrl}
    `.trim();
  }
};
