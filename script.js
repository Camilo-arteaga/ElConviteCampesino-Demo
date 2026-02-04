document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-link[data-target]');
    const megamenus = document.querySelectorAll('.megamenu');
    const header = document.querySelector('.main-header');
    let activeMenu = null;

    // Función para cerrar todos los menús
    function closeAllMenus() {
        megamenus.forEach(menu => {
            menu.classList.remove('active');
            menu.classList.remove('mobile-active');
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            item.classList.remove('mobile-open');
        });
        activeMenu = null;
    }

    // Event Delegation para el header
    // Usamos mouseenter/mouseleave para experiencia de escritorio suave

    // --- Logic with Delay (Grace Period) ---
    let closeTimeout;

    function scheduleClose() {
        closeTimeout = setTimeout(() => {
            closeAllMenus();
        }, 300); // 300ms de gracia
    }

    function cancelClose() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    }

    navItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        const targetMenu = document.getElementById(targetId);

        if (!targetMenu) return;

        // Mostrar al pasar el mouse (Desktop)
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                cancelClose();
                closeAllMenus(); // Cerrar otros instantáneamente si cambiamos de ítem
                targetMenu.classList.add('active');
                item.classList.add('active');
                activeMenu = targetMenu;
            }
        });

        // Click para Móvil (Acordeón)
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();

                const isOpen = targetMenu.classList.contains('mobile-active');

                // Resetear estados móviles antes de abrir uno nuevo
                megamenus.forEach(m => m.classList.remove('mobile-active'));
                navItems.forEach(i => i.classList.remove('mobile-open'));

                if (!isOpen) {
                    targetMenu.classList.add('mobile-active');
                    item.classList.add('mobile-open');
                }
            }
        });

        // Cierre preciso usando el nuevo botón real
        const backBtn = targetMenu.querySelector('.mobile-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic en el menú (que podría tener lógica de cierre) interfiera
                targetMenu.classList.remove('mobile-active');
                item.classList.remove('mobile-open');
            });
        }

        item.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        // Mantener abierto si estamos sobre el menú
        targetMenu.addEventListener('mouseenter', () => {
            cancelClose();
        });

        targetMenu.addEventListener('mouseleave', () => {
            scheduleClose();
        });
    });

    // Seguridad: Cerrar si salimos del header
    header.addEventListener('mouseleave', () => {
        scheduleClose();
    });
    header.addEventListener('mouseenter', () => {
        cancelClose();
    });

});

// --- Carousel Logic ---
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    // Loop logic
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideTimer() {
    stopSlideTimer(); // Prevenir múltiples intervalos
    slideInterval = setInterval(nextSlide, 5000); /* 5 segundos */
}

function stopSlideTimer() {
    clearInterval(slideInterval);
}

// Event Listeners
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideTimer(); // Reiniciar timer al interactuar
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideTimer();
    });

    // Indicators
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            showSlide(i);
            startSlideTimer();
        });
    });

    // Iniciar
    startSlideTimer();
}

// --- Hamburger Logic ---
const hamburgerBtn = document.querySelector('.hamburger-btn');
const navList = document.querySelector('.nav-list');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        // Icon toggle (optional)
        const icon = hamburgerBtn.querySelector('i');
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}
