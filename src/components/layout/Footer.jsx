import React from 'react';

function Footer() {
  return (
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
  );
}

export default Footer;
