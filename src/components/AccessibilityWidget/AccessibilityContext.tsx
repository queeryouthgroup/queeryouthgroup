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
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('accessibility-settings');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
        } catch (error) {
          console.error('Failed to load accessibility settings:', error);
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(state));
    }
  }, [state]);

  // Apply accessibility settings to the DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;
    
    // Remove all accessibility classes first
    const classesToRemove = [
      'accessibility-contrast-invert',
      'accessibility-contrast-dark', 
      'accessibility-contrast-light',
      'accessibility-highlight-links',
      'accessibility-pause-animations',
      'accessibility-hide-images',
      'accessibility-tooltips',
      'accessibility-font-dyslexia',
      'accessibility-font-legible',
      'accessibility-cursor-big',
      'accessibility-cursor-reading-guide',
      'accessibility-cursor-reading-mask',
      'accessibility-saturation-low',
      'accessibility-saturation-heavy',
      'accessibility-saturation-desaturate'
    ];
    
    classesToRemove.forEach(className => {
      body.classList.remove(className);
    });

    // Apply CSS custom properties
    root.style.setProperty('--accessibility-text-scale', state.textSize.toString());
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
    
    // Apply contrast
    if (state.contrast !== 'normal') {
      body.classList.add(`accessibility-contrast-${state.contrast}`);
    }
    
    // Apply other accessibility classes
    if (state.highlightLinks) {
      body.classList.add('accessibility-highlight-links');
    }
    
    if (state.pauseAnimations) {
      body.classList.add('accessibility-pause-animations');
    }
    
    if (state.hideImages) {
      body.classList.add('accessibility-hide-images');
    }
    
    if (state.tooltips) {
      body.classList.add('accessibility-tooltips');
    }
    
    if (state.fontType !== 'normal') {
      body.classList.add(`accessibility-font-${state.fontType}`);
    }
    
    if (state.cursor !== 'normal') {
      body.classList.add(`accessibility-cursor-${state.cursor}`);
    }
    
    if (state.saturation !== 'normal') {
      body.classList.add(`accessibility-saturation-${state.saturation}`);
    }

    // Create and inject CSS for dynamic styles that can't be handled by classes
    let styleElement = document.getElementById('accessibility-dynamic-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'accessibility-dynamic-styles';
      document.head.appendChild(styleElement);
    }

    const dynamicCSS = `
      /* Dynamic accessibility styles */
      .accessibility-text-scale * {
        font-size: calc(1em * ${state.textSize}) !important;
      }
      
      .accessibility-line-height * {
        line-height: calc(${state.lineHeight} * 1.2) !important;
      }
      
      .accessibility-letter-spacing * {
        letter-spacing: ${spacingMap[state.textSpacing]} !important;
      }
      
      .accessibility-text-align * {
        text-align: ${state.textAlign} !important;
      }
    `;

    styleElement.textContent = dynamicCSS;

    // Apply classes to body to enable the styles
    body.classList.add('accessibility-text-scale');
    body.classList.add('accessibility-line-height'); 
    body.classList.add('accessibility-letter-spacing');
    body.classList.add('accessibility-text-align');
    
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