import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const bestSellers = MOCK_PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 4);

  const categories = [
    { name: 'Dog', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80', label: 'Dogs' },
    { name: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', label: 'Cats' },
    { name: 'Bird', image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=80', label: 'Birds' },
    { name: 'Small Pet', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80', label: 'Small Pets' },
  ];

  return (
    <div className="animate-fade-in">
      <Hero />
      
      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/shop?category=${cat.name}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all"
              >
                <img 
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-bold">{cat.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">New Arrivals</h2>
              <p className="text-slate-500 mt-2">Check out the latest gear for your furry friends</p>
            </div>
            <Link to="/shop" className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 group">
              View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto text-2xl">🚚</div>
              <h3 className="text-xl font-bold">Free Fast Shipping</h3>
              <p className="text-orange-100">On all orders over $50. We know your pet can't wait!</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto text-2xl">⭐</div>
              <h3 className="text-xl font-bold">Top Rated Products</h3>
              <p className="text-orange-100">Curated selection of the best-reviewed items in the market.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto text-2xl">🤖</div>
              <h3 className="text-xl font-bold">AI Smart Search</h3>
              <p className="text-orange-100">Our smart assistant Paw helps you find exactly what you need.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;