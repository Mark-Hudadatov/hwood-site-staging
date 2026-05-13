import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          {isHe ? 'מדיניות פרטיות' : 'Privacy Policy'}
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          {isHe ? 'עודכן לאחרונה: ינואר 2025' : 'Last updated: January 2025'}
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'מידע שאנו אוספים' : 'Information We Collect'}
            </h2>
            <p>
              {isHe
                ? 'אנו אוספים מידע שאתה מספק לנו ישירות, כגון שם, כתובת אימייל, מספר טלפון ופרטי הפרויקט שלך, כאשר אתה יוצר קשר איתנו או מגיש בקשה להצעת מחיר.'
                : 'We collect information you provide directly to us, such as your name, email address, phone number, and project details, when you contact us or submit a quote request.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'כיצד אנו משתמשים במידע' : 'How We Use Your Information'}
            </h2>
            <p>
              {isHe
                ? 'המידע שנאסף משמש לצורך מתן מענה לפניות, עיבוד הצעות מחיר, שיפור השירות שלנו ויצירת קשר בנוגע לפרויקטים שלך.'
                : 'Information collected is used to respond to inquiries, process quote requests, improve our services, and communicate with you about your projects.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'אבטחת מידע' : 'Data Security'}
            </h2>
            <p>
              {isHe
                ? 'אנו נוקטים באמצעים טכניים וארגוניים סבירים להגנה על המידע שלך מפני גישה בלתי מורשית, אובדן או חשיפה.'
                : 'We implement reasonable technical and organizational measures to protect your information against unauthorized access, loss, or disclosure.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'שיתוף מידע עם צדדים שלישיים' : 'Third-Party Sharing'}
            </h2>
            <p>
              {isHe
                ? 'אנו לא מוכרים או מעבירים את המידע האישי שלך לצדדים שלישיים ללא הסכמתך, למעט כנדרש על פי דין.'
                : 'We do not sell or transfer your personal information to third parties without your consent, except as required by law.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'צור קשר' : 'Contact Us'}
            </h2>
            <p>
              {isHe
                ? 'לשאלות בנוגע למדיניות פרטיות זו, אנא '
                : 'For questions regarding this privacy policy, please '}
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
