import { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CART':
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        error: null,
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.product.id === action.payload.product.id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        error: null,
      };
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      const updatedTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
        error: null,
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const filteredTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      const filteredTotalPrice = filteredItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredTotalItems,
        totalPrice: filteredTotalPrice,
        error: null,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Cargar carrito del usuario autenticado
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await apiService.getCart();
          if (response.success) {
            dispatch({ type: 'SET_CART', payload: response.data });
          }
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    };

    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'Debes iniciar sesión para agregar productos al carrito' });
      return { success: false, error: 'Debes iniciar sesión' };
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.addToCart(product.id, quantity);
      
      if (response.success) {
        dispatch({ type: 'ADD_ITEM', payload: { ...response.data, product } });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Error al agregar al carrito' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.updateCartItem(itemId, quantity);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_ITEM', payload: { itemId, quantity } });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Error al actualizar cantidad' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.removeFromCart(itemId);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Error al eliminar del carrito' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.clearCart();
      
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Error al vaciar carrito' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
