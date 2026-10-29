/**
 * SkillCraft Studio — Core JavaScript
 * Handles navigation styling on scroll, mobile drawer, theme toggle,
 * portfolio filtering, contact form validation, and scroll-to-top.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Navigation Scroll State & Active Section Highlighting
    // -------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('header[id], section[id]');
    const backToTopBtn = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Toggle scrolled styling on navbar (task requirement: change color/style on scroll)
        if (navbar) {
            if (scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Toggle Back-to-Top Button
        if (backToTopBtn) {
            if (scrollY > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Update active navigation link based on current section
        const navHeight = navbar ? navbar.offsetHeight : 70;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // -------------------------------------------------------------------------
    // 2. Mobile Menu Drawer
    // -------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');
    const menuBackdrop = document.getElementById('menuBackdrop');

    const closeMobileMenu = () => {
        if (hamburgerBtn && navMenu) {
            hamburgerBtn.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('open');
        }
        if (menuBackdrop) {
            menuBackdrop.classList.remove('open');
        }
    };

    const toggleMobileMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            hamburgerBtn.classList.add('open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            navMenu.classList.add('open');
            if (menuBackdrop) {
                menuBackdrop.classList.add('open');
            }
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // -------------------------------------------------------------------------
    // 3. Theme Toggle (Dark / Light Mode)
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('skillcraft_theme');

    // Apply saved theme or system preference
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('skillcraft_theme', isLight ? 'light' : 'dark');
        });
    }

    // -------------------------------------------------------------------------
    // 4. Portfolio Category Filtering
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 5. Contact Form Validation & Feedback Toast
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    const showToast = (message = 'Thank you! Your message has been sent successfully.') => {
        if (!toast) return;
        const toastMsgEl = document.getElementById('toastMessage');
        if (toastMsgEl) {
            toastMsgEl.textContent = message;
        }

        toast.classList.add('show');
        toast.setAttribute('aria-hidden', 'false');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        }, 4000);
    };

    const setError = (inputId, errorId, message) => {
        const inputEl = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (inputEl) inputEl.classList.add('input-error');
        if (errorEl) errorEl.textContent = message;
    };

    const clearError = (inputId, errorId) => {
        const inputEl = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (inputEl) inputEl.classList.remove('input-error');
        if (errorEl) errorEl.textContent = '';
    };

    if (contactForm) {
        // Clear errors on input
        ['userName', 'userEmail', 'userSubject', 'userMessage'].forEach(fieldId => {
            const el = document.getElementById(fieldId);
            if (el) {
                el.addEventListener('input', () => {
                    const errorMap = {
                        userName: 'nameError',
                        userEmail: 'emailError',
                        userSubject: 'subjectError',
                        userMessage: 'messageError'
                    };
                    clearError(fieldId, errorMap[fieldId]);
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const name = document.getElementById('userName');
            const email = document.getElementById('userEmail');
            const subject = document.getElementById('userSubject');
            const message = document.getElementById('userMessage');

            // Name validation
            if (!name || !name.value.trim()) {
                setError('userName', 'nameError', 'Please enter your name.');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                setError('userName', 'nameError', 'Name must be at least 2 characters.');
                isValid = false;
            } else {
                clearError('userName', 'nameError');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !email.value.trim()) {
                setError('userEmail', 'emailError', 'Please enter your email address.');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                setError('userEmail', 'emailError', 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError('userEmail', 'emailError');
            }

            // Subject validation
            if (!subject || !subject.value.trim()) {
                setError('userSubject', 'subjectError', 'Please enter a subject.');
                isValid = false;
            } else {
                clearError('userSubject', 'subjectError');
            }

            // Message validation
            if (!message || !message.value.trim()) {
                setError('userMessage', 'messageError', 'Please enter your message.');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                setError('userMessage', 'messageError', 'Message should be at least 10 characters.');
                isValid = false;
            } else {
                clearError('userMessage', 'messageError');
            }

            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }

                // Simulate brief asynchronous request
                setTimeout(() => {
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
                    }
                    showToast('Thank you! Your message has been sent successfully.');
                }, 600);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 6. Back-to-Top Button Smooth Scrolling
    // -------------------------------------------------------------------------
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
