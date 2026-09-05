import { useState } from 'react';
import { sendBeautifySellerDetails } from '../utils/api.ts';
import type { BeautifySellerDetailsResponse } from '../../../../shared/types/beautify.ts';

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
    <div>
      <h1>Listing Beautifier</h1>
      <input
        type="text"
        value={sellerDetails}
        onChange={(e) => setSellerDetails(e.target.value)}
        placeholder="Enter seller details"
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading || !sellerDetails.trim()}>
        {loading ? 'Processing...' : 'Beautify'}
      </button>

      {result && (
        <div>
          <h2>Result</h2>
          <div>
            <strong>Title:</strong> {result.title}
          </div>
          <div>
            <strong>Tags:</strong> {result.tags.join(', ')}
          </div>
          <div>
            <strong>Price Range:</strong> €{result.priceRange[0]} - €{result.priceRange[1]}
          </div>
        </div>
      )}
    </div>
  );
}
