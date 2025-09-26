import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar Link y useLocation
import { ShoppingBag, Phone, Mail, MapPin, Menu, X, Search, Heart, User, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Header({ handleNavigate, scrollToSection, setShowLoginModal, setIsCartOpen }) { // Cambiar setActiveTab a handleNavigate
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems: totalItemsInCart } = useCart();
  const location = useLocation(); // Obtener la ubicación actual

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/" // Usar Link para navegar a la ruta raíz
              className="flex items-center"
              aria-label="Ir a corporativo"
              onClick={() => setIsMenuOpen(false)} // Cerrar menú móvil al navegar
            >
              <img src="/logo.png" alt="Pets Yu Logo" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Corporativo
            </Link>
            <Link
              to="/outlet"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/outlet') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Tienda
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
              Productos
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" aria-label="Buscar">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" aria-label="Favoritos">
              <Heart size={20} />
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden sm:block">
                  ¡Hola, {user?.name}!
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors" 
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="p-2 text-gray-600 hover:text-yellow-600 transition-colors" 
                aria-label="Iniciar sesión"
              >
                <User size={20} />
              </button>
            )}
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
              <Link
                to="/"
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Corporativo
              </Link>
              <Link
                to="/outlet"
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/outlet') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700 hover:text-yellow-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tienda
              </Link>
              <Link to="/about" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Sobre Nosotros
              </Link>
              <Link to="/products" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Productos
              </Link>
              <Link to="/contact" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
