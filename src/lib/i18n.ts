import tr from '../../locales/tr.json';
import en from '../../locales/en.json';
import de from '../../locales/de.json';
import fr from '../../locales/fr.json';

// We fall back to English for missing languages, as required
const fallback = en;

export const languages = ["tr", "en", "de", "fr"];
export const defaultLanguage = "tr";

export type Language = 'tr' | 'en' | 'de' | 'fr';

export const translations: Record<string, any> = {
    tr,
    en,
    de,
    fr
};

export const getValue = (field: any, lang: Language | string): string => {
    if (!field) return "";
    if (typeof field === "object" && field !== null) {
        return field[lang] || field["tr"] || field["en"] || Object.values(field)[0] || "";
    }
    return String(field);
};

export const getTranslation = (lang: Language) => {
    const dict = translations[lang] || translations.tr;

    // Return a function that accepts dot-notation paths e.g. "hero.title"
    return (key: string): string => {
        const keys = key.split('.');
        let result: any = dict;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; // return key if not found
            }
        }
        return typeof result === 'string' ? result : key;
    };
};
