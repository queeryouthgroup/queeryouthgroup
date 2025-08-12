"use client";

import React from 'react';
import { useAccessibility } from './AccessibilityContext';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Type, 
  Pause, 
  Play, 
  Image as ImageIcon, 
  ImageOff,
  MousePointer,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  HelpCircle,
  RotateCcw,
  Check,
  X,
  Settings
} from 'lucide-react';

export default function AccessibilityWidget() {
  const { state, dispatch } = useAccessibility();

  const toggleWidget = () => {
    dispatch({ type: 'TOGGLE_WIDGET' });
  };

  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' });
  };

  return (
    <>
      {/* Floating Button - Fixed and Sticky */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={toggleWidget}
          className={`
            relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110
            ${state.hasAccessibilityEnabled 
              ? 'bg-[#d41367] hover:bg-[#b8115a] shadow-[#d41367]/30' 
              : 'bg-[#d41367] hover:bg-[#b8115a] shadow-[#d41367]/30'
            }
            text-white flex items-center justify-center border-2 border-white
          `}
          aria-label="Open accessibility options"
          style={{ position: 'fixed' }}
        >
          <Accessibility size={26} />
          {state.hasAccessibilityEnabled && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <Check size={16} className="text-white font-bold" />
            </div>
          )}
        </button>
      </div>

      {/* Widget Panel - Fixed and Floating */}
      {state.isWidgetOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#d41367] to-[#b8115a] text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <Accessibility className="text-white" size={26} />
                <h2 className="text-xl font-bold">Accessibility Options</h2>
                {state.hasAccessibilityEnabled && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm backdrop-blur-sm">
                    <Check size={14} />
                    <span>Active</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  aria-label="Reset all accessibility settings"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm font-medium">Reset All</span>
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  aria-label="Close accessibility options"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Contrast */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Eye size={18} />
                  Contrast
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['normal', 'invert', 'dark', 'light'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => dispatch({ type: 'SET_CONTRAST', payload: option })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors capitalize
                        ${state.contrast === option 
                          ? 'bg-[#d41367] text-white border-[#d41367]' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-[#d41367]'
                        }
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Type size={18} />
                  Text Size
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => dispatch({ type: 'SET_TEXT_SIZE', payload: size })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors
                        ${state.textSize === size 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {size}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Spacing */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Type size={18} />
                  Text Spacing
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['normal', 'light', 'moderate', 'heavy'] as const).map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => dispatch({ type: 'SET_TEXT_SPACING', payload: spacing })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors capitalize
                        ${state.textSpacing === spacing 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlignLeft size={18} />
                  Line Height
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 1.5, 1.75, 2] as const).map((height) => (
                    <button
                      key={height}
                      onClick={() => dispatch({ type: 'SET_LINE_HEIGHT', payload: height })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors
                        ${state.lineHeight === height 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {height}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlignLeft size={18} />
                  Text Align
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'left' as const, icon: AlignLeft },
                    { value: 'center' as const, icon: AlignCenter },
                    { value: 'right' as const, icon: AlignRight },
                    { value: 'justified' as const, icon: AlignJustify }
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => dispatch({ type: 'SET_TEXT_ALIGN', payload: value })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors flex items-center justify-center
                        ${state.textAlign === value 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Type */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Type size={18} />
                  Font Type
                </h3>
                <div className="space-y-2">
                  {(['normal', 'dyslexia', 'legible'] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => dispatch({ type: 'SET_FONT_TYPE', payload: font })}
                      className={`
                        w-full p-2 text-sm rounded-lg border transition-colors capitalize text-left
                        ${state.fontType === font 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {font === 'dyslexia' ? 'Dyslexia Friendly' : font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cursor */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MousePointer size={18} />
                  Cursor
                </h3>
                <div className="space-y-2">
                  {(['normal', 'big', 'reading-guide', 'reading-mask'] as const).map((cursor) => (
                    <button
                      key={cursor}
                      onClick={() => dispatch({ type: 'SET_CURSOR', payload: cursor })}
                      className={`
                        w-full p-2 text-sm rounded-lg border transition-colors capitalize text-left
                        ${state.cursor === cursor 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {cursor.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saturation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Palette size={18} />
                  Saturation
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['normal', 'low', 'heavy', 'desaturate'] as const).map((saturation) => (
                    <button
                      key={saturation}
                      onClick={() => dispatch({ type: 'SET_SATURATION', payload: saturation })}
                      className={`
                        p-2 text-sm rounded-lg border transition-colors capitalize
                        ${state.saturation === saturation 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      {saturation}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Settings size={18} />
                  Options
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_HIGHLIGHT_LINKS' })}
                    className={`
                      w-full p-3 rounded-lg border transition-colors flex items-center justify-between
                      ${state.highlightLinks 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>Highlight Links</span>
                    {state.highlightLinks && <Check size={16} />}
                  </button>
                  
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_PAUSE_ANIMATIONS' })}
                    className={`
                      w-full p-3 rounded-lg border transition-colors flex items-center justify-between
                      ${state.pauseAnimations 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>Pause Animations</span>
                    {state.pauseAnimations ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_HIDE_IMAGES' })}
                    className={`
                      w-full p-3 rounded-lg border transition-colors flex items-center justify-between
                      ${state.hideImages 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>Hide Images</span>
                    {state.hideImages ? <ImageOff size={16} /> : <ImageIcon size={16} />}
                  </button>
                  
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_TOOLTIPS' })}
                    className={`
                      w-full p-3 rounded-lg border transition-colors flex items-center justify-between
                      ${state.tooltips 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>Show Tooltips</span>
                    {state.tooltips && <HelpCircle size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}