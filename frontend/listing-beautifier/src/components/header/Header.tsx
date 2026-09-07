import { useTranslation } from 'react-i18next';
import './Header.css';

/**
 * Sticky header displaying the Wallapop logo and the project title.
 */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-content">
        <img 
          src="https://cdn.brandfetch.io/id-yPnx1K7/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1754904261158" 
          alt={t('header.logoAlt')} 
          className="header-logo"
        />
        <span className="header-text">{t('header.title')}</span>
      </div>
    </header>
  );
}
