import { X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

function CartDrawer({ isCartOpen, setIsCartOpen }) {
  const { items: cartItems, totalItems: totalItemsInCart, totalPrice, updateQuantity, removeFromCart } = useCart();

  const handleRemoveFromCart = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      // Aquí podrías mostrar una notificación de error si lo deseas
      console.error(result.error || 'Error al eliminar del carrito');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      // Aquí podrías mostrar una notificación de error si lo deseas
      console.error(result.error || 'Error al actualizar cantidad');
    }
  };

  return (
    isCartOpen && (
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
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" loading="lazy" />
                      <div>
                        <div className="font-semibold text-gray-900">{item.product.name}</div>
                        <div className="text-yellow-600">${Number(item.product.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" aria-label="Disminuir cantidad">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" aria-label="Aumentar cantidad">+</button>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="p-1 text-red-500 hover:text-red-700" aria-label="Eliminar del carrito"><X size={16} /></button>
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
    )
  );
}

export default CartDrawer;
