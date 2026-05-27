/* ==========================================================================
   KUNDHAN & ASSOCIATES - PREMIUM AI-DRIVEN FINANCE ADVISORY JAVASCRIPT
   Aesthetics: Apple x Linear | High-End Cinematic Interactive Portfolios
   Visual Balance: Restored Playfair Display Serif & Inter Sans-Serif
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZE LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. BUTTERY SMOOTH CURSOR TRAIL GLOW (LERP PHYSICS ENGINE) ---
    const cursorGlow = document.getElementById('cursor-glow');
    
    let targetX = 0; // Target coordinates (mouse position)
    let targetY = 0;
    
    let glowX = 0;   // Interpolated current coordinates (halo positions)
    let glowY = 0;
    
    const lerpCoefficient = 0.08; // Smooth deceleration coefficient
    let isMouseActive = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (!isMouseActive) {
            glowX = targetX;
            glowY = targetY;
            isMouseActive = true;
            cursorGlow.style.opacity = '1';
        }
    });

    const updateGlowPosition = () => {
        if (isMouseActive) {
            // Formula: Current = Current + (Target - Current) * Speed
            glowX += (targetX - glowX) * lerpCoefficient;
            glowY += (targetY - glowY) * lerpCoefficient;
            
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }
        
        requestAnimationFrame(updateGlowPosition);
    };
    
    requestAnimationFrame(updateGlowPosition);

    // Hide glow smoothly on mouse exit, restore on enter
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', (e) => {
        isMouseActive = true;
        targetX = e.clientX;
        targetY = e.clientY;
        glowX = targetX;
        glowY = targetY;
        cursorGlow.style.opacity = '1';
    });

    // --- 3. STICKY NAVBAR SCROLL ACTION ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- 4. RESPONSIVE MOBILE NAVIGATION MENU ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Hamburger visual cross-rotation
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'translateY(8px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // --- 5. SCROLL REVEALS (FADE IN UP TRANSITIONS) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 6. DYNAMIC STATISTICS COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.stat-num');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easedProgress = progress * (2 - progress);
            const currentValue = Math.floor(easedProgress * target);

            element.textContent = target === 5 ? `${currentValue}+ Years` : `${currentValue}+`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target === 5 ? `${target}+ Years` : `${target}+`;
            }
        };

        requestAnimationFrame(updateCount);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    statNumbers.forEach(stat => {
        if (stat.getAttribute('data-target')) {
            statsObserver.observe(stat);
        }
    });

    // --- 7. CARDS SPOTLIGHT CURSOR GLOWS (Binds to Services, AI, and Staggered Timelines) ---
    const interactiveCards = document.querySelectorAll('.service-card, .ai-card, .timeline-item, .global-card, .itr-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}`);
            card.style.setProperty('--mouse-y', `${y}`);
        });
    });

    // --- 8. BOOKING CONSULTATION MODAL CONTROL ---
    const modal = document.getElementById('consultation-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.getElementById('modal-close-btn');
    const modalFormView = document.getElementById('modal-form-view');
    const modalSuccessView = document.getElementById('modal-success-view');
    const bookingForm = document.getElementById('booking-form');
    const modalSuccessCloseBtn = document.getElementById('modal-success-close-btn');

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modalFormView.style.display = 'block';
            modalSuccessView.classList.remove('active');
            bookingForm.reset();
        }, 500);
    };

    openModalButtons.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- 9. CONSULTATION FORM SUBMISSIONS ---
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = bookingForm.querySelector('.form-submit');
            const originalBtnHtml = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg style="animation: spin 1s linear infinite; margin-right: 8px; display: inline-block; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Sending Request...
            `;
            
            const formData = {
                name: document.getElementById('client-name').value,
                email: document.getElementById('client-email').value,
                company: document.getElementById('company-name').value,
                stage: document.getElementById('business-stage').value,
                service: document.getElementById('required-service').value,
                goals: document.getElementById('business-goals').value
            };
            
            console.log('Consultation Request Submitting:', formData);

            fetch('/api/consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                const data = await response.json();
                
                if (response.ok && data.success) {
                    modalFormView.style.display = 'none';
                    modalSuccessView.classList.add('active');
                } else {
                    console.error('Submission failed:', data.error);
                    alert(`Error submitting request: ${data.error || 'Please try again.'}`);
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Connection error. Please try again or email us directly.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            });
        });
    }

    if (modalSuccessCloseBtn) {
        modalSuccessCloseBtn.addEventListener('click', closeModal);
    }
});
