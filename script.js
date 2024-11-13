// Cache des sélecteurs DOM
const DOM = {
    cursor: document.querySelector('.cursor'),
    cursorFollower: document.querySelector('.cursor-follower'),
    shapes: document.querySelectorAll('.shape'),
    heroContent: document.querySelector('.hero-content'),
    glitchText: document.querySelector('.glitch'),
    tags: document.querySelectorAll('.tag'),
    infoCards: document.querySelectorAll('.info-card'),
    sections: document.querySelectorAll('section'),
    navLinks: document.querySelectorAll('.nav-link'),
    menuBtn: document.querySelector('.menu-btn'),
    navLinksContainer: document.querySelector('.nav-links-container'),
    aboutCards: document.querySelectorAll('.about-card')
};

// Configuration globale
const CONFIG = {
    cursor: {
        mainSpeed: 0.1,
        followerSpeed: 0.05
    },
    animation: {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    }
};

// État global
const STATE = {
    mouse: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 },
    follower: { x: 0, y: 0 },
    menuOpen: false,
    lastScroll: 0
};

// Utilitaires
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
};

// Gestionnaire du curseur personnalisé
const CursorManager = {
    init() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        this.bindEvents();
        this.animate();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            STATE.mouse.x = e.clientX;
            STATE.mouse.y = e.clientY;
        });

        document.querySelectorAll('a, button').forEach(element => {
            element.addEventListener('mouseenter', () => this.scaleUp());
            element.addEventListener('mouseleave', () => this.scaleDown());
        });
    },

    scaleUp() {
        DOM.cursor.style.transform = 'scale(1.5)';
        DOM.cursorFollower.style.transform = 'scale(1.5)';
    },

    scaleDown() {
        DOM.cursor.style.transform = 'scale(1)';
        DOM.cursorFollower.style.transform = 'scale(1)';
    },

    animate() {
        STATE.cursor.x = utils.lerp(STATE.cursor.x, STATE.mouse.x, CONFIG.cursor.mainSpeed);
        STATE.cursor.y = utils.lerp(STATE.cursor.y, STATE.mouse.y, CONFIG.cursor.mainSpeed);
        STATE.follower.x = utils.lerp(STATE.follower.x, STATE.mouse.x, CONFIG.cursor.followerSpeed);
        STATE.follower.y = utils.lerp(STATE.follower.y, STATE.mouse.y, CONFIG.cursor.followerSpeed);

        DOM.cursor.style.transform = `translate(${STATE.cursor.x}px, ${STATE.cursor.y}px)`;
        DOM.cursorFollower.style.transform = `translate(${STATE.follower.x}px, ${STATE.follower.y}px)`;

        requestAnimationFrame(() => this.animate());
    }
};

// Gestionnaire des animations 3D
const Effects3DManager = {
    init() {
        this.bindEvents();
        this.apply3DToElements();
    },

    bindEvents() {
        const handleMouseMove = utils.debounce((e) => {
            this.updateParallax(e);
            this.updateHeroParallax(e);
            this.updateShapesParallax(e);
        }, 10);

        document.addEventListener('mousemove', handleMouseMove);
    },

    apply3DToElements() {
        document.querySelectorAll('.glass-card, .info-card').forEach(element => {
            this.apply3DEffect(element);
        });

        DOM.tags.forEach(tag => {
            this.apply3DToTag(tag);
        });

        DOM.aboutCards.forEach(card => {
            this.apply3DEffect(card);
        });
    },

    apply3DEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
            `;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
};

// Gestionnaire de l'intersection observer
const IntersectionManager = {
    init() {
        this.setupObservers();
    },

    setupObservers() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: CONFIG.animation.threshold, rootMargin: CONFIG.animation.rootMargin }
        );

        DOM.sections.forEach(section => observer.observe(section));
        DOM.infoCards.forEach(card => observer.observe(card));
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    CursorManager.init();
    Effects3DManager.init();
    IntersectionManager.init();
});

// Gestion des événements de scroll
const handleScroll = utils.debounce(() => {
    const currentScroll = window.pageYOffset;
    
    requestAnimationFrame(() => {
        DOM.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                section.style.transform = `
                    perspective(1000px)
                    translateZ(${scrollPercent * 50}px)
                    scale(${0.95 + (scrollPercent * 0.05)})
                `;
            }
        });
    });

    STATE.lastScroll = currentScroll;
}, 10);

window.addEventListener('scroll', handleScroll);