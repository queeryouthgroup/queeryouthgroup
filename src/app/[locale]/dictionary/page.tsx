'use client'

import { useState, useEffect } from 'react'
import { roboto, notoSansDevanagari } from '@/ui/fonts'
import { fetchDictionaryData } from '@/utils/fetch-json'

// Define the type for your dictionary entry
interface DictionaryEntry {
  id?: number
  english: string
  nepali: string
  definition_en: string
  definition_ne: string
  etymology_en?: string | null
  etymology_ne?: string | null
  explanation_en?: string | null
  explanation_ne?: string | null
}

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<'en' | 'ne'>('en')
  const [searchMode, setSearchMode] = useState<'prefix' | 'full'>('prefix')
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>('')

  // English alphabets
  const englishAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  
  // Nepali alphabets - vowels and consonants
  const nepaliVowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः']
  const nepaliConsonants = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'
  ]

  // Real-time filtering function
  const filterEntries = (term: string, alphabetFilter?: string) => {
    let filtered = entries

    // Apply alphabet filter first if selected
    if (alphabetFilter) {
      if (language === 'en') {
        filtered = entries.filter(entry =>
          entry.english.toLowerCase().startsWith(alphabetFilter.toLowerCase())
        )
      } else {
        filtered = entries.filter(entry =>
          entry.nepali.startsWith(alphabetFilter)
        )
      }
    }

    // Then apply search term filter if exists
    if (term.trim()) {
      const searchTerm = term.toLowerCase()
      
      if (searchMode === 'prefix') {
        // Prefix matching - matches words that START with the typed letters
        filtered = filtered.filter(entry =>
          entry.english.toLowerCase().startsWith(searchTerm) ||
          entry.nepali.toLowerCase().startsWith(searchTerm)
        )
      } else {
        // Full text search - matches anywhere in the content
        filtered = filtered.filter(entry =>
          entry.english.toLowerCase().includes(searchTerm) ||
          entry.nepali.includes(term) ||
          entry.definition_en.toLowerCase().includes(searchTerm) ||
          entry.definition_ne.includes(term) ||
          (entry.etymology_en && entry.etymology_en.toLowerCase().includes(searchTerm)) ||
          (entry.etymology_ne && entry.etymology_ne.includes(term)) ||
          (entry.explanation_en && entry.explanation_en.toLowerCase().includes(searchTerm)) ||
          (entry.explanation_ne && entry.explanation_ne.includes(term))
        )
      }
    }

    setFilteredEntries(filtered)
  }

  // Handle search input change with real-time filtering
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterEntries(value, selectedAlphabet)
  }

  // Handle alphabet click
  const handleAlphabetClick = (alphabet: string) => {
    if (selectedAlphabet === alphabet) {
      // If clicking the same alphabet, clear the filter
      setSelectedAlphabet('')
      filterEntries(searchTerm, '')
    } else {
      setSelectedAlphabet(alphabet)
      filterEntries(searchTerm, alphabet)
    }
  }

  // Handle Enter key press for explicit search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      filterEntries(searchTerm, selectedAlphabet)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setSelectedAlphabet('')
    setFilteredEntries(entries)
  }

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en')
    // Clear alphabet filter when switching languages
    setSelectedAlphabet('')
    filterEntries(searchTerm, '')
  }

  // Toggle search mode
  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'prefix' ? 'full' : 'prefix')
    // Re-filter with current search term using new mode
    if (searchTerm || selectedAlphabet) {
      filterEntries(searchTerm, selectedAlphabet)
    }
  }

  // Fetch dictionary entries from local JSON file
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true)
        console.log('Loading dictionary data from JSON...')
        
        const result = await fetchDictionaryData()

        console.log('Data loaded:', result)

        if (result.error) {
          throw new Error(result.error)
        }

        setEntries(result.data || [])
        setFilteredEntries(result.data || [])
        console.log('Entries loaded:', result.data?.length)
      } catch (err) {
        console.error('Load error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, []) // Empty dependency array - only run on mount

  // Re-filter when language changes
  useEffect(() => {
    if (searchTerm || selectedAlphabet) {
      filterEntries(searchTerm, selectedAlphabet)
    }
  }, [language, searchMode])

  // Separate function for retry button
  const retryLoad = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Retrying to load dictionary data...')
      
      const result = await fetchDictionaryData()

      console.log('Data loaded:', result)

      if (result.error) {
        throw new Error(result.error)
      }

      setEntries(result.data || [])
      setFilteredEntries(result.data || [])
      console.log('Entries loaded:', result.data?.length)
    } catch (err) {
      console.error('Load error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${roboto.className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 text-gray-600 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
            {language === 'en' ? 'Loading dictionary...' : 'शब्दकोश लोड हुँदैछ...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${roboto.className}`}>
        <div className="text-center">
          <div className={`text-red-500 text-xl mb-4 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
            {language === 'en' ? 'Error loading dictionary' : 'शब्दकोश लोड गर्न त्रुटि'}
          </div>
          <p className={`text-gray-600 mb-4 ${roboto.className}`}>{error}</p>
          <button
            onClick={retryLoad}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
          >
            {language === 'en' ? 'Try Again' : 'पुन: प्रयास'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${roboto.className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className={`text-4xl font-bold text-gray-900 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
              {language === 'en' ? 'SOGIESC Dictionary' : 'SOGIESC शब्दकोश'}
            </h1>
            <button
              onClick={toggleLanguage}
              className={`bg-[#d41367] text-white px-4 py-2 rounded-lg hover:bg-[#d41367]/50 transition-colors text-sm font-medium ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
            >
              {language === 'en' ? 'नेपाली' : 'English'}
            </button>
          </div>
          <p className={`text-gray-600 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
            {language === 'en' 
              ? `Search through ${entries.length} entries` 
              : `${entries.length} शब्दहरू खोज्नुहोस्`
            }
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={toggleSearchMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchMode === 'prefix'
                    ? 'bg-[#d41367] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                } ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
              >
                {language === 'en' ? 'Starts With' : 'सुरु हुन्छ'}
              </button>
              <button
                onClick={toggleSearchMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchMode === 'full'
                    ? 'bg-[#d41367] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                } ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
              >
                {language === 'en' ? 'Full Search' : 'पूर्ण खोज'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={
                  searchMode === 'prefix'
                    ? (language === 'en' 
                        ? "Type letters to find words starting with..." 
                        : "अक्षरहरू टाइप गर्नुहोस्...")
                    : (language === 'en' 
                        ? "Search for words, definitions, etymology..." 
                        : "शब्द, परिभाषा, व्युत्पत्ति खोज्नुहोस्...")
                }
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d41367] focus:border-[#d41367] outline-none text-black ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
              />
            </div>
            <div className="flex gap-2">
              {(searchTerm || selectedAlphabet) && (
                <button
                  onClick={clearSearch}
                  className={`bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}
                >
                  {language === 'en' ? 'Clear' : 'मेटाउनुहोस्'}
                </button>
              )}
            </div>
          </div>

          {/* Alphabet Filters */}
          <div className="mt-6">
            <h3 className={`text-sm font-semibold text-gray-700 mb-3 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
              {language === 'en' ? 'Filter by Alphabet:' : 'अक्षरअनुसार छान्नुहोस्:'}
            </h3>
            
            {language === 'en' ? (
              // English Alphabets
              <div className="flex flex-wrap gap-1">
                {englishAlphabets.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleAlphabetClick(letter)}
                    className={`w-8 h-8 rounded-md text-sm font-semibold transition-colors ${
                      selectedAlphabet === letter
                        ? 'bg-[#d41367] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${roboto.className}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ) : (
              // Nepali Alphabets
              <div className="space-y-4">
                {/* Vowels */}
                <div>
                  <h4 className={`text-xs font-medium text-gray-600 mb-2 ${notoSansDevanagari.className}`}>
                    स्वरहरू (Vowels):
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {nepaliVowels.map((letter) => (
                      <button
                        key={letter}
                        onClick={() => handleAlphabetClick(letter)}
                        className={`min-w-8 h-8 px-2 rounded-md text-sm font-semibold transition-colors ${
                          selectedAlphabet === letter
                            ? 'bg-[#d41367] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${notoSansDevanagari.className}`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Consonants */}
                <div>
                  <h4 className={`text-xs font-medium text-gray-600 mb-2 ${notoSansDevanagari.className}`}>
                    व्यञ्जनहरू (Consonants):
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {nepaliConsonants.map((letter) => (
                      <button
                        key={letter}
                        onClick={() => handleAlphabetClick(letter)}
                        className={`min-w-8 h-8 px-2 rounded-md text-sm font-semibold transition-colors ${
                          selectedAlphabet === letter
                            ? 'bg-[#d41367] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${notoSansDevanagari.className}`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {(searchTerm || selectedAlphabet) && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-wrap gap-4">
                <p className={`text-sm text-gray-600 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                  {language === 'en' 
                    ? `Found ${filteredEntries.length} result${filteredEntries.length !== 1 ? 's' : ''}`
                    : `${filteredEntries.length} परिणाम फेला पर्यो`
                  }
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedAlphabet && (
                    <span>
                      {searchTerm ? ' and ' : ' '}
                      {language === 'en' ? `starting with "${selectedAlphabet}"` : `"${selectedAlphabet}" ले सुरु हुने`}
                    </span>
                  )}
                </p>
              </div>
              <p className={`text-xs text-gray-500 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                {searchMode === 'prefix' 
                  ? (language === 'en' ? 'Showing words starting with these letters' : 'यी अक्षरहरूले सुरु हुने शब्दहरू देखाउँदै')
                  : (language === 'en' ? 'Searching all content' : 'सबै सामग्री खोजिँदै')
                }
              </p>
            </div>
          )}
        </div>

        {/* Dictionary Entries */}
        <div className="space-y-6">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className={`text-gray-500 text-lg ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                {searchTerm || selectedAlphabet
                  ? (searchMode === 'prefix'
                      ? (language === 'en' ? 'No words found with the current filters' : 'हालको फिल्टरसँग कुनै शब्द फेला परेन')
                      : (language === 'en' ? 'No entries found matching your search.' : 'खोजसँग मिल्दो कुनै शब्द फेला परेन।')
                    )
                  : (language === 'en' ? 'No entries available.' : 'कुनै शब्द उपलब्ध छैन।')
                }
              </p>
              {(searchTerm || selectedAlphabet) && searchMode === 'prefix' && (
                <p className={`text-sm text-gray-400 mt-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                  {language === 'en' 
                    ? 'Try switching to "Full Search" for broader results' 
                    : '"पूर्ण खोज" मा स्विच गरेर व्यापक परिणामहरू प्राप्त गर्नुहोस्'
                  }
                </p>
              )}
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <div key={entry.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Word Header */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className={`text-3xl font-bold text-gray-900 mb-1 ${roboto.className}`}>
                        {entry.english}
                      </h2>
                      <h3 className={`text-2xl font-semibold text-indigo-700 ${notoSansDevanagari.className}`}>
                        {entry.nepali}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Definitions */}
                <div className="space-y-4">
                  {((entry.definition_en && entry.definition_en.trim()) || (entry.definition_ne && entry.definition_ne.trim())) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* English Definition */}
                      {entry.definition_en && entry.definition_en.trim() && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-blue-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Definition (English)' : 'परिभाषा (अङ्ग्रेजी)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed ${roboto.className}`}>
                            {entry.definition_en}
                          </p>
                        </div>
                      )}

                      {/* Nepali Definition */}
                      {entry.definition_ne && entry.definition_ne.trim() && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-green-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Definition (Nepali)' : 'परिभाषा (नेपाली)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed ${notoSansDevanagari.className}`}>
                            {entry.definition_ne}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Etymology */}
                  {((entry.etymology_en && entry.etymology_en.trim()) || (entry.etymology_ne && entry.etymology_ne.trim())) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {entry.etymology_en && entry.etymology_en.trim() && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-purple-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Etymology (English)' : 'व्युत्पत्ति (अङ्ग्रेजी)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed text-sm ${roboto.className}`}>
                            {entry.etymology_en}
                          </p>
                        </div>
                      )}

                      {entry.etymology_ne && entry.etymology_ne.trim() && (
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-orange-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Etymology (Nepali)' : 'व्युत्पत्ति (नेपाली)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed text-sm ${notoSansDevanagari.className}`}>
                            {entry.etymology_ne}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  {((entry.explanation_en && entry.explanation_en.trim()) || (entry.explanation_ne && entry.explanation_ne.trim())) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {entry.explanation_en && entry.explanation_en.trim() && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-gray-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Explanation (English)' : 'व्याख्या (अङ्ग्रेजी)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed text-sm ${roboto.className}`}>
                            {entry.explanation_en}
                          </p>
                        </div>
                      )}

                      {entry.explanation_ne && entry.explanation_ne.trim() && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className={`font-semibold text-yellow-900 mb-2 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
                            {language === 'en' ? 'Explanation (Nepali)' : 'व्याख्या (नेपाली)'}
                          </h4>
                          <p className={`text-gray-700 leading-relaxed text-sm ${notoSansDevanagari.className}`}>
                            {entry.explanation_ne}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredEntries.length > 0 && (
          <div className="text-center mt-8">
            <p className={`text-gray-600 ${language === 'ne' ? notoSansDevanagari.className : roboto.className}`}>
              {language === 'en' 
                ? `Showing ${filteredEntries.length} of ${entries.length} entries`
                : `${entries.length} मध्ये ${filteredEntries.length} शब्द देखाइँदै`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}