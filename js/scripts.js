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