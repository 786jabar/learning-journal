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
  getUser: async function(username) {
    try {
      console.log(`[USER] Fetching GitHub user: ${username}...`);
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
          username: data.login,
          avatar: data.avatar_url,
          bio: data.bio,
          followers: data.followers,
          following: data.following,
          repos: data.public_repos,
          url: data.html_url
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
      console.log(`[STORAGE] Fetching repos for: ${username}...`);
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
