import { MapPin, Heart, ShoppingBag } from 'lucide-react';
import StarIcon from '../ui/StarIcon'; // Importar StarIcon

function CorporateSection({ scrollToSection, setActiveTab, testimonials }) {
  return (
    <>
      <section id="about" className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center">
                <img src="/logo.png" alt="Logo Pets Yu" className="w-full max-w-md md:max-w-xl lg:max-w-2xl h-auto" />
                <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-900">Línea Corporativa PetsYu</h2>
                <p className="mt-3 text-gray-700 max-w-2xl">Presenta tu marca con materiales premium, consistencia visual y una identidad que enamora a tus clientes mayoristas.</p>
                <div className="mt-6">
                  <button onClick={() => scrollToSection('contact')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Quiero ser distribuidor</button>
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Sobre Pets Yu</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Pets Yu es un fabricante innovador de accesorios para mascotas con sede en Panamá, dedicado a crear productos de alta calidad que mejoran la vida de las mascotas y sus dueños.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Nuestro compromiso es ofrecer soluciones creativas y funcionales para las necesidades diarias de perros, gatos y otras mascotas, utilizando materiales seguros y duraderos.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
                <div className="text-gray-700">Productos Fabricados en Panamá</div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">5+</div>
                <div className="text-gray-700">Años de Experiencia</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-yellow-100">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Fabricantes de accesorios premium</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En PetsYu diseñamos y fabricamos accesorios para mascotas con estándares de clase mundial. 
                Fusionamos materiales de alto desempeño con procesos controlados para entregar productos 
                confiables, duraderos y con un acabado impecable.
              </p>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-yellow-500 rounded-full"></span><span><strong>Relación costo–valor superior</strong>: optimizamos insumos y procesos para que ganes margen sin sacrificar calidad.</span></li>
                <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-yellow-500 rounded-full"></span><span><strong>Producción en Panamá</strong> con control total de la cadena y entregas confiables en Centroamérica.</span></li>
                <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-yellow-500 rounded-full"></span><span><strong>Calidad certificable</strong>: procesos alineados a buenas prácticas tipo ISO para consistencia lote a lote.</span></li>
                <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-yellow-500 rounded-full"></span><span><strong>Personalización B2B</strong>: colores, empaques y branding a tu medida para diferenciar tu portafolio.</span></li>
                <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 bg-yellow-500 rounded-full"></span><span><strong>Soporte mayorista</strong>: precios escalonados, reposición ágil y atención dedicada.</span></li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => scrollToSection('contact')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Solicitar catálogo mayorista</button>
                <button onClick={() => setActiveTab('outlet')} className="border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 px-6 py-3 rounded-lg font-semibold transition-colors">Ver línea de productos</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nuestra Misión</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mb-6">
              <MapPin size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expansión Regional</h3>
            <p className="text-gray-700 leading-relaxed">
              Comenzamos en Panamá con distribución a Costa Rica, y tenemos planes de expansión a todo Centroamérica en los próximos años.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-6">
              <Heart size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pasión por las Mascotas</h3>
            <p className="text-gray-700 leading-relaxed">
              Cada producto está diseñado con amor y consideración para el bienestar de las mascotas, garantizando comodidad y seguridad.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovación Continua</h3>
            <p className="text-gray-700 leading-relaxed">
              Invertimos constantemente en investigación y desarrollo para ofrecer soluciones innovadoras que superen las expectativas del mercado.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Testimonios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < t.rating} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
              <div className="font-semibold text-gray-900">{t.name}</div>
              <div className="text-gray-600 text-sm">{t.location}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default CorporateSection;
