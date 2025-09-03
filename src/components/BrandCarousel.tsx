import { Card, CardContent } from '@/components/ui/card';

export const BrandCarousel = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestra
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
              Marca Estrella
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Colaboramos con la marca más prestigiosa para ofrecerte productos
            excepcionales que transformarán tu cuidado personal
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="lg:p-6 p-2 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-6">

            {/* Logo y visual */}
            <div className="flex flex-col items-center justify-center">
              <div className="lg:w-96 w-60 h-28 rounded-2xl flex items-center justify-center">
                <img
                  src="https://natura-site-bo-assets.s3.amazonaws.com/app/uploads/2022/03/09143854/logo_natura_mb.svg"
                  alt="Logo Natura"
                  className="w-auto object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Función explicativa */}
            <div className="text-left space-y-3">
              <h4 className="text-lg font-semibold text-orange-700">¿Qué es Natura?</h4>
              <p className="text-gray-700 leading-relaxed">
                Natura es una marca de cosméticos y productos de cuidado personal que
                combina innovación con sostenibilidad. Su propósito es generar un
                impacto positivo en la sociedad y en el medio ambiente, destinando
                parte de sus esfuerzos a proyectos sociales y al consumo responsable.
              </p>
            </div>

          </CardContent>
        </Card>

      </div>
    </section>
  );
};