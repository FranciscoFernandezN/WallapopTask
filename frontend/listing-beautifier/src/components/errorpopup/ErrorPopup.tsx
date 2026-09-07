import { useTranslation } from 'react-i18next';
import './ErrorPopup.css';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

export function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  const { t } = useTranslation();

  return (
    <div className="error-popup-overlay" onClick={onClose}>
      <div className="error-popup" onClick={(e) => e.stopPropagation()}>
        <p className="error-popup-message">{message}</p>
        <button className="error-popup-close" onClick={onClose}>
          {t('errors.close')}
        </button>
      </div>
    </div>
  );
}
