import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import Notification from '../ui/Notification';
import StarIcon from '../ui/StarIcon';

function OutletSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const { products, categories, isLoading: productsLoading, error: productsError } = useProducts();
  const { addToCart } = useCart();

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'info' });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      showNotification('Producto agregado al carrito', 'success');
    } else {
      showNotification(result.error || 'Error al agregar al carrito', 'error');
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (category === 'Todos' ? true : p.category?.name === category))
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, category, searchQuery]);

  return (
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('Todos')}
              className={
                'Todos' === category
                  ? 'px-4 py-2 bg-yellow-600 text-white rounded-lg transition-colors'
                  : 'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              }
              aria-pressed={'Todos' === category}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.name)}
                className={
                  c.name === category
                    ? 'px-4 py-2 bg-yellow-600 text-white rounded-lg transition-colors'
                    : 'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                }
                aria-pressed={c.name === category}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : productsError ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              {productsError}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              No se encontraron productos
            </div>
          </div>
        ) : (
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
                  <span className="text-sm text-yellow-600 font-medium">{product.category?.name}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < Math.floor(product.rating)} />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-yellow-600">${Number(product.price).toFixed(2)}</span>
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
        )}
      </section>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
      />
    </>
  );
}

export default OutletSection;
