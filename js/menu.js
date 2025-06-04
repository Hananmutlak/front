   // Mobile menu functionality
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        const mobileOverlay = document.getElementById('mobileOverlay');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.mobile-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        });

        // Menu loading functionality
        document.addEventListener('DOMContentLoaded', () => {
            const API_URL = 'https://restaurant-backend-1-68of.onrender.com/api/products';
            const menuContainer = document.getElementById('menuContainer');
            const categoryButtons = document.querySelectorAll('.category-btn');

            // Function to fetch and display products
            async function loadMenu(category = 'pizza') {
                try {
                    menuContainer.innerHTML = '<div class="loading">Loading menu...</div>';
                    
                    const response = await fetch(`${API_URL}?category=${category}`);
                    if (!response.ok) throw new Error('Error fetching data');
                    
                    const products = await response.json();
                    renderMenu(products, category);
                } catch (error) {
                    menuContainer.innerHTML = `<div class="error">${error.message}</div>`;
                }
            }

            // Function to render products
            function renderMenu(products, category) {
                if (products.length === 0) {
                    menuContainer.innerHTML = `<div class="empty">No products in this category</div>`;
                    return;
                }

                let menuHTML = '';
                
                // Pizza section
                if (category === 'pizza') {
                    menuHTML = `
                        <table class="pizza-table">
                            <thead>
                                <tr>
                                    <th>Pizza</th>
                                    <th>Ingredients</th>
                                    <th>Price (sek)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(product => `
                                    <tr>
                                        <td>
                                            <div class="pizza-type">
                                                <i class="fas fa-pizza-slice pizza-icon"></i>
                                                ${product.name}
                                            </div>
                                        </td>
                                        <td>${product.description || 'No description'}</td>
                                        <td>${product.price}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                }
                // Other sections
                else {
                    menuHTML = `
                        <div class="menu-grid">
                            ${products.map(product => `
                                <div class="menu-item">
                                    <div class="item-header">
                                        <h3>${product.name}</h3>
                                        <span class="item-price">${product.price} sek</span>
                                    </div>
                                    <p class="item-description">${product.description || 'No description available'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
                
                menuContainer.innerHTML = menuHTML;
            }

            // Switch categories
            categoryButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    categoryButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    loadMenu(btn.dataset.category);
                });
            });

            // Load initial menu
            loadMenu();
        });
