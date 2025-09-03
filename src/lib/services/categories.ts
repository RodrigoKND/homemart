import { supabase } from "@/model/createClient";
import { Category } from "@/types/database.types";

export const CategoryService = {
    async fetchCategories(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('activa', true)
            .order('nombre');

        if (error) throw error;
        return data || [];
    },

    async createCategory(name: string, description?: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categorias')
            .insert([{ nombre: name, descripcion: description }])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async updateCategory(id: string, name: string, description?: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categorias')
            .update({ nombre: name, descripcion: description })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async deleteCategory(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },
};