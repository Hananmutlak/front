// التنقل السلس
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('page-transition');
    
    setTimeout(() => {
      window.location.href = link.href;
    }, 500);
  });
});

// إدارة الخروج
document.querySelector('.logout-btn').addEventListener('click', (e) => {
  e.preventDefault();
  showConfirmModal('هل تريد حقًا تسجيل الخروج؟', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
});

// مودال التأكيد
function showConfirmModal(message, confirmCallback) {
  const modal = document.getElementById('confirmModal');
  modal.style.display = 'flex';

  modal.querySelector('.confirm-btn').onclick = () => {
    modal.style.display = 'none';
    confirmCallback();
  };

  modal.querySelector('.cancel-btn').onclick = () => {
    modal.style.display = 'none';
  };
}


document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('page-transition');
  

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      this.classList.add('ripple-effect');
      setTimeout(() => this.classList.remove('ripple-effect'), 600);
    });
  });
});