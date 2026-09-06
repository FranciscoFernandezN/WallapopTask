import { useState } from 'react';
import { sendBeautifySellerDetails } from '../../utils/api.ts';
import type { BeautifySellerDetailsResponse } from '../../../../../shared/types/beautify.ts';
import { LoadingOverlay } from '../../components/loadingoverlay/LoadingOverlay.tsx';
import './BeautifyScreen.css';

export function BeautifyScreen() {
  const [sellerDetails, setSellerDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BeautifySellerDetailsResponse | null>(null);

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
          <button 
            onClick={handleSubmit} 
            disabled={loading || !sellerDetails.trim()}
            className="submit-button"
          >
            {loading ? 'Processing...' : 'Beautify'}
          </button>
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
