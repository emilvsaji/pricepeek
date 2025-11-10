import React from 'react';
import { Product } from '../api';

interface ComparisonResultsProps {
  products: Product[];
  bestDeal?: {
    platform: string;
    price: number;
    bestValueScore: number;
  };
  lowestPrice?: number;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ products, bestDeal, lowestPrice }) => {
  if (products.length === 0) {
    return null;
  }

  // Platform icons and colors
  const platformInfo: Record<string, { icon: string; color: string; name: string }> = {
    amazon: { icon: '🛒', color: 'bg-orange-500', name: 'Amazon' },
    flipkart: { icon: '🛍️', color: 'bg-yellow-500', name: 'Flipkart' },
    meesho: { icon: '🏪', color: 'bg-pink-500', name: 'Meesho' }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Comparison Results</h2>
      
      {/* Best Deal Banner */}
      {bestDeal && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">🏆 Best Value Deal</h3>
              <p className="text-green-100 mt-1">
                {platformInfo[bestDeal.platform]?.name || bestDeal.platform} offers the best value 
                with a score of {bestDeal.bestValueScore}/100
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{bestDeal.price.toLocaleString('en-IN')}</p>
              {lowestPrice && lowestPrice < bestDeal.price && (
                <p className="text-sm text-green-100">Lowest: ₹{lowestPrice.toLocaleString('en-IN')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const info = platformInfo[product.platform];
          const isBestDeal = bestDeal?.platform === product.platform;
          
          return (
            <div 
              key={index}
              className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
                isBestDeal ? 'border-green-500 border-2' : 'border-gray-200'
              }`}
            >
              {/* Platform Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold mb-3 ${info.color}`}>
                <span className="mr-1">{info.icon}</span>
                {info.name}
              </div>

              {/* Best Deal Badge */}
              {isBestDeal && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-3 ml-2">
                  🏆 Best Value
                </div>
              )}

              {/* Product Image */}
              {product.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-48 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Product Title */}
              <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2" title={product.title}>
                {product.title}
              </h3>

              {/* Price Section */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product.discount && product.discount > 0 && (
                  <div className="mt-1">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              )}

              {/* Best Value Score */}
              {product.bestValueScore !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Value Score</span>
                    <span className="font-semibold text-blue-600">
                      {product.bestValueScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${product.bestValueScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* View Product Button */}
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View on {info.name}
              </a>
            </div>
          );
        })}
      </div>

      {/* Value Score Explanation */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>📊 Value Score:</strong> Calculated using 70% price weight and 30% rating weight. 
          Higher scores indicate better overall value considering both price and quality.
        </p>
      </div>
    </div>
  );
};

export default ComparisonResults;
