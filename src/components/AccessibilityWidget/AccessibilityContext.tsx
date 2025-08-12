"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface AccessibilityState {
  contrast: 'normal' | 'invert' | 'dark' | 'light';
  highlightLinks: boolean;
  textSize: 1 | 2 | 3 | 4;
  textSpacing: 'normal' | 'light' | 'moderate' | 'heavy';
  pauseAnimations: boolean;
  hideImages: boolean;
  fontType: 'normal' | 'dyslexia' | 'legible';
  cursor: 'normal' | 'big' | 'reading-guide' | 'reading-mask';
  lineHeight: 1 | 1.5 | 1.75 | 2;
  textAlign: 'left' | 'center' | 'right' | 'justified';
  saturation: 'normal' | 'low' | 'heavy' | 'desaturate';
  tooltips: boolean;
  isWidgetOpen: boolean;
  hasAccessibilityEnabled: boolean;
}

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

const AccessibilityContext = createContext<{
  state: AccessibilityState;
  dispatch: React.Dispatch<AccessibilityAction>;
} | null>(null);

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

  // Apply CSS classes based on state
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all existing accessibility classes
    const removeClasses = [
      'accessibility-text-1', 'accessibility-text-2', 'accessibility-text-3', 'accessibility-text-4',
      'accessibility-line-height-1', 'accessibility-line-height-1.5', 'accessibility-line-height-1.75', 'accessibility-line-height-2',
      'accessibility-text-spacing-normal', 'accessibility-text-spacing-light', 'accessibility-text-spacing-moderate', 'accessibility-text-spacing-heavy',
      'accessibility-text-align-left', 'accessibility-text-align-center', 'accessibility-text-align-right', 'accessibility-text-align-justified',
      'accessibility-font-normal', 'accessibility-font-dyslexia', 'accessibility-font-legible',
      'accessibility-contrast-normal', 'accessibility-contrast-invert', 'accessibility-contrast-dark', 'accessibility-contrast-light',
      'accessibility-saturation-normal', 'accessibility-saturation-low', 'accessibility-saturation-heavy', 'accessibility-saturation-desaturate',
      'accessibility-highlight-links',
      'accessibility-hide-images',
      'accessibility-pause-animations',
      'accessibility-tooltips'
    ];
    
    root.classList.remove(...removeClasses);
    
    // Apply current state classes
    root.classList.add(`accessibility-text-${state.textSize}`);
    root.classList.add(`accessibility-line-height-${state.lineHeight}`);
    root.classList.add(`accessibility-text-spacing-${state.textSpacing}`);
    root.classList.add(`accessibility-text-align-${state.textAlign}`);
    root.classList.add(`accessibility-font-${state.fontType}`);
    root.classList.add(`accessibility-contrast-${state.contrast}`);
    root.classList.add(`accessibility-saturation-${state.saturation}`);
    
    if (state.highlightLinks) root.classList.add('accessibility-highlight-links');
    if (state.hideImages) root.classList.add('accessibility-hide-images');
    if (state.pauseAnimations) root.classList.add('accessibility-pause-animations');
    if (state.tooltips) root.classList.add('accessibility-tooltips');
    
    // Handle cursor effects
    if (state.cursor === 'reading-mask') {
      const handleMouseMove = (e: MouseEvent) => {
        root.style.setProperty('--mask-position-x', `${e.clientX}px`);
        root.style.setProperty('--mask-position-y', `${e.clientY}px`);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [state]);

  return (
    <AccessibilityContext.Provider value={{ state, dispatch }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}