// Check for valid token
    document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
      } else {
        fetchProducts();
      }
      
      // New product button
      document.getElementById('newProductBtn').addEventListener('click', () => {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('formTitle').textContent = 'Add New Product';
        document.getElementById('submitBtn').textContent = 'Save Product';
        
        // Scroll to form
        document.getElementById('formContainer').scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    
    // DOM elements
    const container = document.getElementById('productsContainer');
    const form = document.getElementById('productForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const alertMessage = document.getElementById('alertMessage');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    // Base API
    const API_BASE = 'https://restaurant-backend-1-68of.onrender.com/api';
    
    // Function to show alerts
    function showAlert(message, type = 'success') {
      alertMessage.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      `;
      alertMessage.className = `alert alert-${type}`;
      alertMessage.style.display = 'flex';
      
      setTimeout(() => {
        alertMessage.style.display = 'none';
      }, 5000);
    }
    
    // Function to load products
    async function fetchProducts() {
      try {
        loadingIndicator.style.display = 'block';
        container.innerHTML = '';
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        renderProducts(products);
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
        console.error('Error fetching products:', error);
      } finally {
        loadingIndicator.style.display = 'none';
      }
    }
    
    // Function to render products
    function renderProducts(products) {
      container.innerHTML = '';
      
      if (products.length === 0) {
        container.innerHTML = `
          <div class="empty-products">
            <i class="fas fa-pizza-slice"></i>
            <h3>No Products Found</h3>
            <p>Add your first product using the form below</p>
          </div>
        `;
        return;
      }
      
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <div class="product-header">
            <h3>${product.name}</h3>
          </div>
          <div class="product-body">
            <p>${product.description || 'No description available'}</p>
            <div class="product-price">${product.price} SEK</div>
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-status ${product.isAvailable ? 'product-available' : 'product-unavailable'}">
              <i class="fas ${product.isAvailable ? 'fa-check-circle' : 'fa-times-circle'}"></i>
              ${product.isAvailable ? 'Available' : 'Unavailable'}
            </div>
            <div class="product-actions">
              <button class="btn btn-edit" onclick="editProduct('${product._id}')">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-delete" onclick="deleteProduct('${product._id}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        `;
        container.appendChild(productCard);
      });
    }
    
    // Function to get category name
    function getCategoryName(category) {
      const categories = {
        'pizza': 'Pizza',
        'appetizer': 'Appetizer',
        'dessert': 'Dessert',
        'drink': 'Drink'
      };
      return categories[category] || category;
    }
    
    // Function to edit product
    async function editProduct(id) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const product = await response.json();
        
        // Fill the form
        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productAvailable').checked = product.isAvailable;
        
        formTitle.textContent = 'Edit Product';
        submitBtn.textContent = 'Update Product';
        
        // Scroll to form
        document.getElementById('formContainer').scrollIntoView({
          behavior: 'smooth'
        });
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
    
    // Function to delete product
    async function deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        showAlert('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('productId').value;
      const name = document.getElementById('productName').value;
      const description = document.getElementById('productDescription').value;
      const price = document.getElementById('productPrice').value;
      const category = document.getElementById('productCategory').value;
      const isAvailable = document.getElementById('productAvailable').checked;
      
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        isAvailable
      };
      
      const token = localStorage.getItem('token');
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
      
      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save product');
        }
        
        const result = await response.json();
        
        showAlert(
          id ? 'Product updated successfully' : 'Product added successfully', 
          'success'
        );
        
        // Reset form
        form.reset();
        document.getElementById('productId').value = '';
        formTitle.textContent = 'Add New Product';
        submitBtn.textContent = 'Save Product';
        
        // Reload products
        fetchProducts();
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = id ? '<i class="fas fa-sync-alt"></i> Update Product' : '<i class="fas fa-save"></i> Save Product';
      }
    });
    
    // Cancel button
    document.getElementById('resetBtn').addEventListener('click', () => {
      form.reset();
      document.getElementById('productId').value = '';
      formTitle.textContent = 'Add New Product';
      submitBtn.textContent = 'Save Product';
    });
    
    // Logout function
    window.logout = function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    };
    
   