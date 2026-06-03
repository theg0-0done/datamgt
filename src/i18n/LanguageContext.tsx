import React, { createContext, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { translations } from "./translations";

export type Language = "fr" | "en";

interface LanguageContextProps {
  lang: Language;
  t: (key: string, replacements?: Record<string, string>) => string;
  changeLanguage: (newLang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { lang: urlLang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const lang: Language = (urlLang === "en" ? "en" : "fr") as Language;

  // Sync HTML document lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, replacements?: Record<string, string>): string => {
    const keys = key.split(".");
    let translation: any = translations[lang];

    // Traverse the keys in the active language translation dictionary
    for (const k of keys) {
      if (translation && typeof translation === "object") {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }

    // Fallback to French if the translation is not found in the selected language (e.g. English)
    if (translation === undefined && lang !== "fr") {
      let fallbackTranslation: any = translations["fr"];
      for (const k of keys) {
        if (fallbackTranslation && typeof fallbackTranslation === "object") {
          fallbackTranslation = fallbackTranslation[k];
        } else {
          fallbackTranslation = undefined;
          break;
        }
      }
      translation = fallbackTranslation;
    }

    // If still not found, return the key or the last element of the dot path
    if (translation === undefined) {
      return keys[keys.length - 1] || key;
    }

    let text = String(translation);

    // Apply simple replacements if provided, e.g. {count: "5"}
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), v);
      });
    }

    return text;
  };

  const changeLanguage = (newLang: Language) => {
    if (newLang === lang) return;
    
    const segments = location.pathname.split("/");
    // segments[0] is ""
    // segments[1] is either "fr" or "en" based on routing setup
    if (segments[1] === "fr" || segments[1] === "en") {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    
    const newPath = segments.join("/") + location.search + location.hash;
    navigate(newPath);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
