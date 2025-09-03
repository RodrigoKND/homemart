import { ProductsContext } from "@/contexts/ProductsContext";
import { useContext } from "react";

export function useBrand() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
}