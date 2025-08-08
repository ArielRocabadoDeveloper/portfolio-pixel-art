// Portfolio JavaScript - Pixel Art Theme
class PortfolioManager {
    constructor() {
        this.introScreen = document.getElementById('intro-screen');
        this.mainPortfolio = document.getElementById('main-portfolio');
        this.navMenu = document.querySelector('.nav-menu');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupIntroAnimation();
        this.setupNavigation();
        this.setupSkillBars();
        this.setupScrollEffects();
        this.setupParticleEffects();
        this.startIntroSequence();
    }

    startIntroSequence() {
        // Auto transition after 4 seconds or manual click
        const autoTransition = setTimeout(() => {
            this.transitionToMain();
        }, 4000);

        // Manual transition on click or Enter key
        document.addEventListener('click', () => {
            clearTimeout(autoTransition);
            this.transitionToMain();
        }, { once: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                clearTimeout(autoTransition);
                this.transitionToMain();
            }
        }, { once: true });
    }

    setupIntroAnimation() {
        // Add sound effect simulation
        this.playSound8Bit();
    }

    playSound8Bit() {
        // Simulate 8-bit sound with Web Audio API
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                // Create audio context only when needed
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                
                // Resume audio context if suspended (required by modern browsers)
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                // Create a simple beep sound
                const createBeep = (frequency, duration, delay = 0) => {
                    setTimeout(() => {
                        try {
                            const oscillator = this.audioContext.createOscillator();
                            const gainNode = this.audioContext.createGain();
                            
                            oscillator.connect(gainNode);
                            gainNode.connect(this.audioContext.destination);
                            
                            oscillator.frequency.value = frequency;
                            oscillator.type = 'square'; // 8-bit style square wave
                            
                            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                            
                            oscillator.start(this.audioContext.currentTime);
                            oscillator.stop(this.audioContext.currentTime + duration);
                        } catch (error) {
                            console.log('Error playing beep sound:', error);
                        }
                    }, delay);
                };

                // Play intro sound sequence
                createBeep(440, 0.1, 100);  // A4
                createBeep(554.37, 0.1, 200); // C#5
                createBeep(659.25, 0.15, 300); // E5
            }
        } catch (error) {
            console.log('Audio not available:', error);
        }
    }

    transitionToMain() {
        if (this.introScreen.classList.contains('hidden')) return;
        
        // Initialize audio context on user interaction
        this.initializeAudioContext();
        
        // Add explosion effect
        this.createExplosionEffect();
        
        // Hide intro screen with explosion animation
        this.introScreen.classList.add('exploding');
        
        setTimeout(() => {
            this.introScreen.classList.add('hidden');
            this.mainPortfolio.classList.add('visible');
            this.initializeMainAnimations();
        }, 1000);
    }

    initializeAudioContext() {
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                
                // Resume audio context if suspended
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed successfully');
                    }).catch(error => {
                        console.log('Error resuming audio context:', error);
                    });
                }
            }
        } catch (error) {
            console.log('Error initializing audio context:', error);
        }
    }

    createExplosionEffect() {
        const particlesContainer = document.querySelector('.explosion-particles');
        const colors = ['#00D9FF', '#00FF88', '#FF0080', '#FFD700', '#8B5CF6'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 1px;
                pointer-events: none;
            `;
            
            particlesContainer.appendChild(particle);
            
            // Animate particle explosion
            const angle = (i / 30) * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const duration = 1000 + Math.random() * 500;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }

    setupNavigation() {
        // Mobile menu toggle
        this.menuToggle?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
            });
        });

        // Smooth scroll with offset for fixed nav
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Fixed nav height
                        const targetPosition = target.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Active nav link highlighting
        this.setupActiveNavHighlighting();
    }

    setupActiveNavHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section's nav link
                    const currentLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active');
                    }
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' });

        sections.forEach(section => observer.observe(section));
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const level = bar.getAttribute('data-level');
                if (level) {
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, Math.random() * 500 + 200);
                }
            });
        };

        // Animate skill bars when they come into view
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(skillsSection);
        }
    }

    setupScrollEffects() {
        // Parallax effect for floating pixels
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-pixels');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Reveal animations for sections
        const revealElements = document.querySelectorAll('.section');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    setupParticleEffects() {
        // Create floating pixel background
        this.createFloatingPixels();
        
        // Add hover effects to interactive elements
        this.setupHoverEffects();
    }

    createFloatingPixels() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const createPixel = () => {
            const pixel = document.createElement('div');
            const colors = ['#00D9FF', '#00FF88', '#FF0080', '#FFD700'];
            const size = Math.random() * 3 + 2;
            
            pixel.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 1px;
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * 100}%;
                top: 100%;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            
            heroSection.appendChild(pixel);
            
            // Animate pixel upward
            pixel.animate([
                { 
                    transform: 'translateY(0px) rotate(0deg)',
                    opacity: pixel.style.opacity
                },
                { 
                    transform: 'translateY(-100vh) rotate(360deg)',
                    opacity: 0
                }
            ], {
                duration: Math.random() * 10000 + 15000,
                easing: 'linear'
            }).onfinish = () => {
                if (pixel.parentNode) {
                    pixel.parentNode.removeChild(pixel);
                }
            };
        };

        // Create pixels periodically
        setInterval(createPixel, 2000);
        
        // Create initial batch
        for (let i = 0; i < 5; i++) {
            setTimeout(createPixel, i * 400);
        }
    }

    setupHoverEffects() {
        // Add glitch effect to buttons and interactive elements
        const interactiveElements = document.querySelectorAll('.nav-link, .contact-item, .cert-item, .exp-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addGlitchEffect(element);
            });
            
            // Add click sound effect
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    playClickSound() {
        try {
            if (this.audioContext && this.audioContext.state === 'running') {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = 800; // Higher pitch for clicks
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        } catch (error) {
            console.log('Error playing click sound:', error);
        }
    }

    addGlitchEffect(element) {
        const glitch = element.cloneNode(true);
        glitch.style.cssText += `
            position: absolute;
            top: 0;
            left: 2px;
            color: #FF0080;
            opacity: 0.5;
            z-index: -1;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glitch);
        
        // Remove glitch effect after short duration
        setTimeout(() => {
            if (glitch.parentNode) {
                glitch.parentNode.removeChild(glitch);
            }
        }, 150);
    }

    initializeMainAnimations() {
        // Animate elements on main portfolio reveal
        const animatedElements = document.querySelectorAll('.hero-content > *, .pixel-avatar');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150 + 200);
        });

        // Initialize language progress bars
        setTimeout(() => {
            const languageProgressBars = document.querySelectorAll('.language-progress');
            languageProgressBars.forEach(bar => {
                const width = bar.classList.contains('native') ? '100%' : 
                             bar.classList.contains('basic') ? '30%' : '0%';
                bar.style.width = width;
            });
        }, 1000);
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Add CSS class for revealed sections
const style = document.createElement('style');
style.textContent = `
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: var(--pixel-green) !important;
        border-color: var(--pixel-green) !important;
        box-shadow: 0 0 10px var(--pixel-green) !important;
    }
`;
document.head.appendChild(style);