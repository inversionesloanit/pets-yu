import { useState, useEffect } from 'react';
import apiService from '../services/api';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchProducts = async (newParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getProducts({ ...params, ...newParams });
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const fetchProductsByCategory = async (categoryId, newParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getProductsByCategory(categoryId, { ...params, ...newParams });
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchProductsByCategory,
    refetch: () => fetchProducts(),
  };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (id) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        setError(response.message || 'Error al cargar producto');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  return {
    product,
    isLoading,
    error,
    refetch: () => fetchProduct(productId),
  };
}
