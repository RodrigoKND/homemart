import { ProductsContext } from "@/contexts/ProductsContext";
import { useContext } from "react";

export function useAnalytics() {
   const context = useContext(ProductsContext);
   if (!context) {
       throw new Error('useAnalytics must be used within a ProductsProvider');
   }

   return context;
}