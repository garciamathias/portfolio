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

// Cartes
const terminalContent = [
    {
        prompt: "cat my_journey.txt",
        text: `My Journey

Growing up fascinated by technology and sustainable development, I've always been driven by the desire to create positive impact through innovation. At HEC Paris, I've found the perfect intersection of business acumen and technological advancement.

[Innovation] [Technology] [HEC Paris]`
    },
    {
        prompt: "cat my_vision.txt",
        text: `My Vision

I believe in a future where technology and sustainability coexist harmoniously. My focus lies in developing and promoting solutions that leverage cutting-edge technology to address environmental challenges.

[Green Tech] [AI] [Sustainability]`
    },
    {
        prompt: "cat my_approach.txt",
        text: `My Approach

Combining analytical thinking with creative problem-solving, I tackle challenges through a multi-disciplinary lens. My experience in both technical and business domains bridges gaps between innovation and implementation.

[Analytics] [Creativity] [Strategy]`
    }
];

class Terminal {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.currentContentIndex = 0;
        this.isTyping = false;
    }

    async typeText(text, speed = 30) {
        this.isTyping = true;
        let index = 0;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    this.element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    this.isTyping = false;
                    resolve();
                }
            }, speed);
        });
    }

    async eraseText(speed = 30) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.element.textContent.length > 0) {
                    this.element.textContent = this.element.textContent.slice(0, -1);
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    async displayContent() {
        while (true) {
            const content = terminalContent[this.currentContentIndex];
            
            // Type prompt
            await this.typeText(content.prompt, 50);
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.eraseText(30);
            
            // Type content
            await this.typeText(content.text, 30);
            
            // Wait before erasing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Erase content
            await this.eraseText(10);
            
            // Move to next content
            this.currentContentIndex = (this.currentContentIndex + 1) % terminalContent.length;
            
            // Small pause before next iteration
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new Terminal('terminal-text');
    terminal.displayContent();
});