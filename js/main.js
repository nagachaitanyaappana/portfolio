// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });
}

// Update copyright year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
}

// Smooth scroll offset for fixed header (additional safety)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            e.preventDefault();
            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    });
});

// Highlight the nav link of the section currently in view
const sectionLinks = Array.from(navLinks).filter(l => l.getAttribute('href')?.startsWith('#'));
const linkById = new Map(sectionLinks.map(l => [l.getAttribute('href').slice(1), l]));
if ('IntersectionObserver' in window && linkById.size) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach(l => l.classList.remove('is-active'));
            linkById.get(entry.target.id)?.classList.add('is-active');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    linkById.forEach((_, id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

// Profile photo: shows assets/profile.jpg or assets/profile.png if present,
// otherwise the initials placeholder stays in place.
const avatar = document.getElementById('avatar');
if (avatar) {
    const photoSources = ['assets/profile.jpg', 'assets/profile.png'];
    const tryPhoto = index => {
        if (index >= photoSources.length) return;
        const img = new Image();
        img.alt = 'Photo of Appana Naga Chaitanya';
        img.onload = () => avatar.replaceChildren(img);
        img.onerror = () => tryPhoto(index + 1);
        img.src = photoSources[index];
    };
    tryPhoto(0);
}
