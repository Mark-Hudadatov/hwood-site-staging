import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');

  return (
    <div className="min-h-screen bg-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#005f5f] hover:underline mb-10">
          <ArrowLeft className="w-4 h-4" />
          {isHe ? 'חזרה לדף הבית' : 'Back to home'}
        </Link>

        <p className="eyebrow text-[#005f5f] mb-4">{isHe ? 'משפטי' : 'Legal'}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {isHe ? 'מדיניות עוגיות' : 'Cookie Policy'}
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          {isHe ? 'עודכן לאחרונה: ינואר 2025' : 'Last updated: January 2025'}
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'מה הן עוגיות?' : 'What Are Cookies?'}
            </h2>
            <p>
              {isHe
                ? 'עוגיות הן קבצי טקסט קטנים המאוחסנים במכשירך כאשר אתה מבקר באתר. הן מסייעות לאתר לזכור את העדפותיך ולשפר את חוויית הגלישה שלך.'
                : 'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your browsing experience.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'כיצד אנו משתמשים בעוגיות' : 'How We Use Cookies'}
            </h2>
            <p>
              {isHe
                ? 'אנו משתמשים בעוגיות לצורך:'
                : 'We use cookies for the following purposes:'}
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>{isHe ? 'שמירת העדפת שפה' : 'Saving language preference'}</li>
              <li>{isHe ? 'שיפור ביצועי האתר' : 'Improving site performance'}</li>
              <li>{isHe ? 'ניתוח תעבורת האתר (אנונימי)' : 'Analyzing site traffic (anonymous)'}</li>
              <li>{isHe ? 'זכירת הסכמת עוגיות' : 'Remembering cookie consent'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'סוגי עוגיות' : 'Types of Cookies'}
            </h2>
            <p>
              <strong>{isHe ? 'עוגיות הכרחיות:' : 'Essential cookies:'}</strong>{' '}
              {isHe
                ? 'נדרשות לתפקוד הבסיסי של האתר ואינן ניתנות לביטול.'
                : 'Required for basic site functionality and cannot be disabled.'}
            </p>
            <p className="mt-3">
              <strong>{isHe ? 'עוגיות ניתוח:' : 'Analytics cookies:'}</strong>{' '}
              {isHe
                ? 'עוזרות לנו להבין כיצד המבקרים משתמשים באתר, כדי שנוכל לשפרו.'
                : 'Help us understand how visitors use the site so we can improve it.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'ניהול עוגיות' : 'Managing Cookies'}
            </h2>
            <p>
              {isHe
                ? 'ניתן לשלוט בעוגיות דרך הגדרות הדפדפן שלך. שים לב כי חסימת עוגיות מסוימות עשויה להשפיע על פונקציונליות האתר.'
                : 'You can control cookies through your browser settings. Note that blocking certain cookies may affect site functionality.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'צור קשר' : 'Contact Us'}
            </h2>
            <p>
              {isHe
                ? 'לשאלות בנוגע למדיניות עוגיות זו, אנא '
                : 'For questions regarding this cookie policy, please '}
              <Link to="/contact" className="text-[#005f5f] hover:underline">
                {isHe ? 'צור איתנו קשר' : 'contact us'}
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
