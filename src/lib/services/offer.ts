import { supabase } from "@/model/createClient";
import { CreateOfferData, Offer } from "@/types/database.types";

export const OfferService = {
    async createOffer(data: CreateOfferData): Promise<Offer | null> {
        const { data: offer, error } = await supabase
            .from('ofertas')
            .insert([{
                ...data,
                fecha_inicio: data.fecha_inicio || new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) throw error;

        // Update the product to mark it as on sale
        await supabase
            .from('productos')
            .update({ esta_en_oferta: true })
            .eq('id', data.producto_id);
        
        return offer;
    },

    async updateOffer(id: string, data: Partial<CreateOfferData>): Promise<Offer | null> {
        const { data: offer, error } = await supabase
            .from('ofertas')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return offer;
    },

    async deleteOffer(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('ofertas')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return true;
    },
};