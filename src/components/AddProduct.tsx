import React, { useState, useEffect } from 'react';
import { X, SprayCan } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCategory } from '@/hooks/useCategory';
import { useProducts } from "@/hooks/useProducts";
import { supabase } from '@/model/createClient';
import { useBrand } from '@/hooks/useBrand';


export default function DynamicProductForm({ onClose }: { onClose: () => void }) {
  const [product, setProduct] = useState({
    id: new Date().getTime(),
    brand: '',
    description: '',
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    isOffer: false,
    offerType: 'fixed',
    offerValue: 0,
    offerUntil: undefined,
    image: null,
    isHighlighted: false,
  });
  const { createProduct } = useProducts();
const { brands } = useBrand();


  const { categories } = useCategory();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  useEffect(() => {
    if (!product.isOffer || product.offerValue <= 0) {
      setFinalPrice(product.price);
      return;
    }
    if (product.offerType === 'fixed') {
      setFinalPrice(product.offerValue > product.price ? product.price : product.offerValue);
    } else {
      const discount = (product.price * product.offerValue) / 100;
      const priceAfter = product.price - discount;
      setFinalPrice(priceAfter < 0 ? 0 : priceAfter);
    }
  }, [product.price, product.isOffer, product.offerValue, product.offerType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let val;
    if (type === 'checkbox') val = checked;
    else if (type === 'number') val = Number(value);
    else val = value;

    setProduct((p) => ({
      ...p,
      [name]: val,
    }));
  };

  const handleHighlightToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct((p) => ({ ...p, isHighlighted: e.target.checked }));
  };

 const [file, setFile] = useState<File | null>(null);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const uploadedFile = e.target.files?.[0];
  if (!uploadedFile) return;

  setFile(uploadedFile); // guardamos el archivo real

  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string); // solo para previsualizar
  };
  reader.readAsDataURL(uploadedFile);
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (finalPrice > product.price) {
    toast.error("El precio final no puede ser mayor que el precio original");
    return;
  }

  if (
    product.brand === "" ||
    product.description === "" ||
    product.category === "" ||
    product.quantity === 0 ||
    product.price === 0 ||
    !file
  ) {
    toast.error("Todos los campos son obligatorios, a excepción de oferta");
    return;
  }

  try {
    // 1. Subir imagen a Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // 3. Insertar producto en DB
    const { data: insertedProduct, error: insertError } = await supabase
      .from("productos")
      .insert([
        {
          nombre: product.name,
          descripcion: product.description,
          marca_id: product.brand,       // 👈 debe ser UUID
          categoria_id: product.category, // 👈 debe ser UUID
          cantidad: product.quantity,
          precio_base: product.price,
          imagen_url: imageUrl,
          esta_en_oferta: product.isOffer,
          es_destacado: product.isHighlighted,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 4. Si tiene oferta, insertarla en tabla `ofertas`
    if (product.isOffer) {
      const { error: offerError } = await supabase.from("ofertas").insert([
        {
          producto_id: insertedProduct.id,
          tipo_oferta: product.offerType || "precio_fijo",
          valor_descuento: product.offerValue || 0,
          precio_especial: finalPrice,
          precio_final: finalPrice,
          fecha_fin: product.offerUntil || null,
        },
      ]);
      if (offerError) throw offerError;
    }

    toast.success("Producto guardado en la base de datos!");
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Error al guardar el producto");
  }
};


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center md:p-4 p-0 z-50 overflow-y-auto">
      <div className="bg-pink-300/20 rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden border border-pink-100">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-400/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-400/10 rounded-full filter blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-8 pb-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            aria-label="Cerrar formulario"
          >
            <X size={20} className="text-gray-700" />
          </button>

          <div className="text-center mb-8 mt-8 md:mt-0">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-300 mb-3">
              Nuevo Producto
            </h2>
            <p className="text-gray-500 text-white font-light mb-2">Complete los detalles del producto</p>
            <hr />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 md:px-8 px-2 pb-8 max-h-[70vh] overflow-y-auto">
          {/* Brand */}
          <div className='flex flex-col md:flex-row md:gap-4'>
            <div className="mb-6 md:w-1/2 w-full">
              <label className="block text-sm text-white font-medium mb-2 uppercase tracking-wider">Nombre del producto</label>
              <div className="relative">
                <input
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Oréal Paris Skin Care"
                  maxLength={25}
                  className="w-full bg-pink-300/20 placeholder:text-white text-white border border-gray-200 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <SprayCan className='text-gray-100' />
                </div>
              </div>
            </div>
            <div className="mb-6 md:w-1/2 w-full">
              <label className="block text-sm text-white font-medium mb-2 uppercase tracking-wider">Marca</label>
              <div className="relative">
                <select
  name="brand"
  value={product.brand}
  onChange={handleChange}
  required
  className="dropdown-menu w-full p-3 border-2 bg-pink-300/20 text-white rounded-lg"
>
  <option value="" disabled>Seleccione una marca</option>
  {brands?.map((brand) => (
    <option key={brand.id} value={brand.id}>
      {brand.nombre}
    </option>
  ))}
</select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wider">Descripción (limite 150 caracteres)</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              rows={3}
              maxLength={150}
              placeholder="Describe el producto..."
              className="w-full resize-none bg-pink-300/20 placeholder:text-white text-white border border-gray-200 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 shadow-sm hover:shadow-md"

            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm text-white font-medium mb-2 uppercase tracking-wider">Categoría</label>
            <div className="relative">
              <select
  name="category"
  value={product.category}
  onChange={handleChange}
  required
  className="dropdown-menu w-full p-3 border-2 bg-pink-300/20 text-white"
>
  <option value="" disabled>Seleccione una categoría</option>
  {categories?.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
  ))}
