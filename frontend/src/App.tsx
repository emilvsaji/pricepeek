import React, { useState } from 'react';
import Header from './components/Header';
import ProductInput from './components/ProductInput';
import ComparisonResults from './components/ComparisonResults';
import Footer from './components/Footer';
import { compareProducts, CompareResponse, Product } from './api';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle product comparison
   */
  const handleCompare = async (urls: string[]) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Comparing products:', urls);
      const response = await compareProducts(urls);
      
      if (response.success) {
        setResults(response);
      } else {
        setError(response.message || 'Failed to compare products');
      }
    } catch (err) {
      console.error('Error comparing products:', err);
      setError('An error occurred while comparing products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Product Input Form */}
        <ProductInput onCompare={handleCompare} loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 mb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Comparing Prices...</h3>
              <p className="text-gray-500">This may take a few moments as we scrape the latest data</p>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {results && results.products && (
          <ComparisonResults 
            products={results.products}
            bestDeal={results.bestDeal}
            lowestPrice={results.lowestPrice}
          />
        )}

        {/* How it Works Section */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Enter URLs</h3>
                <p className="text-gray-600 text-sm">
                  Paste product URLs from Amazon, Flipkart, or Meesho
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">We Compare</h3>
                <p className="text-gray-600 text-sm">
                  Our system scrapes real-time prices and calculates the best value
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Save Money</h3>
                <p className="text-gray-600 text-sm">
                  View detailed comparison and choose the best deal
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">📊 Best Value Score</h3>
              <p className="text-blue-800 text-sm">
                Our algorithm calculates a score based on 70% price and 30% rating to help you 
                find the best overall value, not just the lowest price.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-3">⚡ Real-time Data</h3>
              <p className="text-purple-800 text-sm">
                We scrape the latest prices directly from the platforms, ensuring you always 
                see current prices and discounts.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-3">💾 Price History</h3>
              <p className="text-green-800 text-sm">
                All price data is saved to help you track trends and identify the best time to buy.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-bold text-orange-900 mb-3">🔔 Price Alerts</h3>
              <p className="text-orange-800 text-sm">
                Set target prices and get notified when products reach your desired price point.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
