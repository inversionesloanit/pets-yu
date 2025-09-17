import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, Phone, Mail, MapPin, Menu, X, Search, Heart, User, ShoppingCart } from 'lucide-react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('corporate')
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [category, setCategory] = useState('Todos')
  const [isCartOpen, setIsCartOpen] = useState(false)

  const products = [
    { id: 1, name: 'Collar Premium para Perros', price: 25.99, image: 'https://placehold.co/300x300/FFD700/FFFFFF?text=Premium+Collar', category: 'Accesorios', rating: 4.8, inStock: true },
    { id: 2, name: 'Juguete Interactivo para Gatos', price: 18.5, image: 'https://placehold.co/300x300/FF6B6B/FFFFFF?text=Interactive+Toy', category: 'Juguetes', rating: 4.5, inStock: true },
    { id: 3, name: 'Cama Cómoda para Mascotas', price: 89.99, image: 'https://placehold.co/300x300/4ECDC4/FFFFFF?text=Comfort+Bed', category: 'Hogar', rating: 4.9, inStock: false },
    { id: 4, name: 'Arnes de Seguridad para Perros', price: 32.0, image: 'https://placehold.co/300x300/45B7D1/FFFFFF?text=Safety+Harness', category: 'Accesorios', rating: 4.7, inStock: true },
  ]

  const testimonials = [
    { id: 1, name: 'María González', location: 'Panamá City', text: 'Los productos de Pets Yu son de excelente calidad y mi perro los ama!', rating: 5 },
    { id: 2, name: 'Carlos Pérez', location: 'San José', text: 'Compré varios accesorios para mi gato y todos han sido duraderos y cómodos.', rating: 5 },
    { id: 3, name: 'Ana Rodríguez', location: 'Colón', text: 'El servicio al cliente es excelente y el envío fue muy rápido.', rating: 4 },
  ]

  const slides = [
    { title: 'Accesorios de Calidad para tu Mascota', subtitle: 'Fabricados con materiales premium en Panamá', image: '/hero-desktop.jpeg' },
    { title: 'Más que un Producto, una Experiencia', subtitle: 'Cuidamos a tus mascotas como si fueran parte de la familia', image: '/hero-desktop.jpeg' },
    { title: 'Envío Rápido a Costa Rica y Más', subtitle: 'Servicio de entrega confiable a toda Centroamérica', image: '/hero-desktop.jpeg' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity: newQuantity } : i)))
  }

  const totalItemsInCart = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems])
  const totalPrice = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems])

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (category === 'Todos' ? true : p.category === category))
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [products, category, searchQuery])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('corporate')}
                className="flex items-center"
                aria-label="Ir a corporativo"
              >
                <img src="/logo.png" alt="Pets Yu Logo" className="h-16 w-auto" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('corporate')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'corporate' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                Corporativo
              </button>
              <button
                onClick={() => setActiveTab('outlet')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'outlet' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                Tienda
              </button>
              <button onClick={() => scrollToSection('about')} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                Sobre Nosotros
              </button>
              <button onClick={() => scrollToSection('products')} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                Productos
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                Contacto
              </button>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" aria-label="Buscar">
                <Search size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" aria-label="Favoritos">
                <Heart size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" aria-label="Cuenta">
                <User size={20} />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-600 hover:text-yellow-600 transition-colors relative" aria-label="Carrito" aria-haspopup="dialog" aria-expanded={isCartOpen}>
                <ShoppingCart size={20} />
                {totalItemsInCart > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemsInCart}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                aria-label="Abrir menú"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => setActiveTab('corporate')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'corporate' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                  }`}
                >
                  Corporativo
                </button>
                <button
                  onClick={() => setActiveTab('outlet')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'outlet' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                  }`}
                >
                  Tienda
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                  Sobre Nosotros
                </button>
                <button onClick={() => scrollToSection('products')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                  Productos
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                  Contacto
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Corporate Section */}
        {activeTab === 'corporate' && (
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
        )}

        {/* Outlet Section */}
        {activeTab === 'outlet' && (
          <>
            <section id="products" className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Tienda Pets Outlet</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Descubre nuestra colección de productos exclusivos para mascotas, diseñados con calidad superior y atención al detalle.
                </p>
              </div>

              {/* Search and Filter */}
              <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    aria-label="Buscar productos"
                  />
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  {['Todos', 'Accesorios', 'Juguetes', 'Hogar'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={
                        c === category
                          ? 'px-4 py-2 bg-yellow-600 text-white rounded-lg transition-colors'
                          : 'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                      }
                      aria-pressed={c === category}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold">Agotado</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-yellow-600 font-medium">{product.category}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < Math.floor(product.rating)} />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-yellow-600">${product.price.toFixed(2)}</span>
                        {product.inStock && (
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cart drawer trigger handled by header */}
          </>
        )}

        {/* Contact Section */}
        <section id="contact" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Contáctanos</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos o servicios. 
                No dudes en contactarnos para obtener más información.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dirección</h3>
                    <p className="text-gray-700">Av. Central #123, Ciudad de Panamá, Panamá</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-700">+507 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Correo Electrónico</h3>
                    <p className="text-gray-700">info@petsyu.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form className="bg-white p-8 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Asunto de tu mensaje"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Tu Carrito ({totalItemsInCart})</h3>
              <button onClick={() => setIsCartOpen(false)} aria-label="Cerrar carrito" className="p-2 text-gray-600 hover:text-gray-900"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-600 mt-10">Tu carrito está vacío.</div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" loading="lazy" />
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-yellow-600">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" aria-label="Disminuir cantidad">-</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" aria-label="Aumentar cantidad">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:text-red-700" aria-label="Eliminar del carrito"><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex items-center justify-between">
              <span className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</span>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50" disabled={cartItems.length === 0} onClick={() => alert('Checkout aún no implementado')}>
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="Pets Yu Logo" className="h-14 w-auto" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Fabricantes de accesorios para mascotas de alta calidad, con sede en Panamá y alcance regional en Centroamérica.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Facebook">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.064 24 12.073z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Instagram">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.06 3.252.148 4.771 1.691 4.919 4.919.048 1.265.059 1.645.059 4.849 0 3.205-.012 3.584-.059 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.048-1.644.059-4.85.059-3.204 0-3.584-.012-4.849-.059-3.227-.149-4.771-1.694-4.919-4.919-.048-1.265-.059-1.644-.059-4.849 0-3.204.012-3.583.059-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.047 1.645-.059 4.849-.059zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Twitter">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.564-2.005.954-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.66 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.219c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A10.01 10.01 0 0024 4.59z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Inicio</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Sobre Nosotros</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Productos</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Contacto</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Información</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Política de Envío</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Garantía</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Términos y Condiciones</button></li>
                <li><button className="text-gray-400 hover:text-yellow-400 transition-colors">Privacidad</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Pets Yu. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const StarIcon = ({ filled }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={filled ? '#FBBF24' : 'none'} 
    stroke="#FBBF24" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
  </svg>
)

export default App


