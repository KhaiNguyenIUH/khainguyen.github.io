// Optional: Implement fade-in effect on scroll
const features = document.querySelectorAll('.feature');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    features.forEach(feature => {
        const offsetTop = feature.offsetTop;
        if (scrollY > offsetTop - window.innerHeight / 1.3) {
            feature.style.opacity = 1;
            feature.style.transform = 'translateY(0)';
        }
    });
});

// Initial fade-in setup
features.forEach(feature => {
    feature.style.opacity = 0;
    feature.style.transform = 'translateY(50px)';
    feature.style.transition = 'opacity 0.8s, transform 0.8s';
});
