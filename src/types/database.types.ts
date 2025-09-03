export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  marca_id?: string;
  categoria_id?: string;
  cantidad: number;
  precio_base: number;
  moneda: string;
  imagen_url?: string;
  esta_en_oferta: boolean;
  es_destacado: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  producto_id: string;
  tipo_oferta: 'precio_fijo' | 'porcentaje';
  valor_descuento: number;
  precio_especial?: number;
  precio_final: number;
  fecha_inicio: string;
  fecha_fin?: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  producto_id: string;
  imagen_url: string;
  es_principal: boolean;
  orden: number;
  created_at: string;
}

export interface ProductWithOffer extends Product {
  marca_nombre?: string;
  categoria_nombre?: string;
  tipo_oferta?: string;
  valor_descuento?: number;
  precio_especial?: number;
  precio_final?: number;
  oferta_inicio?: string;
  oferta_fin?: string;
  precio_actual: number;
  total_consultas: number;
  consultas_semana: number;
  consultas_mes: number;
  ultima_consulta?: string;
}

export interface MostRequestedProduct extends ProductWithOffer {
  ranking_mes: number;
  ranking_semana: number;
}

export interface CreateProductData {
  nombre: string;
  descripcion?: string;
  marca_id?: string;
  categoria_id?: string;
  cantidad?: number;
  precio_base: number;
  moneda?: string;
  imagen_url?: string;
  esta_en_oferta?: boolean;
  es_destacado?: boolean;
}

export interface CreateOfferData {
  producto_id: string;
  tipo_oferta: 'precio_fijo' | 'porcentaje';
  valor_descuento: number;
  precio_especial?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface ProductsContextType {
  // State
  products: ProductWithOffer[];
  categories: Category[];
  brands: Brand[];
  mostRequestedProducts: MostRequestedProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, description?: string) => Promise<void>;
  fetchBrands: () => Promise<void>;
  createBrand: (name: string, description?: string) => Promise<void>;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  onSale?: boolean;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export interface ConsultationData {
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

export interface ProductsState {
  products: ProductWithOffer[];
  categories: Category[];
  brands: Brand[];
  mostRequestedProducts: MostRequestedProduct[];
  loading: boolean;
  error: string | null;
}