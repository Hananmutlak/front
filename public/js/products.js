async function loadProducts() {
  try {
    const products = await apiRequest('/products'); 
    const container = document.getElementById('productList');
    container.innerHTML = '';

    products.forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${p.title}</h3>
        <p>Price: ${p.price}</p>
        <p>${p.description}</p>
        <button onclick="deleteProduct('${p._id}')"> Delete</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    alert('Error loading products');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await apiRequest(`/products/${id}`, 'DELETE');
    loadProducts();
  } catch (err) {
    alert('Failed to delete the product');
  }
}

document.getElementById('addProductForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;

  try {
    await apiRequest('/products', 'POST', { title, price, description });
    loadProducts();
    this.reset();
  } catch (err) {
    alert('Failed to add the product');
  }
});

loadProducts();
