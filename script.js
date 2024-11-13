// Cache des sélecteurs DOM avec vérification d'existence
const DOM = {
    cursor: document.querySelector('.cursor'),
    cursorFollower: document.querySelector('.cursor-follower'),
    shapes: document.querySelectorAll('.shape'),
    heroContent: document.querySelector('.hero-content'),
    glitchText: document.querySelector('.glitch'),
    tags: document.querySelectorAll('.tag'),
    infoCards: document.querySelectorAll('.info-card'),
    sections: document.querySelectorAll('section'),
    navLinks: document.querySelectorAll('.cyber-link'), // Corrigé pour matcher le HTML
    menuBtn: document.querySelector('.menu-btn'),
    navMenu: document.querySelector('.nav-menu'),
    toggleBtn: document.querySelector('.toggle-button'),
    toggleText: document.querySelector('.toggle-text')
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
    },
    parallax: {
        intensity: 0.1,
        maxTilt: 10
    }
};

// État global
const STATE = {
    mouse: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 },
    follower: { x: 0, y: 0 },
    menuOpen: false,
    lastScroll: 0,
    isAnimating: false
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
    },

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
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

        document.querySelectorAll('a, button, .info-card, .tag').forEach(element => {
            element.addEventListener('mouseenter', () => this.scaleUp());
            element.addEventListener('mouseleave', () => this.scaleDown());
        });
    },

    scaleUp() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        DOM.cursor.style.transform = `translate(${STATE.cursor.x}px, ${STATE.cursor.y}px) scale(1.5)`;
        DOM.cursorFollower.style.transform = `translate(${STATE.follower.x}px, ${STATE.follower.y}px) scale(1.5)`;
    },

    scaleDown() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        DOM.cursor.style.transform = `translate(${STATE.cursor.x}px, ${STATE.cursor.y}px) scale(1)`;
        DOM.cursorFollower.style.transform = `translate(${STATE.follower.x}px, ${STATE.follower.y}px) scale(1)`;
    },

    animate() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        
        STATE.cursor.x = utils.lerp(STATE.cursor.x, STATE.mouse.x, CONFIG.cursor.mainSpeed);
        STATE.cursor.y = utils.lerp(STATE.cursor.y, STATE.mouse.y, CONFIG.cursor.mainSpeed);
        STATE.follower.x = utils.lerp(STATE.follower.x, STATE.mouse.x, CONFIG.cursor.followerSpeed);
        STATE.follower.y = utils.lerp(STATE.follower.y, STATE.mouse.y, CONFIG.cursor.followerSpeed);

        DOM.cursor.style.transform = `translate(${STATE.cursor.x}px, ${STATE.cursor.y}px)`;
        DOM.cursorFollower.style.transform = `translate(${STATE.follower.x}px, ${STATE.follower.y}px)`;

        requestAnimationFrame(() => this.animate());
    }
};

// Gestionnaire des effets 3D
const Effects3DManager = {
    init() {
        if (!DOM.heroContent) return;
        this.bindEvents();
        this.apply3DToElements();
    },

    bindEvents() {
        const handleMouseMove = utils.debounce((e) => {
            if (DOM.heroContent) this.updateHeroParallax(e);
            if (DOM.shapes) this.updateShapesParallax(e);
            this.updateGlobalParallax(e);
        }, 10);

        document.addEventListener('mousemove', handleMouseMove);
    },

    updateHeroParallax(e) {
        if (!DOM.heroContent) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;
        
        DOM.heroContent.style.transform = `
            perspective(1000px)
            rotateX(${yPercent * CONFIG.parallax.maxTilt}deg)
            rotateY(${xPercent * CONFIG.parallax.maxTilt}deg)
        `;
    },

    updateShapesParallax(e) {
        if (!DOM.shapes) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        DOM.shapes.forEach((shape, index) => {
            const depth = (index + 1) * 0.2;
            const xMove = (clientX - innerWidth / 2) * depth;
            const yMove = (clientY - innerHeight / 2) * depth;

            shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    },

    apply3DToElements() {
        document.querySelectorAll('.glass-card, .info-card').forEach(element => {
            this.apply3DEffect(element);
        });

        if (DOM.tags) {
            DOM.tags.forEach(tag => this.apply3DToTag(tag));
        }
    },

    apply3DEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = utils.clamp((y - centerY) / 10, -CONFIG.parallax.maxTilt, CONFIG.parallax.maxTilt);
            const rotateY = utils.clamp((centerX - x) / 10, -CONFIG.parallax.maxTilt, CONFIG.parallax.maxTilt);
            
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
    },

    apply3DToTag(tag) {
        tag.addEventListener('mousemove', (e) => {
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            tag.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
};

// Gestionnaire du thème
const ThemeManager = {
    init() {
        if (!DOM.toggleBtn || !DOM.toggleText) return;
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        this.bindEvents();
    },

    bindEvents() {
        DOM.toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (DOM.toggleText) {
            DOM.toggleText.textContent = theme.toUpperCase();
        }
        localStorage.setItem('theme', theme);
        
        const colors = theme === 'light' 
            ? { primary: '#ff3366', secondary: '#0088cc' }
            : { primary: '#ff3366', secondary: '#33ccff' };
            
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
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
            { 
                threshold: CONFIG.animation.threshold, 
                rootMargin: CONFIG.animation.rootMargin 
            }
        );

        if (DOM.sections) DOM.sections.forEach(section => observer.observe(section));
        if (DOM.infoCards) DOM.infoCards.forEach(card => observer.observe(card));
    }
};

// Gestionnaire de scroll
const ScrollManager = {
    init() {
        window.addEventListener('scroll', utils.debounce(this.handleScroll.bind(this), 10));
    },

    handleScroll() {
        if (!DOM.sections) return;
        
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
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    CursorManager.init();
    Effects3DManager.init();
    IntersectionManager.init();
    ThemeManager.init();
    ScrollManager.init();
});