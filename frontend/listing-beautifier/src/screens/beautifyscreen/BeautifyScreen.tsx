import { useState } from 'react';
import { sendBeautifySellerDetails } from '../../utils/api.ts';
import type { BeautifySellerDetailsResponse } from '../../../../../shared/types/beautify.ts';
import { LoadingOverlay } from '../../components/loadingoverlay/LoadingOverlay.tsx';
import './BeautifyScreen.css';

export function BeautifyScreen() {
  const [sellerDetails, setSellerDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BeautifySellerDetailsResponse | null>(null);

  const getMissingInfoHints = (text: string): string[] => {
    const hints: string[] = [];
    const trimmed = text.trim();

    if (trimmed.length === 0) return hints;

    const hasCurrency = /[€$£¥₹]|eur|usd|gbp|dollars?|euros?|pounds?|yens?/i.test(trimmed);
    const hasNumber = /\d/.test(trimmed);
    if (!hasCurrency && !hasNumber) {
      hints.push('Tell us how much did it cost or how much you want for it');
    }

    if (trimmed.length < 20) {
      hints.push('Try to explain a bit more about the product (does it have any special features, is it new or used, etc.)');
    }

    const commaCount = (trimmed.match(/,/g) || []).length;
    if (commaCount < 2) {
      hints.push('You can add details separated by commas (e.g. condition, size, brand)');
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
        <h1 className="title">Listing Beautifier</h1>
        
        <div className="input-section">
          <input
            type="text"
            value={sellerDetails}
            onChange={(e) => setSellerDetails(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter product description..."
            disabled={loading}
            className="input-field"
          />
          <div className="button-wrapper">
            <button 
              onClick={handleSubmit} 
              disabled={loading || !sellerDetails.trim()}
              className="submit-button"
            >
              {loading ? 'Processing...' : 'Beautify'}
            </button>
            {!loading && sellerDetails.trim() && getMissingInfoHints(sellerDetails).length > 0 && (
              <div className="tooltip">
                <span className="tooltip-text">We suggest you include this before submitting:</span>
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
            <h2 className="result-title">Result</h2>
            
            <div className="result-card">
              <div className="result-item">
                <span className="result-label">Title</span>
                <p className="result-value title-value">{result.title}</p>
              </div>

              <div className="result-item">
                <span className="result-label">Tags</span>
                <div className="tags-container">
                  {result.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Price Range</span>
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
