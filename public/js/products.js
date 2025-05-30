// js/products.js

async function loadProducts() {
  try {
    const products = await apiRequest('/products'); // ← API endpoint
    const container = document.getElementById('productList');
    container.innerHTML = '';

    products.forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${p.title}</h3>
        <p>السعر: ${p.price}</p>
        <p>${p.description}</p>
        <button onclick="deleteProduct('${p._id}')">🗑️ حذف</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    alert('خطأ في تحميل المنتجات');
  }
}

async function deleteProduct(id) {
  if (!confirm('هل أنت متأكد من حذف المنتج؟')) return;
  try {
    await apiRequest(`/products/${id}`, 'DELETE');
    loadProducts();
  } catch (err) {
    alert('فشل الحذف');
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
    alert('فشل في إضافة المنتج');
  }
});

loadProducts();
