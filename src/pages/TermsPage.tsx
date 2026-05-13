import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          {isHe ? 'תנאי שימוש' : 'Terms of Use'}
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          {isHe ? 'עודכן לאחרונה: ינואר 2025' : 'Last updated: January 2025'}
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'קבלת תנאים' : 'Acceptance of Terms'}
            </h2>
            <p>
              {isHe
                ? 'בשימוש באתר זה, אתה מסכים לתנאי השימוש המפורטים להלן. אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.'
                : 'By using this website, you agree to the terms of use detailed below. If you do not agree to these terms, please refrain from using the site.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'שימוש מותר' : 'Permitted Use'}
            </h2>
            <p>
              {isHe
                ? 'האתר מיועד לשימוש לגיטימי בלבד. אסור להשתמש באתר לצרכים בלתי חוקיים, להפריע לפעילותו, או לנסות לגשת למערכות ללא הרשאה.'
                : 'This site is intended for legitimate use only. You may not use the site for unlawful purposes, interfere with its operation, or attempt to access systems without authorization.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'קניין רוחני' : 'Intellectual Property'}
            </h2>
            <p>
              {isHe
                ? 'כל התוכן באתר זה, לרבות טקסטים, תמונות, לוגואים ועיצובים, הם רכושה של HWOOD ומוגנים בזכויות יוצרים. אין להעתיק, לפרסם מחדש או להפיץ ללא אישור מפורש.'
                : 'All content on this site, including texts, images, logos, and designs, are the property of HWOOD and protected by copyright. No copying, republishing, or distribution without explicit permission.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'הגבלת אחריות' : 'Limitation of Liability'}
            </h2>
            <p>
              {isHe
                ? 'HWOOD אינה אחראית לנזקים ישירים, עקיפים או תוצאתיים הנובעים משימוש באתר או מחוסר יכולת להשתמש בו.'
                : 'HWOOD is not liable for direct, indirect, or consequential damages arising from the use of or inability to use this site.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'שינויים בתנאים' : 'Changes to Terms'}
            </h2>
            <p>
              {isHe
                ? 'אנו שומרים לעצמנו את הזכות לשנות תנאים אלו בכל עת. שינויים ייכנסו לתוקף עם פרסומם באתר.'
                : 'We reserve the right to modify these terms at any time. Changes take effect upon publication on the site.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {isHe ? 'צור קשר' : 'Contact Us'}
            </h2>
            <p>
              {isHe
                ? 'לשאלות בנוגע לתנאי שימוש אלה, אנא '
                : 'For questions regarding these terms, please '}
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
