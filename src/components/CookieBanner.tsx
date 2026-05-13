import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'hwood_cookies_accepted';

export const CookieBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 max-w-sm w-[calc(100vw-3rem)] bg-[#111] text-white rounded-2xl shadow-2xl p-5 animate-fade-in-up"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <p className="text-sm text-white/70 leading-relaxed mb-4">
        {isHe
          ? 'אנו משתמשים בעוגיות לשיפור חוויית הגלישה שלך. '
          : 'We use cookies to improve your browsing experience. '}
        <Link to="/cookies" className="text-[#00d4aa] hover:underline">
          {isHe ? 'מדיניות עוגיות' : 'Cookie Policy'}
        </Link>
      </p>
      <button
        onClick={accept}
        className="w-full bg-[#005f5f] hover:bg-[#004d4d] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
      >
        {isHe ? 'קבל והמשך' : 'Accept & continue'}
      </button>
    </div>
  );
};
