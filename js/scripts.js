// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(44, 44, 44, 0.95)';
        header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'rgba(44, 44, 44, 0.85)';
        header.style.boxShadow = 'none';
    }
});

// Night mode toggle
const nightModeBtn = document.getElementById('nightModeBtn');
if (nightModeBtn) {
    nightModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        
        if (document.body.classList.contains('night-mode')) {
            nightModeBtn.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#f8f9fa';
        } else {
            nightModeBtn.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
            document.body.style.backgroundColor = '#f8f9fa';
            document.body.style.color = '#333';
        }
    });
}