import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ProductWithOffer } from '@/types/database.types';

interface ProductCardProps {
  product: ProductWithOffer;
  className?: string;
}

export const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  return (
    <Card
      className={`flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-lg border-0 rounded-2xl bg-white ${className}`}
    >
      {/* Imagen del producto */}
      <div className="aspect-square flex items-center justify-center bg-gray-100">
        {product.imagen_url ? (
          <img
            src={product.imagen_url}
            alt={product.nombre}
            loading='lazy'
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-sm">Sin imagen</span>
        )}
      </div>

      {/* Contenido */}
      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Marca */}
        <div className="mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.marca_nombre ?? "Genérico"}
          </span>
        </div>

        {/* Nombre */}
        <h3 className="font-medium text-gray-800 mb-4 text-sm group-hover:text-pink-600 transition-colors flex-grow">
          {product.nombre}
        </h3>

        {/* Precio + botón */}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-gray-800 text-lg">
            Bs {product.precio_base}
          </span>

          <Link
            to={`/product/${product.id}`}
            className="text-sm text-white px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-all duration-200 transform hover:scale-105"
          >
            Ver detalles →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
