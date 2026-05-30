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

    const openModal = (e) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Auto-select service in the dropdown if clicked from a service-specific button
        if (e && e.currentTarget) {
            const serviceKey = e.currentTarget.getAttribute('data-service');
            if (serviceKey) {
                const serviceSelect = document.getElementById('required-service');
                if (serviceSelect) {
                    serviceSelect.value = serviceKey;
                }
            }
        }
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
                phone: document.getElementById('client-phone').value,
                company: document.getElementById('company-name').value,
                stage: document.getElementById('business-stage').value,
                service: document.getElementById('required-service').value,
                goals: document.getElementById('business-goals').value,
                date: document.getElementById('preferred-date').value,
                time: document.getElementById('preferred-time').value,
                notes: document.getElementById('additional-notes').value
            };
            
            console.log('Consultation Request Submitting:', formData);

            // Route local testing requests (localhost/127.0.0.1) directly to production API to prevent local 404s
            const isLocal = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.protocol === 'file:';
            const apiEndpoint = isLocal 
                ? 'https://kundhan-cfo.vercel.app/api/consultation' 
                : '/api/consultation';
            
            console.log(`Submitting consultation request to: ${apiEndpoint}`);

            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Populate success advisory card values dynamically
                    const serviceSelect = document.getElementById('required-service');
                    const selectedServiceText = serviceSelect.options[serviceSelect.selectedIndex].text;
                    const preferredTimeSelect = document.getElementById('preferred-time');
                    const selectedTimeText = preferredTimeSelect.options[preferredTimeSelect.selectedIndex].text;

                    document.getElementById('success-service-value').textContent = selectedServiceText;
                    document.getElementById('success-date-value').textContent = formData.date;
                    document.getElementById('success-time-value').textContent = selectedTimeText;

                    // Transition Views
                    modalFormView.style.display = 'none';
                    modalSuccessView.classList.add('active');

                    // Trigger Premium Celebratory Audios & Visuals
                    playSuccessChime();
                    startConfetti();
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

    // --- 10. PREMIUM CELEBRATION CHIME (WEB AUDIO API) ---
    const playSuccessChime = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const now = ctx.currentTime;
            
            // Soft warm chime 1 (E5)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.4);
            
            // Soft warm chime 2 (A5) after 0.08s
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880.00, now + 0.08);
            gain2.gain.setValueAtTime(0, now + 0.08);
            gain2.gain.linearRampToValueAtTime(0.1, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.6);

            // Soft warm chime 3 (C#6) after 0.16s
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(1109.73, now + 0.16);
            gain3.gain.setValueAtTime(0, now + 0.16);
            gain3.gain.linearRampToValueAtTime(0.12, now + 0.2);
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.start(now + 0.16);
            osc3.stop(now + 0.8);
        } catch (e) {
            console.warn('Audio Context chime failed to play:', e);
        }
    };

    // --- 11. HIGH-PERFORMANCE DYNAMIC CONFETTI ENGINE ---
    const startConfetti = () => {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to cover modal window perfectly
        const modalWindow = canvas.parentElement;
        canvas.width = modalWindow.clientWidth;
        canvas.height = modalWindow.clientHeight;
        
        const colors = [
            '#10B981', // Emerald Green
            '#F5C542', // Warm Gold
            '#FFFFFF', // Clean White
            '#34D399', // Mint Green
            '#FBBF24'  // Amber Gold
        ];
        
        const particles = [];
        const particleCount = 100;
        
        // Initialize particles originating near the green check icon (top-center)
        const startX = canvas.width / 2;
        const startY = 80;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: startX,
                y: startY,
                size: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                // Upward explosion, then fall with gravity
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.7) * 9 - 4, // Explosion force upward
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
                wobble: Math.random() * 10,
                wobbleSpeed: Math.random() * 0.05 + 0.02
            });
        }
        
        let animationFrameId;
        const startTime = Date.now();
        const duration = 4000; // Animate for 4 seconds
        
        const updateAndDraw = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrameId);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const gravity = 0.22;
            
            particles.forEach(p => {
                // Apply physics
                p.vy += gravity;
                p.x += p.vx + Math.sin(p.wobble) * 0.5;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.wobble += p.wobbleSpeed;
                
                // Fade out particles slowly in the last second
                if (elapsed > duration - 1000) {
                    p.opacity = Math.max(0, 1 - (elapsed - (duration - 1000)) / 1000);
                }
                
                // Draw particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                // Draw small rectangular confetti flake
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                ctx.restore();
            });
            
            animationFrameId = requestAnimationFrame(updateAndDraw);
        };
        
        animationFrameId = requestAnimationFrame(updateAndDraw);
    };
});
