import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MobileFilterDrawer } from '@/components/MobileFilterDrawer';
import { useFilters } from '@/hooks/useFilters';
import { useMobile } from '@/hooks/useMobile';

export const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const isMobile = useMobile();
  // 1. Leer del sessionStorage de forma segura
  const storedProducts = sessionStorage.getItem('products');
  let productsFromStorage = [];
  try {
    productsFromStorage = storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error parsing stored products:', error);
    productsFromStorage = [];
  }

  const allProducts = [...products, ...productsFromStorage];
  const { filters, filteredProducts, updateFilters, clearFilters } = useFilters(allProducts);

  // Apply URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');

    updateFilters({
      category: category ? [category] : undefined,
      brand: brand ? [brand] : undefined,
    });
  }, [searchParams]);

  // Simulate loading
  useEffect(() => {
    window.scrollTo({
      top: 0
    })
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'brand':
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Results Count */}
        <div className="mb-3 sm:mb-6 px-2 sm:px-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Mostrando {sortedProducts.length} productos
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6 bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm gap-2">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {isMobile && (
                  <MobileFilterDrawer
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                  />
                )}

                <span className="text-xs sm:text-sm text-gray-600">
                  {sortedProducts.length} productos
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Sort */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-24 sm:w-32 rounded-full text-xs sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nombre</SelectItem>
                      <SelectItem value="price">Precio</SelectItem>
                      <SelectItem value="brand">Marca</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={sortedProducts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};