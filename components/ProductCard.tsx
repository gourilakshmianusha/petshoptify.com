import React from 'react';
import { Star, ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="bg-white text-slate-900 font-medium py-2 px-6 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} className="block flex-grow">
          <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-3">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="text-sm text-slate-600 ml-1 font-medium">{product.rating}</span>
          <span className="text-slate-400 text-sm ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors md:hidden"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
