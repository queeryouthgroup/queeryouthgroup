"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Accessibility state interface
export interface AccessibilityState {
  // Contrast
  contrast: 'normal' | 'invert' | 'dark' | 'light';
  
  // Links
  highlightLinks: boolean;
  
  // Text size
  textSize: 1 | 2 | 3 | 4;
  
  // Text spacing
  textSpacing: 'normal' | 'light' | 'moderate' | 'heavy';
  
  // Animations
  pauseAnimations: boolean;
  
  // Images
  hideImages: boolean;
  
  // Fonts
  fontType: 'normal' | 'dyslexia' | 'legible';
  
  // Cursor
  cursor: 'normal' | 'big' | 'reading-guide' | 'reading-mask';
  
  // Line height
  lineHeight: 1 | 1.5 | 1.75 | 2;
  
  // Text alignment
  textAlign: 'left' | 'center' | 'right' | 'justified';
  
  // Saturation
  saturation: 'normal' | 'low' | 'heavy' | 'desaturate';
  
  // Tooltips
  tooltips: boolean;
  
  // Widget state
  isWidgetOpen: boolean;
  hasAccessibilityEnabled: boolean;
}

// Action types
type AccessibilityAction =
  | { type: 'SET_CONTRAST'; payload: AccessibilityState['contrast'] }
  | { type: 'TOGGLE_HIGHLIGHT_LINKS' }
  | { type: 'SET_TEXT_SIZE'; payload: AccessibilityState['textSize'] }
  | { type: 'SET_TEXT_SPACING'; payload: AccessibilityState['textSpacing'] }
  | { type: 'TOGGLE_PAUSE_ANIMATIONS' }
  | { type: 'TOGGLE_HIDE_IMAGES' }
  | { type: 'SET_FONT_TYPE'; payload: AccessibilityState['fontType'] }
  | { type: 'SET_CURSOR'; payload: AccessibilityState['cursor'] }
  | { type: 'SET_LINE_HEIGHT'; payload: AccessibilityState['lineHeight'] }
  | { type: 'SET_TEXT_ALIGN'; payload: AccessibilityState['textAlign'] }
  | { type: 'SET_SATURATION'; payload: AccessibilityState['saturation'] }
  | { type: 'TOGGLE_TOOLTIPS' }
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_STATE'; payload: AccessibilityState };

// Initial state
const initialState: AccessibilityState = {
  contrast: 'normal',
  highlightLinks: false,
  textSize: 1,
  textSpacing: 'normal',
  pauseAnimations: false,
  hideImages: false,
  fontType: 'normal',
  cursor: 'normal',
  lineHeight: 1,
  textAlign: 'left',
  saturation: 'normal',
  tooltips: false,
  isWidgetOpen: false,
  hasAccessibilityEnabled: false,
};

// Reducer
function accessibilityReducer(state: AccessibilityState, action: AccessibilityAction): AccessibilityState {
  let newState = { ...state };

  switch (action.type) {
    case 'SET_CONTRAST':
      newState.contrast = action.payload;
      break;
    case 'TOGGLE_HIGHLIGHT_LINKS':
      newState.highlightLinks = !state.highlightLinks;
      break;
    case 'SET_TEXT_SIZE':
      newState.textSize = action.payload;
      break;
    case 'SET_TEXT_SPACING':
      newState.textSpacing = action.payload;
      break;
    case 'TOGGLE_PAUSE_ANIMATIONS':
      newState.pauseAnimations = !state.pauseAnimations;
      break;
    case 'TOGGLE_HIDE_IMAGES':
      newState.hideImages = !state.hideImages;
      break;
    case 'SET_FONT_TYPE':
      newState.fontType = action.payload;
      break;
    case 'SET_CURSOR':
      newState.cursor = action.payload;
      break;
    case 'SET_LINE_HEIGHT':
      newState.lineHeight = action.payload;
      break;
    case 'SET_TEXT_ALIGN':
      newState.textAlign = action.payload;
      break;
    case 'SET_SATURATION':
      newState.saturation = action.payload;
      break;
    case 'TOGGLE_TOOLTIPS':
      newState.tooltips = !state.tooltips;
      break;
    case 'TOGGLE_WIDGET':
      newState.isWidgetOpen = !state.isWidgetOpen;
      break;
    case 'RESET_ALL':
      newState = { ...initialState, isWidgetOpen: state.isWidgetOpen };
      break;
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  // Check if any accessibility feature is enabled
  newState.hasAccessibilityEnabled = 
    newState.contrast !== 'normal' ||
    newState.highlightLinks ||
    newState.textSize !== 1 ||
    newState.textSpacing !== 'normal' ||
    newState.pauseAnimations ||
    newState.hideImages ||
    newState.fontType !== 'normal' ||
    newState.cursor !== 'normal' ||
    newState.lineHeight !== 1 ||
    newState.textAlign !== 'left' ||
    newState.saturation !== 'normal' ||
    newState.tooltips;

  return newState;
}

// Context
const AccessibilityContext = createContext<{
  state: AccessibilityState;
  dispatch: React.Dispatch<AccessibilityAction>;
} | null>(null);

// Provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('accessibility-settings');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(state));
  }, [state]);

  // Apply CSS custom properties based on state
  useEffect(() => {
    const root = document.documentElement;
    
    // Text size
    root.style.setProperty('--accessibility-text-scale', state.textSize.toString());
    
    // Line height
    root.style.setProperty('--accessibility-line-height', state.lineHeight.toString());
    
    // Text spacing
    const spacingMap = {
      normal: '0',
      light: '0.05em',
      moderate: '0.1em',
      heavy: '0.15em'
    };
    root.style.setProperty('--accessibility-letter-spacing', spacingMap[state.textSpacing]);
    
    // Text alignment
    root.style.setProperty('--accessibility-text-align', state.textAlign);
    
    // Apply contrast classes
    document.body.className = document.body.className.replace(/accessibility-contrast-\w+/g, '');
    if (state.contrast !== 'normal') {
      document.body.classList.add(`accessibility-contrast-${state.contrast}`);
    }
    
    // Apply other classes
    document.body.classList.toggle('accessibility-highlight-links', state.highlightLinks);
    document.body.classList.toggle('accessibility-pause-animations', state.pauseAnimations);
    document.body.classList.toggle('accessibility-hide-images', state.hideImages);
    document.body.classList.toggle('accessibility-tooltips', state.tooltips);
    document.body.classList.toggle(`accessibility-font-${state.fontType}`, state.fontType !== 'normal');
    document.body.classList.toggle(`accessibility-cursor-${state.cursor}`, state.cursor !== 'normal');
    document.body.classList.toggle(`accessibility-saturation-${state.saturation}`, state.saturation !== 'normal');
    
  }, [state]);

  return (
    <AccessibilityContext.Provider value={{ state, dispatch }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}