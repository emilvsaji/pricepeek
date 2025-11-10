import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About PricePeek</h3>
            <p className="text-gray-300 text-sm">
              Compare prices across Amazon, Flipkart, and Meesho to find the best deals. 
              We help you save money by finding the lowest prices and best value products.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✓ Real-time price comparison</li>
              <li>✓ Best value scoring algorithm</li>
              <li>✓ Price history tracking</li>
              <li>✓ Multiple platform support</li>
            </ul>
          </div>

          {/* Supported Platforms */}
          <div>
            <h3 className="text-lg font-bold mb-4">Supported Platforms</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center text-gray-300">
                <span className="mr-2">🛒</span>
                <span>Amazon India</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="mr-2">🛍️</span>
                <span>Flipkart</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="mr-2">🏪</span>
                <span>Meesho</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PricePeek. Built with React, TypeScript, and Node.js
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Price comparison for educational purposes. Always verify prices on the actual platform.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
