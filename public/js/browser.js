// Lab 4: Browser API Demonstrations
// Student: Md Jawar Safi (#2315024)
// This file demonstrates Clipboard, Notifications, and Geolocation APIs

console.log("[BROWSER] Browser API Module Loaded");

// ===== 1. CLIPBOARD API =====
export const ClipboardAPI = {
  // Copy text to clipboard
  copyText: async function(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('[OK] Text copied to clipboard');
      return { success: true, message: 'Copied to clipboard!' };
    } catch (err) {
      console.error('[ERROR] Failed to copy:', err);
      return { success: false, message: 'Failed to copy text' };
    }
  },
  
  // Read text from clipboard
  pasteText: async function() {
    try {
      const text = await navigator.clipboard.readText();
      console.log('[OK] Text read from clipboard');
      return { success: true, text };
    } catch (err) {
      console.error('[ERROR] Failed to read clipboard:', err);
      return { success: false, text: '' };
    }
  },
  
  // Copy formatted content
  copyFormatted: async function(plainText, htmlText) {
    try {
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([htmlText], { type: 'text/html' })
      });
      await navigator.clipboard.write([clipboardItem]);
      console.log('[OK] Formatted content copied');
      return { success: true, message: 'Formatted content copied!' };
    } catch (err) {
      console.error('[ERROR] Failed to copy formatted content:', err);
      return { success: false, message: 'Failed to copy' };
    }
  }
};

// ===== 2. NOTIFICATIONS API =====
export const NotificationsAPI = {
  // Check if notifications are supported
  isSupported: function() {
    return 'Notification' in window;
  },
  
  // Request permission
  requestPermission: async function() {
    if (!this.isSupported()) {
      console.warn('[WARNING] Notifications not supported');
      return 'denied';
    }
    
    try {
      const permission = await Notification.requestPermission();
      console.log(`[NOTIFICATION] Notification permission: ${permission}`);
      return permission;
    } catch (err) {
      console.error('[ERROR] Failed to request permission:', err);
      return 'denied';
    }
  },
  
  // Show notification
  show: function(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('[WARNING] Notifications not supported');
      return null;
    }
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      console.log(`[NOTIFICATION] Notification shown: ${title}`);
      return notification;
    } else {
      console.warn('[WARNING] Notification permission not granted');
      return null;
    }
  },
  
  // Show success notification
  showSuccess: function(message) {
    return this.show('Success! [OK]', {
      body: message,
      tag: 'success',
      requireInteraction: false
    });
  },
  
  // Show error notification
  showError: function(message) {
    return this.show('Error [ERROR]', {
      body: message,
      tag: 'error',
      requireInteraction: false
    });
  },
  
  // Show info notification
  showInfo: function(message) {
    return this.show('Information', {
      body: message,
      tag: 'info',
      requireInteraction: false
    });
  }
};

// ===== 3. GEOLOCATION API =====
export const GeolocationAPI = {
  // Check if geolocation is supported
  isSupported: function() {
    return 'geolocation' in navigator;
  },
  
  // Get current position
  getCurrentPosition: function() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          console.log('[LOCATION] Location obtained:', data);
          resolve(data);
        },
        (error) => {
          console.error('[ERROR] Geolocation error:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  },
  
  // Watch position (continuous tracking)
  watchPosition: function(callback) {
    if (!this.isSupported()) {
      console.warn('[WARNING] Geolocation not supported');
      return null;
    }
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        console.log('[LOCATION] Position update:', data);
        callback(data);
      },
      (error) => {
        console.error('[ERROR] Watch position error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
    
    console.log(`[WATCH] Started watching position (ID: ${watchId})`);
    return watchId;
  },
  
  // Stop watching position
  clearWatch: function(watchId) {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      console.log(`[STOP] Stopped watching position (ID: ${watchId})`);
    }
  },
  
  // Format coordinates for display
  formatCoordinates: function(lat, lng) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
  }
};

// ===== 4. VALIDATION API (Form Validation) =====
export const ValidationAPI = {
  // Set custom validity message
  setCustomValidity: function(element, message) {
    element.setCustomValidity(message);
    console.log(`[OK] Custom validity set: ${message}`);
  },
  
  // Check validity
  checkValidity: function(element) {
    const isValid = element.checkValidity();
    console.log(`[SEARCH] Element validity: ${isValid}`);
    return isValid;
  },
  
  // Report validity (shows browser's built-in error messages)
  reportValidity: function(element) {
    return element.reportValidity();
  },
  
  // Validate form
  validateForm: function(formElement) {
    const isValid = formElement.checkValidity();
    
    if (!isValid) {
      formElement.reportValidity();
      console.log('[ERROR] Form validation failed');
    } else {
      console.log('[OK] Form is valid');
    }
    
    return isValid;
  }
};
