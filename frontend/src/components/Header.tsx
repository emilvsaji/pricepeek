import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🔍 PricePeek</h1>
            <p className="text-blue-100 mt-1">Compare prices across Amazon, Flipkart & Meesho</p>
          </div>
          <div className="hidden md:flex space-x-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-sm">Real-time comparison</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-sm">Best value scoring</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