</select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wider">Cantidad</label>
              <div className="relative group">
                <input
                  name="quantity"
                  type="number"
                  min={0}
                  value={product.quantity === 0 ? '' : product.quantity}
                  onChange={handleChange}
                  required
                  placeholder="Cantidad de productos"
                  className="w-full bg-pink-300/20 placeholder:text-white text-white border border-gray-200 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 shadow-sm hover:shadow-md"

                />
                <div className="absolute inset-y-0 group-hover:opacity-0 group-focus-within:opacity-0 ransition-opacity duration-200 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wider">Precio (Bs.)</label>
              <div className="relative group">
                <input
                  name="price"
                  type="number"
                  min={0}
                  value={product.price === 0 ? '' : product.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full bg-pink-300/20 placeholder:text-white text-white border border-gray-200 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-y-0 group-hover:opacity-0 group-focus-within:opacity-0 ransition-opacity duration-200 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Toggle */}
          <div className="flex items-center gap-3 p-4 bg-pink-300/20 rounded-xl border border-purple-100/50 mb-6">
            <input
              type="checkbox"
              name="isOffer"
              checked={product.isOffer}
              onChange={handleChange}
              id="offerToggle"
              className="w-6 h-6 accent-purple-300 cursor-pointer rounded focus:ring-2 focus:ring-purple-500/50"
            />
            <label htmlFor="offerToggle" className="font-medium text-gray-100 cursor-pointer text-lg">
              ¿Este producto está en oferta?
            </label>
          </div>

          {/* Offer Section */}
          {product.isOffer && (
            <div className="space-y-6 p-6 bg-white/90 rounded-xl border border-gray-200 shadow-sm mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                </svg>
                Detalles de la oferta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de oferta</label>
                  <div className="relative">
                    <select
                      name="offerType"
                      value={product.offerType}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm"
                    >
                      <option value="fixed">Precio fijo</option>
                      <option value="percentage">Porcentaje</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {product.offerType === 'fixed' ? 'Precio especial' : 'Descuento (%)'}
                  </label>
                  <div className="relative">
                    <input
                      name="offerValue"
                      type="number"
                      min={0}
                      max={product.offerType === 'percentage' ? 100 : undefined}
                      value={product.offerValue === 0 ? '' : product.offerValue}
                      onChange={handleChange}
                      placeholder={product.offerType === 'fixed' ? 'Bs. 0.00' : '0-100%'}
                      className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400">
                        {product.offerType === 'fixed' ? 'Bs.' : '%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Precio final:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    Bs. {finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Válido hasta</label>
                <div className="relative">
                  <input
                    type="date"
                    name="offerUntil"
                    value={product.offerUntil || ''}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Highlight Toggle */}
          <div className="flex items-center gap-3 p-4 bg-pink-300/20 rounded-xl border border-purple-100/50 mb-6">
            <input
              type="checkbox"
              name="isHighlighted"
              checked={product.isHighlighted}
              onChange={handleHighlightToggle}
              id="highlightToggle"
              className="w-6 h-6 accent-purple-300 cursor-pointer rounded focus:ring-2 focus:ring-purple-500/50"
            />
            <label htmlFor="highlightToggle" className="font-medium text-gray-100 cursor-pointer text-lg">
              ¿Este producto es destacado?
            </label>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-white mb-3 uppercase tracking-wider">Imagen del producto</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-pink-300/20 hover:bg-pink-300/30 transition-all duration-300 hover:border-purple-400 hover:shadow-md group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <span className="text-white font-medium text-white">Cambiar imagen</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-100 group-hover:text-gray-300">
                        <span className="font-semibold">Haz clic para subir</span>
                      </p>
                      <p className="text-xs text-gray-100 group-hover:text-gray-300">PNG, JPG o JPEG (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Publicar Producto
          </button>
        </form>
      </div>
    </div>
  );
}