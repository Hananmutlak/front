// ملف auth.js المعدل
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('loginError');
  const submitButton = this.querySelector('button[type="submit"]');

  // إظهار حالة التحميل
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>جاري التحقق...</span><div class="glow"></div>';
  errorElement.textContent = '';
  
  try {
    // المسار الصحيح - بدون // الزائدة
    const API_URL = 'https://restaurant-backend-aelo.onrender.com/api/auth/login';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // التحقق من حالة الرد أولاً
    if (!response.ok) {
      // إذا كان الرد غير ناجح، حاول قراءة النص أولاً
      const text = await response.text();
      try {
        // حاول تحليل النص كـ JSON
        const data = JSON.parse(text);
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      } catch {
        // إذا فشل التحليل، استخدم النص كما هو
        throw new Error(text || `طلب فاشل: ${response.status}`);
      }
    }

    // إذا كان الرد ناجحاً، حلل البيانات كـ JSON
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      throw new Error('لم يتم استلام التوكن من الخادم');
    }
  } catch (err) {
    errorElement.textContent = err.message || 'حدث خطأ غير متوقع';
    errorElement.style.color = '#f44336';
    console.error('Login error:', err);
  } finally {
    // إعادة تعيين حالة الزر
    submitButton.disabled = false;
    submitButton.innerHTML = '<span>دخول</span><div class="glow"></div>';
  }
});