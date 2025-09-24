// Determine API base URL with safer defaults for production
const envApiUrl = import.meta.env.VITE_API_URL;
const isBrowser = typeof window !== 'undefined';
const isLocalEnvUrl = typeof envApiUrl === 'string' && /^(https?:\/\/)?(localhost|127\.|0\.0\.0\.0)/i.test(envApiUrl);
const API_BASE_URL = (!envApiUrl || isLocalEnvUrl) ? (isBrowser ? '/api' : 'http://localhost:3001/api') : envApiUrl;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Respuesta no JSON desde ${url}. content-type: ${contentType}. Cuerpo: ${text.slice(0, 120)}...`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getProductsByCategory(categoryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`);
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // Testimonial endpoints
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async createTestimonial(testimonialData) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  // Admin endpoints
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
