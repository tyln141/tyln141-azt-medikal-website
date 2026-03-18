"use client";

import { useAppContext } from '@/context/AppProvider';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useAppContext();

    const langs = [
        { code: 'tr', label: 'TR' },
        { code: 'en', label: 'EN' },
        { code: 'de', label: 'DE' },
        { code: 'fr', label: 'FR' },
    ];

    return (
        <div className="relative group">
            <div className="flex gap-1 p-1 bg-white/50 rounded-full border border-gray-100 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                {langs.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-full transition-colors ${language === lang.code
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-500 hover:text-dark hover:bg-gray-50'
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
