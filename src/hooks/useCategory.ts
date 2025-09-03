import { useContext } from "react";
import { ProductsContext } from "@/contexts/ProductsContext";

export function useCategory() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}