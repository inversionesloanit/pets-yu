import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Notification from './components/ui/Notification';

// Importar los nuevos componentes de layout
import Header from './components/layout/Header';
import HeroSection from './components/layout/HeroSection';
import CorporateSection from './components/layout/CorporateSection';
import OutletSection from './components/layout/OutletSection';
import ContactSection from './components/layout/ContactSection';
import CartDrawer from './components/layout/CartDrawer';
import Footer from './components/layout/Footer';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'info' });
  };

  const testimonials = [
    { id: 1, name: 'María González', location: 'Panamá City', text: 'Los productos de Pets Yu son de excelente calidad y mi perro los ama!', rating: 5 },
    { id: 2, name: 'Carlos Pérez', location: 'San José', text: 'Compré varios accesorios para mi gato y todos han sido duraderos y cómodos.', rating: 5 },
    { id: 3, name: 'Ana Rodríguez', location: 'Colón', text: 'El servicio al cliente es excelente y el envío fue muy rápido.', rating: 4 },
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        setActiveTab={handleNavigate} // Usar handleNavigate para cambiar de ruta
        scrollToSection={scrollToSection} 
        setShowLoginModal={setShowLoginModal} 
        setIsCartOpen={setIsCartOpen} 
      />

      <HeroSection scrollToSection={scrollToSection} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Routes>
          <Route path="/" element={
            <CorporateSection 
              scrollToSection={scrollToSection} 
              setActiveTab={handleNavigate} // Usar handleNavigate para cambiar de ruta
              testimonials={testimonials} 
            />
          } />
          <Route path="/outlet" element={<OutletSection />} />
          <Route path="/about" element={
            <CorporateSection 
              scrollToSection={scrollToSection} 
              setActiveTab={handleNavigate} 
              testimonials={testimonials} 
            />
          } /> {/* Reutilizar CorporateSection para "Sobre Nosotros" */}
          <Route path="/products" element={<OutletSection />} /> {/* Reutilizar OutletSection para "Productos" */}
          <Route path="/contact" element={<ContactSection />} />
        </Routes>
      </main>

      <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
