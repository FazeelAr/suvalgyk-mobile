export const lightColors = {
  primary: '#1f4d35',       // Deep green
  primaryMid: '#3a7a55',    // Mid green
  primaryLight: '#e8f3eb',  // Soft green bg
  background: '#faf6ee',    // Warm cream background
  surface: '#ffffff',       // Card white
  border: '#e5e0d3',        // Rule line
  textPrimary: '#1a1d1a',   // Ink dark
  textSecondary: '#4a534a', // Ink soft
  textMute: '#828a82',      // Ink mute
  tomato: '#d9402f',        // Tomato red
  tomatoSoft: '#fce8e5',    // Tomato light
  creamWarm: '#f3ecdc',     // Cream warm yellow for hero/warning strips
  white: '#ffffff',
  surfaceHover: '#f5f5f5',
};

export const darkColors = {
  primary: '#4ade80',       // Brighter green for dark mode
  primaryMid: '#22c55e',    
  primaryLight: '#14532d',  // Dark green bg
  background: '#121212',    // Dark background
  surface: '#1e1e1e',       // Dark card
  border: '#333333',        
  textPrimary: '#f5f5f5',   // Light text
  textSecondary: '#a3a3a3', // Muted light text
  textMute: '#737373',      
  tomato: '#ef4444',        
  tomatoSoft: '#7f1d1d',    
  creamWarm: '#2d2a24',     // Dark warm variant
  white: '#121212',         // Keep white semantic to background in dark mode
  surfaceHover: '#2a2a2a',
};

export type ColorsType = typeof lightColors;

// Fallback for static styles that can't be easily refactored yet, 
// though we will aim to replace this with useSettings() wherever possible.
export const colors = lightColors;
