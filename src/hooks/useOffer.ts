import { useContext } from "react";
import { ProductsContext } from "@/contexts/ProductsContext";

export function useOffer() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useOffer must be used within a ProductsProvider');
    }

    return context;
}