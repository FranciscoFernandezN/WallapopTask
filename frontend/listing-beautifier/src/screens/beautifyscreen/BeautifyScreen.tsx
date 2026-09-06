import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendBeautifySellerDetails } from '../../utils/api.ts';
import type { BeautifySellerDetailsResponse } from '../../../../../shared/types/beautify.ts';
import { LoadingOverlay } from '../../components/loadingoverlay/LoadingOverlay.tsx';
import './BeautifyScreen.css';

export function BeautifyScreen() {
  const { t } = useTranslation();
  const [sellerDetails, setSellerDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BeautifySellerDetailsResponse | null>(null);

  const getMissingInfoHints = (text: string): string[] => {
    const hints: string[] = [];
    const trimmed = text.trim();

    if (trimmed.length === 0) return hints;

    const hasCurrency = /[€$£¥₹]|eur|usd|gbp|dollars?|euros?|pounds?|yens?/i.test(trimmed);
    const hasNumber = /\d/.test(trimmed);
    if (!hasCurrency || !hasNumber) {
      hints.push(t('beautify.hints.missingPrice'));
    }

    if (trimmed.length < 20) {
      hints.push(t('beautify.hints.tooShort'));
    }

    const commaCount = (trimmed.match(/,/g) || []).length;
    if (commaCount < 2) {
      hints.push(t('beautify.hints.notEnoughDetails'));
    }

    return hints;
  };

  const handleSubmit = async () => {
    if (!sellerDetails.trim()) return;

    setLoading(true);
    try {
      const response = await sendBeautifySellerDetails({ sellerDetails });
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beautify-screen">
      {loading && <LoadingOverlay />}
      <div className="container">
        <h1 className="title">{t('beautify.title')}</h1>
        
        <div className="input-section">
          <input
            type="text"
            value={sellerDetails}
            onChange={(e) => setSellerDetails(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('beautify.placeholder')}
            disabled={loading}
            className="input-field"
          />
          <div className="button-wrapper">
            <button 
              onClick={handleSubmit} 
              disabled={loading || !sellerDetails.trim()}
              className="submit-button"
            >
              {loading ? t('beautify.button.loading') : t('beautify.button.default')}
            </button>
            {!loading && sellerDetails.trim() && getMissingInfoHints(sellerDetails).length > 0 && (
              <div className="tooltip">
                <span className="tooltip-text">{t('beautify.hints.suggestion')}</span>
                <ul>
                  {getMissingInfoHints(sellerDetails).map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="result-section">
            <h2 className="result-title">{t('beautify.result.title')}</h2>
            
            <div className="result-card">
              <div className="result-item">
                <span className="result-label">{t('beautify.result.titleLabel')}</span>
                <p className="result-value title-value">{result.title}</p>
              </div>

              <div className="result-item">
                <span className="result-label">{t('beautify.result.tagsLabel')}</span>
                <div className="tags-container">
                  {result.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">{t('beautify.result.priceRangeLabel')}</span>
                <p className="result-value price-value">
                  {result.priceRange[0]}€ - {result.priceRange[1]}€
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
