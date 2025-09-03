import { supabase } from "@/model/createClient";
import { ConsultationData } from "@/types/database.types";

export const AnalyticsService = {
    async fetchMostRequestedProducts(){
        const { data, error } = await supabase
            .from('v_productos_mas_solicitados')
            .select('*')
            .limit(20);

        if (error) throw error;
        return data || [];
    },

    async registerWhatsAppConsultation(productId: string, sessionData?: Partial<ConsultationData>): Promise<boolean> {
        const { error } = await supabase.rpc('registrar_consulta_whatsapp', {
            p_producto_id: productId,
            p_ip_address: sessionData?.ip_address || null,
            p_user_agent: sessionData?.user_agent || navigator.userAgent,
            p_referrer: sessionData?.referrer || document.referrer,
            p_session_id: sessionData?.session_id || null,
        });

        if (error) throw error;

        return true;
    },
};