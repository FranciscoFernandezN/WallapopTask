import { useState } from 'react';
import { sendBeautifySellerDetails } from '../utils/api.ts';

export function BeautifyScreen() {
  const [sellerDetails, setSellerDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!sellerDetails.trim()) return;

    setLoading(true);
    try {
      const result = await sendBeautifySellerDetails({ sellerDetails });
      console.log(result);
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
    </div>
  );
}
