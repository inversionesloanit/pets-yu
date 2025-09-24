// Global variables
let authToken = localStorage.getItem('adminToken');
let currentEditingId = null;

console.log('Admin.js loaded, authToken:', authToken ? 'present' : 'not present');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin app');
    if (authToken) {
        showAdminDashboard();
        loadDashboardStats();
    } else {
        showLoginScreen();
    }
});

// Login functionality
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', { email, password: '***' });
    
    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showAdminDashboard();
            loadDashboardStats();
        } else {
            alert('Credenciales inválidas: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'products':
            loadProducts();
            loadCategories();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
    }
}

// Dashboard
async function loadDashboardStats() {
    try {
        const response = await fetch('/admin/stats', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalProducts').textContent = data.data.stats.totalProducts;
            document.getElementById('totalCategories').textContent = data.data.stats.totalCategories;
            document.getElementById('totalOrders').textContent = data.data.stats.totalOrders;
            document.getElementById('totalUsers').textContent = data.data.stats.totalUsers;
            
            // Load recent orders
            const recentOrdersContainer = document.getElementById('recentOrders');
            recentOrdersContainer.innerHTML = '';
            
            data.data.recentOrders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'flex justify-between items-center p-4 border rounded';
                orderElement.innerHTML = `
                    <div>
                        <p class="font-medium">${order.user.name}</p>
                        <p class="text-sm text-gray-600">${order.user.email}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-medium">$${order.total}</p>
                        <p class="text-sm text-gray-600">${order.status}</p>
                    </div>
                `;
                recentOrdersContainer.appendChild(orderElement);
            });
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Products
async function loadProducts() {
    try {
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';
            
            data.data.products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full object-cover" src="${product.image}" alt="${product.name}">
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${product.name}</div>
                                <div class="text-sm text-gray-500">${product.description || 'Sin descripción'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.category.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${product.price}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${product.inStock ? 'En stock' : 'Agotado'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="editProduct('${product.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                        <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success) {
            // Populate category select in product form
            const categorySelect = document.getElementById('productCategory');
            categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>';
            
            data.data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
            // Populate categories table
            const tbody = document.getElementById('categoriesTableBody');
            if (tbody) {
                tbody.innerHTML = '';
                
                data.data.forEach(category => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${category.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${category.description || 'Sin descripción'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category._count?.products || 0}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editCategory('${category.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                            <button onclick="deleteCategory('${category.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Product form functions
function showProductForm() {
    document.getElementById('productForm').classList.remove('hidden');
    currentEditingId = null;
    document.getElementById('productFormElement').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

function hideProductForm() {
    document.getElementById('productForm').classList.add('hidden');
    currentEditingId = null;
}

// Subida y guardado de producto cumpliendo validaciones backend
document.getElementById('productFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // 1) Si hay imagen, subirla a /admin/upload para obtener URL pública
        let uploadedImageUrl = undefined;
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            const uploadForm = new FormData();
            uploadForm.append('image', imageFile);

            const uploadResp = await fetch('/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: uploadForm
            });
            const uploadData = await uploadResp.json();
            if (!uploadResp.ok || !uploadData.success) {
                throw new Error(uploadData.error || 'Error al subir imagen');
            }
            uploadedImageUrl = uploadData.data.imageUrl;
        }

        // 2) Armar payload JSON conforme a validaciones
        const payload = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            categoryId: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value || undefined,
            rating: document.getElementById('productRating').value ? parseFloat(document.getElementById('productRating').value) : undefined,
            inStock: !!document.getElementById('productInStock').checked
        };
        
        // Validar campos requeridos
        if (!payload.name || payload.name.length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        if (!payload.categoryId) {
            throw new Error('Debe seleccionar una categoría');
        }
        if (isNaN(payload.price) || payload.price <= 0) {
            throw new Error('El precio debe ser un número válido mayor a 0');
        }
        
        // Para crear producto, image es requerido
        if (!currentEditingId && !uploadedImageUrl) {
            throw new Error('Debe subir una imagen para crear un producto');
        }
        
        if (uploadedImageUrl) {
            payload.image = uploadedImageUrl; // backend espera URL
        } else if (!currentEditingId) {
            // Si es creación y no hay imagen, usar placeholder
            payload.image = 'https://placehold.co/300x300/FFD700/FFFFFF?text=Product+Image';
        }

        // 3) Crear o actualizar vía JSON
        let url = '/api/products';
        let method = 'POST';
        if (currentEditingId) {
            url += `/${currentEditingId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            alert('Producto guardado exitosamente');
            hideProductForm();
            loadProducts();
        } else {
            alert('Error al guardar producto: ' + (data.error || 'Validation failed'));
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error al guardar producto: ' + error.message);
    }
});

// Image preview
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview rounded">`;
        };
        reader.readAsDataURL(file);
    }
});

// Category form functions
function showCategoryForm() {
    document.getElementById('categoryForm').classList.remove('hidden');
    currentEditingId = null;
    document.getElementById('categoryFormElement').reset();
}

function hideCategoryForm() {
    document.getElementById('categoryForm').classList.add('hidden');
    currentEditingId = null;
}

document.getElementById('categoryFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };
    
    try {
        let url = '/api/categories';
        let method = 'POST';
        
        if (currentEditingId) {
            url += `/${currentEditingId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Categoría guardada exitosamente');
            hideCategoryForm();
            loadCategories();
        } else {
            alert('Error al guardar categoría: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Error al guardar categoría');
    }
});

// Testimonials
async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials?limit=100');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('testimonialsTableBody');
            tbody.innerHTML = '';
            
            data.data.testimonials.forEach(testimonial => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${testimonial.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${testimonial.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${testimonial.text}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="editTestimonial('${testimonial.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                        <button onclick="deleteTestimonial('${testimonial.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function showTestimonialForm() {
    document.getElementById('testimonialForm').classList.remove('hidden');
    currentEditingId = null;
    document.getElementById('testimonialFormElement').reset();
}

function hideTestimonialForm() {
    document.getElementById('testimonialForm').classList.add('hidden');
    currentEditingId = null;
}

document.getElementById('testimonialFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('testimonialName').value,
        location: document.getElementById('testimonialLocation').value,
        text: document.getElementById('testimonialText').value,
        rating: parseInt(document.getElementById('testimonialRating').value)
    };
    
    try {
        let url = '/api/testimonials';
        let method = 'POST';
        
        if (currentEditingId) {
            url += `/${currentEditingId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Testimonio guardado exitosamente');
            hideTestimonialForm();
            loadTestimonials();
        } else {
            alert('Error al guardar testimonio: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error saving testimonial:', error);
        alert('Error al guardar testimonio');
    }
});

// Orders
async function loadOrders() {
    try {
        const response = await fetch('/api/orders?limit=100', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = '';
            
            data.data.orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id.substring(0, 8)}...</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${order.total}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            ${order.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="viewOrder('${order.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                        <button onclick="updateOrderStatus('${order.id}')" class="text-green-600 hover:text-green-900">Actualizar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Utility functions
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showAdminDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

// Delete functions
async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Producto eliminado exitosamente');
                loadProducts();
            } else {
                alert('Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar producto');
        }
    }
}

async function deleteCategory(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Categoría eliminada exitosamente');
                loadCategories();
            } else {
                alert('Error al eliminar categoría');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar categoría');
        }
    }
}

async function deleteTestimonial(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este testimonio?')) {
        try {
            const response = await fetch(`/api/testimonials/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Testimonio eliminado exitosamente');
                loadTestimonials();
            } else {
                alert('Error al eliminar testimonio');
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Error al eliminar testimonio');
        }
    }
}

// Edit functions (simplified - would need to load data into forms)
function editProduct(id) {
    currentEditingId = id;
    showProductForm();

    // Cargar datos del producto en el formulario
    fetch(`/api/products/${id}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(res => {
            console.log('Response status:', res.status);
            return res.json();
        })
        .then(data => {
            console.log('Product data:', data);
            if (data.success) {
                const p = data.data;
                document.getElementById('productName').value = p.name || '';
                document.getElementById('productPrice').value = p.price || '';
                document.getElementById('productCategory').value = p.category?.id || '';
                document.getElementById('productRating').value = p.rating || '';
                document.getElementById('productDescription').value = p.description || '';
                document.getElementById('productInStock').checked = !!p.inStock;
                document.getElementById('imagePreview').innerHTML = p.image ? `<img src="${p.image}" class="image-preview rounded">` : '';
            } else {
                alert('No se pudo cargar el producto: ' + (data.error || 'Error desconocido'));
            }
        })
        .catch(err => {
            console.error('Error fetching product:', err);
            alert('Error cargando producto: ' + err.message);
        });
}

function editCategory(id) {
    currentEditingId = id;
    showCategoryForm();
    // TODO: Load category data into form
}

function editTestimonial(id) {
    currentEditingId = id;
    showTestimonialForm();
    // TODO: Load testimonial data into form
}

function viewOrder(id) {
    alert(`Ver detalles del pedido ${id}`);
    // TODO: Implement order details modal
}

function updateOrderStatus(id) {
    const newStatus = prompt('Nuevo estado (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED):');
    if (newStatus) {
        // TODO: Implement status update
        alert(`Actualizando pedido ${id} a ${newStatus}`);
    }
}

