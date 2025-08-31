/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
// The translation files are now standard JavaScript modules.
// Importing .js files is universally supported and avoids MIME type errors.
import vi from '../../locales/vi.js';
import en from '../../locales/en.js';

export type Language = 'vi' | 'en';
// Since the module's default export is the object, `typeof vi` correctly infers the type.
type Translations = typeof vi;

const translations: Record<Language, Translations> = { vi, en };

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof Translations, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('vi');

    const t = useCallback((key: keyof Translations, replacements?: Record<string, string | number>): string => {
        let translation = translations[language][key] || key;
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }
        return translation;
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};