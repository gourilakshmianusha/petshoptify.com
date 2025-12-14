import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, ArrowLeft, ShoppingBag } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductDetailsProps {
  onAddToCart: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-orange-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Shop
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-orange-600 font-bold uppercase tracking-wider text-sm bg-orange-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-slate-300" : ""} />
                ))}
              </div>
              <span className="text-slate-600 font-medium">{product.rating} Rating</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">{product.reviews} Reviews</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-8">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-green-100 p-1 rounded-full text-green-600"><Check size={14} /></div>
                <span>In Stock & Ready to Ship</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-green-100 p-1 rounded-full text-green-600"><Check size={14} /></div>
                <span>Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-green-100 p-1 rounded-full text-green-600"><Check size={14} /></div>
                <span>Secure Checkout</span>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full md:w-auto bg-slate-900 text-white py-4 px-12 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-orange-200 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
