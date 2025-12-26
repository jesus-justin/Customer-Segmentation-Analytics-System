/**
 * Landing Page JavaScript
 * Smooth scrolling, animations, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const menuLinks = navLinks.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.landing-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.landing-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe step items
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(step);
    });

    // Observe benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Animated counter for stats
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Observe hero stats for counter animation
    const heroStatsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const isPercentage = text.includes('%');
                    const isMultiplier = text.includes('x');
                    const isTime = text.includes('min');
                    const isThousands = text.includes('K');
                    
                    let value = parseFloat(text);
                    
                    if (isPercentage) {
                        animateCounter(stat, value, 1500);
                        const interval = setInterval(() => {
                            if (parseFloat(stat.textContent) >= value) {
                                stat.textContent = value + '%';
                                clearInterval(interval);
                            }
                        }, 50);
                    } else if (isThousands) {
                        animateCounter(stat, value, 1500);
                        const interval = setInterval(() => {
                            if (parseFloat(stat.textContent) >= value) {
                                stat.textContent = value + 'K+';
                                clearInterval(interval);
                            }
                        }, 50);
                    } else if (isTime) {
                        animateCounter(stat, value, 1500);
                        const interval = setInterval(() => {
                            if (parseFloat(stat.textContent) >= value) {
                                stat.textContent = value + 'min';
                                clearInterval(interval);
                            }
                        }, 50);
                    } else if (isMultiplier) {
                        let current = 1.0;
                        const increment = (value - 1.0) / 100;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= value) {
                                stat.textContent = value + 'x';
                                clearInterval(timer);
                            } else {
                                stat.textContent = current.toFixed(1) + 'x';
                            }
                        }, 20);
                    }
                });
                heroStatsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroStatsObserver.observe(heroStats);
    }

    // Add parallax effect to hero orbs
    let ticking = false;
    window.addEventListener('mousemove', function(e) {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const orbs = document.querySelectorAll('.gradient-orb');
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 20;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    orb.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Add pulse animation to preview cards
    const previewCards = document.querySelectorAll('.preview-card');
    previewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const navHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Add loading animation for images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .btn-cta, .btn-nav-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn-hero-primary, .btn-hero-secondary, .btn-cta, .btn-nav-primary {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--primary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Add typing effect to hero title (optional enhancement)
    const heroTitle = document.querySelector('.gradient-text');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let index = 0;
        
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }

    console.log('Landing page initialized successfully!');
});
