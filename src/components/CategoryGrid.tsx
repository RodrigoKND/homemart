import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { categories } from '@/data/products';

const categoryImages = {
  'Perfumes': 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'Maquillaje': 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'Cuidado facial': 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'Cuidado corporal': 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
};

const categoryColors = [
  'from-pink-400 to-pink-500',
  'from-purple-400 to-purple-500', 
  'from-blue-400 to-blue-500',
  'from-green-400 to-green-500'
];

export const CategoryGrid = () => {
  return (
    <section id='categories' className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explora Nuestras
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Categorías
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre productos cuidadosamente seleccionados para cada aspecto de tu 
            rutina de belleza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {categories.slice(0, 4).map((category, index) => (
            <Link
              key={category}
              to={`/catalog?category=${encodeURIComponent(category)}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 rounded-3xl bg-white">
                <div className="relative h-48">
                  <img
                    src={categoryImages[category as keyof typeof categoryImages]}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Decorative circle */}
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${categoryColors[index]} rounded-full opacity-80`} />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">
                      {category}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {category === 'Perfumes' && 'Sábanas, almohadas, cortinas y más'}
                      {category === 'Maquillaje' && 'Alfombras, cojines y decoración'}
                      {category === 'Cuidado facial' && 'Electrodomésticos y utensilios'}
                      {category === 'Cuidado corporal' && 'Muebles y accesorios'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};