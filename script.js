document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Función para inicializar sliders
    function initializeSlider(sliderContainer) {
        const slider = sliderContainer.querySelector('.destinos-slider, .servicios-slider');
        const prevButton = sliderContainer.querySelector('.slider-button.prev');
        const nextButton = sliderContainer.querySelector('.slider-button.next');
        const dotsContainer = sliderContainer.nextElementSibling;
        const cards = slider.querySelectorAll('.destino-card, .servicio-card');

        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 32; // Ancho de la tarjeta + gap
        const cardsPerView = Math.floor(slider.offsetWidth / cardWidth);
        const maxIndex = Math.max(0, cards.length - cardsPerView);

        // Crear dots
        cards.forEach((_, index) => {
            if (index <= maxIndex) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            }
        });

        function updateDots() {
            sliderContainer.nextElementSibling.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            slider.scrollLeft = currentIndex * cardWidth;
            updateDots();
        }

        function slideNext() {
            goToSlide(currentIndex + 1);
        }

        function slidePrev() {
            goToSlide(currentIndex - 1);
        }

        // Event Listeners
        nextButton.addEventListener('click', slideNext);
        prevButton.addEventListener('click', slidePrev);

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    slideNext();
                } else {
                    slidePrev();
                }
            }
        });

        // Resize handler
        return function handleResize() {
            const newCardsPerView = Math.floor(slider.offsetWidth / cardWidth);
            if (newCardsPerView !== cardsPerView) {
                goToSlide(0);
            }
        };
    }

    // Inicializar todos los sliders
    const sliderContainers = document.querySelectorAll('.slider-container');
    const resizeHandlers = [];

    sliderContainers.forEach(container => {
        resizeHandlers.push(initializeSlider(container));
    });

    // Manejar resize para todos los sliders
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeHandlers.forEach(handler => handler());
        }, 250);
    });

    // Desplazamiento suave para los enlaces del menú
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value
            };

            alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }

    // Cerrar el menú cuando se presiona la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});
