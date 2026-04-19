import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedSelect from './UI/AnimatedSelect';
import { Languages } from 'lucide-react';

const LanguageSelector = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'hi', label: 'हिन्दी' }
  ];

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={className}>
      <AnimatedSelect
        options={languages}
        value={i18n.language}
        onChange={handleLanguageChange}
        placeholder="Language"
        icon={Languages}
      />
    </div>
  );
};

export default LanguageSelector;
