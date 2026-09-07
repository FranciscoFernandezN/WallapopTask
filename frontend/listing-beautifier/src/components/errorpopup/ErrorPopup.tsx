import { useTranslation } from 'react-i18next';
import './ErrorPopup.css';

/**
 * Props for the `ErrorPopup` component.
 *
 * @property message - Localized error message to display.
 * @property onClose - Callback invoked when the user dismisses the popup.
 */
interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

/**
 * Modal popup that displays a backend error message.
 *
 * Renders over a semi-transparent backdrop. Clicking the backdrop
 * or the close button dismisses the popup.
 *
 * @param props - Component props.
 */
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
