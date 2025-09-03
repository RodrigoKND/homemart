import { useState, useMemo } from 'react';
import { Product } from '@/data/products';

export interface Filters {
    brand: string[];
    category: string[];
    priceRange: { min: number; max: number } | null;
    search: string;
}

export const useFilters = (products: Product[]) => {
    
    const [filters, setFilters] = useState<Filters>({
        brand: [],
        category: [],
        priceRange: null,
        search: '',
    });


    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filter by brand
            if (
                filters.length > 0 &&
                !filters.brand.includes(product.brand)
            ) {
                return false;
            }

            // Filter by category
            if (
                filters.category.length > 0 &&
                !filters.category.includes(product.category)
            ) {
                return false;
            }

            // Filter by price range
            if (filters.priceRange) {
                const { min, max } = filters.priceRange;
                if (product.price < min || product.price > max) {
                    return false;
                }
            }

            // Filter by search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesName = product.name
                    .toLowerCase()
                    .includes(searchLower);
                const matchesBrand = product.brand
                    .toLowerCase()
                    .includes(searchLower);
                const matchesCategory = product.category
                    .toLowerCase()
                    .includes(searchLower);

                if (!matchesName && !matchesBrand && !matchesCategory) {
                    return false;
                }
            }

            return true;
        });
    }, [products, filters]);

    const updateFilters = (newFilters: Partial<Filters>) => {
        setFilters((prev) => ({
            brand: Array.isArray(newFilters.brand)
                ? newFilters.brand
                : prev.brand,
            category: Array.isArray(newFilters.category)
                ? newFilters.category
                : prev.category,
            priceRange: newFilters.priceRange ?? prev.priceRange,
            search:
                typeof newFilters.search === 'string'
                    ? newFilters.search
                    : prev.search,
        }));
    };

    const clearFilters = () => {
        setFilters({
            brand: [],
            category: [],
            priceRange: null,
            search: '',
        });
    };

    return {
        filters,
        filteredProducts,
        updateFilters,
        clearFilters,
    };
};
