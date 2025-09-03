import { supabase } from "@/model/createClient";
import { Brand } from "@/types/database.types";

export const BrandService = {
    async fetchBrands(): Promise<Brand[]> {
        const { data, error } = await supabase
            .from('marcas')
            .select('*')
            .eq('activa', true)
            .order('nombre');

        if (error) throw error;
        return data || [];
    },

    async createBrand(name: string, description?: string): Promise<Brand | null> {
        const { data, error } = await supabase
            .from('marcas')
            .insert([{ nombre: name, descripcion: description }])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async updateBrand(id: string, name: string, description?: string): Promise<Brand | null> {
        const { data, error } = await supabase
            .from('marcas')
            .update({ nombre: name, descripcion: description })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async deleteBrand(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('marcas')
            .update({ activa: false })
            .eq('id', id);

        if (error) throw error;

        return true;
    }
}