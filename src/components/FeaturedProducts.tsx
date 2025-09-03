import { ProductGrid } from './ProductGrid';
import { useProducts } from '@/hooks/useProducts';

export const FeaturedProducts = () => {
  const { products, loading, error } = useProducts();

  // 2. Estado de carga y errores
  if (loading) {
    return <p className="text-center py-10">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros productos más populares y recomendados por nuestros clientes.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
};
