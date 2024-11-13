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

// Ajoutez ces nouvelles fonctions au script.js

// Effet de carte 3D au survol
function apply3DEffect(element) {
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

// Appliquer l'effet 3D aux cartes
document.querySelectorAll('.glass-card, .info-card, .project-card').forEach(card => {
    apply3DEffect(card);
});

// Parallaxe 3D amélioré
document.addEventListener('mousemove', (e) => {
    const depth = 30;
    const moveX = (e.clientX - window.innerWidth / 2) / depth;
    const moveY = (e.clientY - window.innerHeight / 2) / depth;

    document.querySelector('.hero-content').style.transform = 
        `translateX(${moveX}px) translateY(${moveY}px) translateZ(50px)`;

    // Effet sur les shapes avec différentes profondeurs
    document.querySelectorAll('.shape').forEach((shape, index) => {
        const factor = (index + 1) * 0.2;
        shape.style.transform = `
            translate3d(${moveX * factor}px, ${moveY * factor}px, ${50 * factor}px)
            rotate3d(${moveY * 0.1}, ${moveX * 0.1}, 0, ${(moveX + moveY) * factor}deg)
        `;
    });
});

// Animation smooth des sections au scroll
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
    sections.forEach(section => {
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

// Effet de profondeur sur le texte du hero
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    document.addEventListener('mousemove', (e) => {
        const rect = glitchText.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        glitchText.style.transform = `
            perspective(1000px)
            rotateX(${y * 0.01}deg)
            rotateY(${x * 0.01}deg)
            translateZ(50px)
        `;
    });
}

// Effet de survol 3D sur les tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mousemove', (e) => {
        const rect = tag.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 5;
        const rotateY = (centerX - x) / 5;
        
        tag.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(15px)
        `;
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'none';
    });
});

// Ajoutez ce code à votre script.js

// Navigation active state
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// Intersection Observer pour la navigation
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => navObserver.observe(section));

// Effet de scroll sur la navigation
let lastScroll = 0;
const nav = document.querySelector('.nav-container');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    } else if (currentScroll > lastScroll) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Animation du logo au hover
const logo = document.querySelector('.logo-glitch');
logo.addEventListener('mouseover', () => {
    logo.style.animation = 'none';
    logo.offsetHeight; // Trigger reflow
    logo.style.animation = null;
});

// Gestion du thème
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? 
        `<svg class="sun-icon" viewBox="0 0 24 24"><!-- Sun icon SVG --></svg>` :
        `<svg class="moon-icon" viewBox="0 0 24 24"><!-- Moon icon SVG --></svg>`;
}

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const navLinksContainer = document.querySelector('.nav-links-container');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// Effet de hover 3D sur les liens
navLinks.forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const dx = x - xc;
        const dy = y - yc;
        
        link.style.transform = `perspective(1000px) rotateX(${dy / -5}deg) rotateY(${dx / 5}deg) translateZ(10px)`;
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Ajoutez ce code dans script.js
// Animation des éléments de la timeline au scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
  timelineObserver.observe(item);
});

// Nouveau JavaScript pour les animations
document.addEventListener('DOMContentLoaded', () => {
    const events = document.querySelectorAll('.cyber-event');
    const progressBar = document.querySelector('.progress-indicator');
    
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const eventObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          updateProgress();
        }
      });
    }, observerOptions);
    
    events.forEach(event => {
      eventObserver.observe(event);
      
      // Effet 3D au hover
      const card = event.querySelector('.event-card');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(50px)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
    
    function updateProgress() {
      const activeEvents = document.querySelectorAll('.cyber-event.active');
      const progress = (activeEvents.length / events.length) * 100;
      progressBar.style.height = `${progress}%`;
    }
    
    // Effet de parallaxe sur le grid background
    document.addEventListener('mousemove', (e) => {
      const grid = document.querySelector('.cyber-grid-background');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      grid.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
  });
