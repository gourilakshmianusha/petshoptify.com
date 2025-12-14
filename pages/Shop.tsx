import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../constants';
import { Product, Category } from '../types';
import { Filter } from 'lucide-react';

interface ShopProps {
  onAddToCart: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') as Category | 'All';

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(initialCategory || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  // Update category if URL changes
  useEffect(() => {
    const cat = queryParams.get('category') as Category | null;
    if (cat) setSelectedCategory(cat);
    else setSelectedCategory('All');
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat as Category | 'All')}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                        />
                        <span className={`text-sm group-hover:text-orange-600 transition-colors ${selectedCategory === cat ? 'text-orange-600 font-medium' : 'text-slate-600'}`}>
                          {cat === 'Small Pet' ? 'Small Pets' : cat === 'All' ? 'All Products' : cat + 's'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="flex justify-between text-sm text-slate-600 font-medium">
                      <span>$0</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Supplies`}
              </h1>
              <span className="text-slate-500 text-sm">Showing {filteredProducts.length} results</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setPriceRange([0, 200]);}}
                  className="mt-4 text-orange-600 font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
