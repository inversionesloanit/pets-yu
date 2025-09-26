import { useEffect, useState } from 'react';

function HeroSection({ scrollToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: 'Accesorios de Calidad para tu Mascota', subtitle: 'Fabricados con materiales premium en Panamá', image: '/hero-desktop.jpeg' },
    { title: 'Más que un Producto, una Experiencia', subtitle: 'Cuidamos a tus mascotas como si fueran parte de la familia', image: '/hero-desktop.jpeg' },
    { title: 'Envío Rápido a Costa Rica y Más', subtitle: 'Servicio de entrega confiable a toda Centroamérica', image: '/hero-desktop.jpeg' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[30vh] md:h-[35vh] lg:h-[38vh] overflow-hidden">
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/hero-desktop.jpeg" />
          <source media="(min-width: 640px)" srcSet="/hero-tablet.jpeg" />
          <img src="/hero-mobile.jpeg" alt="Hero" className="w-full h-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">{slides[currentSlide].title}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-200">{slides[currentSlide].subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <button onClick={() => scrollToSection('products')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Ver Productos
            </button>
            <button onClick={() => scrollToSection('contact')} className="border-2 border-white hover:border-yellow-600 text-white hover:text-yellow-600 px-8 py-3 rounded-full font-semibold transition-all">
              Contacto
            </button>
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
