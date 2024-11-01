// Curseur personnalisé
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation fluide du curseur
function animateCursor() {
    // Animation du curseur principal
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Animation du suiveur
    followerX += (mouseX - followerX) * 0.05;
    followerY += (mouseY - followerY) * 0.05;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Effet hover sur les liens
const links = document.querySelectorAll('a, button, .project-card, .blog-card');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Animation au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section, .glass-card, .project-card, .blog-card').forEach(element => {
    observer.observe(element);
});

// Navigation smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('show');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('show');
        menuOpen = false;
    }
});

// Effet parallaxe pour les formes flottantes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        const moveX = (x - 0.5) * speed * 100;
        const moveY = (y - 0.5) * speed * 100;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Animation des compétences
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });
}

// Déclenchement de l'animation des compétences au scroll
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillsObserver.observe(skillsSection);
}

// Effet de glitch sur le texte
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        glitchText.classList.add('active');
        setTimeout(() => {
            glitchText.classList.remove('active');
        }, 200);
    }, 3000);
}

// Loader de page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Effet de scroll reveal pour les projets
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// Animation du texte de la section hero
const heroText = document.querySelector('.hero-content');
if (heroText) {
    window.addEventListener('load', () => {
        heroText.classList.add('animate');
    });
}

// Gestion du mode sombre/clair
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
function toggleTheme(e) {
    if (e.matches) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}
prefersDarkScheme.addListener(toggleTheme);
toggleTheme(prefersDarkScheme);

// Animation des tags
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
    tag.addEventListener('mouseover', () => {
        tag.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    tag.addEventListener('mouseout', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// Animation des info-cards au scroll
const infoCards = document.querySelectorAll('.info-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

infoCards.forEach(card => {
    observer.observe(card);
});

// Effet de parallaxe pour le texte du hero
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-content');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    hero.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});