import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { TableData } from '../types';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: TableData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return `$${numPrice.toFixed(2)}`;
  };

  const isOutOfStock = (availability: string) => 
    availability.toLowerCase().includes('out') || availability.toLowerCase().includes('unavailable');

  const getAvailabilityColor = (availability: string) => {
    const status = availability.toLowerCase();
    if (status.includes('in stock') || status.includes('available')) {
      return 'bg-green-100 text-green-800';
    } else if (status.includes('limited') || status.includes('low')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status.includes('out') || status.includes('unavailable')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock(product.availability)) {
      addItem(product);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={product.image}
            alt={product.description}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(product.availability)}`}>
              {product.availability}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.description}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            {product.category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock(product.availability)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isOutOfStock(product.availability)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isOutOfStock(product.availability) ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;