import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "tr" | "ru" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    appName: "Borsa AI",
    signIn: "Sign In",
    signOut: "Sign Out",
    upgradePlan: "Upgrade Plan",
    searchPlaceholder: "Search stocks (e.g., ASELS, Akbank)...",
    noStocksFound: "No stocks found.",
    turkishStocks: "Turkish Stocks (BIST)",
    heroTitle: "Your Friendly Turkish",
    heroSubtitle: "Market Companion",
    heroDescription: "Miem ai helps you explore Borsa İstanbul with clear, friendly insights. We don't just show data — we talk, learn, and evolve with you.",
    startExploring: "Start Exploring Stocks",
    learnHow: "Learn How It Works",
    liveMarketData: "Live Market Data",
    aiPowered: "AI-Powered Predictions",
    multiLanguage: "Multi-Language Support",
    livePredictions: "Live Predictions",
    todaysPredictions: "Today's Top Stock Predictions",
    aiAnalysis: "Our AI analyzes thousands of data points in real-time to help you make informed decisions",
    updatedRecently: "Updated 2 minutes ago",
    unlockFeatures: "Unlock Advanced Features",
    upgradeToUltimate: "Upgrade to Ultimate",
    viewPricing: "View Pricing Plans",
    features: "Features",
    everythingYouNeed: "Everything You Need to Succeed",
    powerfulTools: "Powerful AI tools designed to be friendly, educational, and empowering",
    howItWorks: "How It Works",
    poweredByAI: "Powered by Intelligence, Guided by Empathy",
    aiExplains: "Our AI doesn't just crunch numbers — it explains, educates, and encourages",
    readyToStart: "Ready to Start Your Journey?",
    joinThousands: "Join thousands of investors who trust Miem ai to navigate the Turkish market with confidence and clarity.",
    getStartedFree: "Get Started Free",
    viewDemo: "View Demo",
    footerTagline: "Miem ai — Making finance feel human 💖",
    footerDisclaimer: "Educational insights only. Not financial advice. Compliant with Turkish Capital Markets Board (SPK) regulations.",
  },
  tr: {
    appName: "Borsa AI",
    signIn: "Giriş Yap",
    signOut: "Çıkış Yap",
    upgradePlan: "Planı Yükselt",
    searchPlaceholder: "Hisse ara (örn. ASELS, Akbank)...",
    noStocksFound: "Hisse bulunamadı.",
    turkishStocks: "Türk Hisseleri (BIST)",
    heroTitle: "Dostunuz Türk",
    heroSubtitle: "Piyasa Arkadaşınız",
    heroDescription: "Miem ai, Borsa İstanbul'u net ve dostça içgörülerle keşfetmenize yardımcı olur. Sadece veri göstermiyoruz — konuşuyor, öğreniyor ve sizinle gelişiyoruz.",
    startExploring: "Hisseleri Keşfet",
    learnHow: "Nasıl Çalışır?",
    liveMarketData: "Canlı Piyasa Verileri",
    aiPowered: "Yapay Zeka Tahminleri",
    multiLanguage: "Çok Dilli Destek",
    livePredictions: "Canlı Tahminler",
    todaysPredictions: "Bugünün En İyi Hisse Tahminleri",
    aiAnalysis: "Yapay zekamız, bilinçli kararlar vermenize yardımcı olmak için binlerce veri noktasını gerçek zamanlı olarak analiz eder",
    updatedRecently: "2 dakika önce güncellendi",
    unlockFeatures: "Gelişmiş Özelliklerin Kilidini Aç",
    upgradeToUltimate: "Ultimate'e Yükselt",
    viewPricing: "Fiyatlandırma Planlarını Görüntüle",
    features: "Özellikler",
    everythingYouNeed: "Başarılı Olmak İçin İhtiyacınız Olan Her Şey",
    powerfulTools: "Dostça, eğitici ve güçlendirici olmak üzere tasarlanmış güçlü yapay zeka araçları",
    howItWorks: "Nasıl Çalışır",
    poweredByAI: "Zeka ile Güçlendirilmiş, Empati ile Yönlendirilmiş",
    aiExplains: "Yapay zekamız sadece sayıları işlemez — açıklar, eğitir ve cesaretlendirir",
    readyToStart: "Yolculuğunuza Başlamaya Hazır mısınız?",
    joinThousands: "Türk piyasasında güven ve netlikle gezinmek için Miem ai'ye güvenen binlerce yatırımcıya katılın.",
    getStartedFree: "Ücretsiz Başla",
    viewDemo: "Demo İzle",
    footerTagline: "Miem ai — Finansı insani kılıyor 💖",
    footerDisclaimer: "Sadece eğitici içgörüler. Mali tavsiye değildir. Türkiye Sermaye Piyasası Kurulu (SPK) düzenlemelerine uygundur.",
  },
  ru: {
    appName: "Borsa AI",
    signIn: "Войти",
    signOut: "Выйти",
    upgradePlan: "Улучшить план",
    searchPlaceholder: "Поиск акций (напр. ASELS, Akbank)...",
    noStocksFound: "Акции не найдены.",
    turkishStocks: "Турецкие акции (BIST)",
    heroTitle: "Ваш дружелюбный турецкий",
    heroSubtitle: "Рыночный помощник",
    heroDescription: "Miem ai помогает вам исследовать Borsa İstanbul с четкими и дружелюбными идеями. Мы не просто показываем данные — мы разговариваем, учимся и развиваемся вместе с вами.",
    startExploring: "Начать изучение акций",
    learnHow: "Как это работает",
    liveMarketData: "Данные в реальном времени",
    aiPowered: "ИИ-прогнозы",
    multiLanguage: "Многоязычная поддержка",
    livePredictions: "Прогнозы в реальном времени",
    todaysPredictions: "Лучшие прогнозы акций на сегодня",
    aiAnalysis: "Наш ИИ анализирует тысячи точек данных в реальном времени, чтобы помочь вам принимать обоснованные решения",
    updatedRecently: "Обновлено 2 минуты назад",
    unlockFeatures: "Разблокировать расширенные функции",
    upgradeToUltimate: "Перейти на Ultimate",
    viewPricing: "Посмотреть тарифные планы",
    features: "Возможности",
    everythingYouNeed: "Все, что вам нужно для успеха",
    powerfulTools: "Мощные инструменты ИИ, разработанные дружелюбными, образовательными и расширяющими возможности",
    howItWorks: "Как это работает",
    poweredByAI: "Работает на основе интеллекта, руководствуясь эмпатией",
    aiExplains: "Наш ИИ не просто обрабатывает цифры — он объясняет, обучает и поддерживает",
    readyToStart: "Готовы начать свое путешествие?",
    joinThousands: "Присоединяйтесь к тысячам инвесторов, которые доверяют Miem ai для навигации по турецкому рынку с уверенностью и ясностью.",
    getStartedFree: "Начать бесплатно",
    viewDemo: "Посмотреть демо",
    footerTagline: "Miem ai — Делаем финансы человечными 💖",
    footerDisclaimer: "Только образовательные материалы. Не является финансовым советом. Соответствует требованиям Совета по рынкам капитала Турции (SPK).",
  },
  de: {
    appName: "Borsa AI",
    signIn: "Anmelden",
    signOut: "Abmelden",
    upgradePlan: "Plan upgraden",
    searchPlaceholder: "Aktien suchen (z.B. ASELS, Akbank)...",
    noStocksFound: "Keine Aktien gefunden.",
    turkishStocks: "Türkische Aktien (BIST)",
    heroTitle: "Ihr freundlicher türkischer",
    heroSubtitle: "Marktbegleiter",
    heroDescription: "Miem ai hilft Ihnen, Borsa İstanbul mit klaren, freundlichen Einblicken zu erkunden. Wir zeigen nicht nur Daten — wir sprechen, lernen und entwickeln uns mit Ihnen.",
    startExploring: "Aktien erkunden",
    learnHow: "Wie es funktioniert",
    liveMarketData: "Live-Marktdaten",
    aiPowered: "KI-gestützte Vorhersagen",
    multiLanguage: "Mehrsprachige Unterstützung",
    livePredictions: "Live-Vorhersagen",
    todaysPredictions: "Die besten Aktienvorhersagen von heute",
    aiAnalysis: "Unsere KI analysiert Tausende von Datenpunkten in Echtzeit, um Ihnen fundierte Entscheidungen zu ermöglichen",
    updatedRecently: "Vor 2 Minuten aktualisiert",
    unlockFeatures: "Erweiterte Funktionen freischalten",
    upgradeToUltimate: "Auf Ultimate upgraden",
    viewPricing: "Preispläne ansehen",
    features: "Funktionen",
    everythingYouNeed: "Alles, was Sie zum Erfolg brauchen",
    powerfulTools: "Leistungsstarke KI-Tools, die freundlich, lehrreich und stärkend gestaltet sind",
    howItWorks: "Wie es funktioniert",
    poweredByAI: "Angetrieben von Intelligenz, geleitet von Empathie",
    aiExplains: "Unsere KI verarbeitet nicht nur Zahlen — sie erklärt, bildet und ermutigt",
    readyToStart: "Bereit, Ihre Reise zu beginnen?",
    joinThousands: "Schließen Sie sich Tausenden von Investoren an, die Miem ai vertrauen, um mit Vertrauen und Klarheit durch den türkischen Markt zu navigieren.",
    getStartedFree: "Kostenlos starten",
    viewDemo: "Demo ansehen",
    footerTagline: "Miem ai — Machen Finanzen menschlich 💖",
    footerDisclaimer: "Nur Bildungsinhalte. Keine Finanzberatung. Entspricht den Vorschriften des türkischen Kapitalmarktrates (SPK).",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
