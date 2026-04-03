'use client';
import { useState, useEffect } from 'react';

// SET THE LIFESPAN: 4 Hours (in milliseconds)
// 4 hours * 60 minutes * 60 seconds * 1000 ms
const CACHE_TTL_MS = 4 * 60 * 60 * 1000;

export function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    const stickyValue = window.localStorage.getItem(key);
    
    if (stickyValue !== null) {
      try {
        const parsed = JSON.parse(stickyValue);
        
        // Check if this is a new TTL-wrapped object
        if (parsed && typeof parsed === 'object' && 'expiry' in parsed && 'data' in parsed) {
          const now = new Date().getTime();
          
          // If the current time is past the expiry time, nuke the cache
          if (now > parsed.expiry) {
            window.localStorage.removeItem(key);
            return defaultValue;
          }
          
          // If still valid, return the data
          return parsed.data;
        }
        
        // Legacy Support: If it's old data without an expiry, load it 
        // (it will be wrapped with an expiry on the next render)
        return parsed;
        
      } catch (error) {
        console.error(`Error parsing sticky state for ${key}`, error);
        return defaultValue;
      }
    }
    
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Wrap the data in a payload with an expiration timestamp
      const payload = {
        data: value,
        expiry: new Date().getTime() + CACHE_TTL_MS
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    }
  }, [key, value]);

  return [value, setValue];
}