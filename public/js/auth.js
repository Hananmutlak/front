document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('loginError');
  const submitButton = this.querySelector('button[type="submit"]');

  // Show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>Verifying...</span><div class="glow"></div>';
  errorElement.textContent = '';
  
  try {
    const API_URL = 'https://restaurant-backend-1-68of.onrender.com/api/auth/login';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Check response status first
    if (!response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        throw new Error(data.message || `Server error: ${response.status}`);
      } catch {
        throw new Error(text || `Request failed: ${response.status}`);
      }
    }

    // Parse JSON if successful
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      throw new Error('Token was not received from the server');
    }
  } catch (err) {
    errorElement.textContent = err.message || 'An unexpected error occurred';
    errorElement.style.color = '#f44336';
    console.error('Login error:', err);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = '<span>Login</span><div class="glow"></div>';
  }
});
