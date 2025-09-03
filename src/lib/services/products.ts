import { supabase } from "@/model/createClient";
import { CreateProductData, Product, ProductFilters, ProductWithOffer } from "@/types/database.types";

export const ProductService = {
    async productsOffer(filters?: ProductFilters): Promise<Product[]> {
        let query = supabase
            .from('v_productos_con_ofertas')
            .select('*');

        // Apply filters
        if (filters?.category) {
            query = query.eq('categoria_id', filters.category);
        }
        if (filters?.brand) {
            query = query.eq('marca_id', filters.brand);
        }
        if (filters?.onSale !== undefined) {
            query = query.eq('esta_en_oferta', filters.onSale);
        }
        if (filters?.featured !== undefined) {
            query = query.eq('es_destacado', filters.featured);
        }
        if (filters?.search) {
            query = query.ilike('nombre', `%${filters.search}%`);
        }
        if (filters?.minPrice !== undefined) {
            query = query.gte('precio_actual', filters.minPrice);
        }
        if (filters?.maxPrice !== undefined) {
            query = query.lte('precio_actual', filters.maxPrice);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        if (filters?.offset) {
            query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },
    async fetchProducts(): Promise<Product[] | null> {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('activo', true)
            .order('nombre');

        if (error) throw error;
        return data || [];
    },

    async createProduct(product: CreateProductData): Promise<Product | null> {
        const { data, error } = await supabase
            .from('productos')
            .insert([product])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async updateProduct(id: string, name: string, description?: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('productos')
            .update({ nombre: name, descripcion: description })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async deleteProduct(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async fetchProductById(id: string): Promise<ProductWithOffer | null> {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    },  
};