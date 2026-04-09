// @/component/PublicationPage/index.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { alegreyaSans } from "@/ui/fonts";

interface Book {
  id: string;
  title: string;
  coverImage?: string;
  webUrl: string;
  lastModified: string;
  size: number;
}

interface PublicationPageProps {
  category: 'publications' | 'academic' | 'legal' | 'reports';
  title: string;
}

export default function PublicationPage({ category, title }: PublicationPageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const locale = useLocale();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await fetch(`/api/onedrive?category=${category}`);
        
        if (!response.ok) throw new Error('Fetch failed');
        
        const data = await response.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error("OneDrive fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  // Loading State
  if (loading) {
    return (
      <div className="w-full flex flex-col flex-grow bg-[#fafafc] items-center justify-center min-h-[60vh]">
        <div className={`${alegreyaSans.className} text-xl animate-pulse text-gray-400`}>
            Loading {title}...
        </div>
      </div>
    );
  }

  // Error or Empty State (Dotted Border Design)
  if (hasError || books.length === 0) {
    return (
      <div className="w-full flex flex-col flex-grow bg-[#fafafc] pb-24">
        <div className="flex flex-col items-center mt-4 px-4 md:px-16">
            <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl text-center`}>
                {title}
            </h1>
            
            {/* Restored Dotted/Dashed Container */}
            <div className="w-full max-w-4xl flex flex-col items-center justify-center py-20 mt-8 border-2 border-dashed border-gray-300 rounded-xl text-center px-6">
                <p className={`${alegreyaSans.className} text-gray-600 font-medium text-xl`}>
                    {locale === 'ne' 
                        ? "कागजात अपलोड हुन केही समय लाग्छ, धैर्य राख्नुहोस्" 
                        : "Documents yet to be uploaded, stay tuned"}
                </p>
            </div>
        </div>
      </div>
    );
  }

  // Success State (Grid View)
  return (
    <div className="w-full flex flex-col flex-grow bg-[#fafafc] pb-24">
        {/* Center-aligned Header */}
        <div className="flex flex-col items-center mt-4 px-4 w-full mb-12">
            <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl text-center`}>
                {title}
            </h1>
        </div>
      
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {books.map((book) => (
                    <a 
                        key={book.id}
                        href={book.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className="aspect-[3/4] bg-gray-200 relative">
                            {book.coverImage ? (
                                <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">📄 No Preview</div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {book.title}
                            </h3>
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>{new Date(book.lastModified).toLocaleDateString(locale === 'ne' ? 'ne-NP' : 'en-US')}</span>
                                <span>{(book.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </div>
  );
}