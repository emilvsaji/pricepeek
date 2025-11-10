import React, { useState } from 'react';

interface ProductInputProps {
  onCompare: (urls: string[]) => void;
  loading: boolean;
}

const ProductInput: React.FC<ProductInputProps> = ({ onCompare, loading }) => {
  const [amazonUrl, setAmazonUrl] = useState('');
  const [flipkartUrl, setFlipkartUrl] = useState('');
  const [meeshoUrl, setMeeshoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Collect all non-empty URLs
    const urls = [amazonUrl, flipkartUrl, meeshoUrl].filter(url => url.trim() !== '');
    
    if (urls.length === 0) {
      alert('Please enter at least one product URL');
      return;
    }
    
    onCompare(urls);
  };

  const handleClear = () => {
    setAmazonUrl('');
    setFlipkartUrl('');
    setMeeshoUrl('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Product URLs</h2>
      <p className="text-gray-600 mb-6">
        Paste product URLs from Amazon, Flipkart, or Meesho to compare prices
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amazon URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🛒 Amazon URL (Optional)
          </label>
          <input
            type="url"
            value={amazonUrl}
            onChange={(e) => setAmazonUrl(e.target.value)}
            placeholder="https://www.amazon.in/product..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Flipkart URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🛍️ Flipkart URL (Optional)
          </label>
          <input
            type="url"
            value={flipkartUrl}
            onChange={(e) => setFlipkartUrl(e.target.value)}
            placeholder="https://www.flipkart.com/product..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Meesho URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏪 Meesho URL (Optional)
          </label>
          <input
            type="url"
            value={meeshoUrl}
            onChange={(e) => setMeeshoUrl(e.target.value)}
            placeholder="https://www.meesho.com/product..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing Prices...
              </span>
            ) : (
              '🔍 Compare Prices'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> You can enter URLs from one, two, or all three platforms. 
          We'll find the best price for you!
        </p>
      </div>
    </div>
  );
};

export default ProductInput;
