/* ============================================
   Grupo SETEC — Service & Training
   Main JavaScript
   ============================================ */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const scrollContainer = document.querySelector('.scroll-container');

function updateNavbar() {
  const scrollTop = (window.innerWidth >= 1025 && scrollContainer) ? scrollContainer.scrollTop : window.scrollY;
  navbar.classList.toggle('scrolled', scrollTop > 60);
}
window.addEventListener('scroll', updateNavbar);
if (scrollContainer) {
  scrollContainer.addEventListener('scroll', updateNavbar);
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('menu-close');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuClose.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on outside click
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== TRAINING FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const tCards = document.querySelectorAll('.t-card');

function applyTrainingFilter(filter) {
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  tCards.forEach(card => {
    const show = filter === 'all' || card.dataset.cat === filter;
    card.style.display = show ? '' : 'none';
    if (show) card.style.animation = 'fadeIn .35s ease';
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => applyTrainingFilter(btn.dataset.filter));
});

// aplica o filtro ativo no carregamento (não há mais "Todos")
if (filterBtns.length) {
  const initial = document.querySelector('.filter-btn.active') || filterBtns[0];
  applyTrainingFilter(initial.dataset.filter);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const container = document.querySelector('.scroll-container');
      const isDesktopSnap = window.innerWidth >= 1025 && container;
      
      if (isDesktopSnap) {
        // Since sections are children of scrollContainer, target.offsetTop is their position
        container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      } else {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--cobre-light)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const empresa = document.getElementById('empresa').value.trim();

  if (!nome || !email || !empresa) {
    alert('Por favor, preencha os campos obrigatórios: Nome, E-mail e Empresa.');
    return;
  }

  const servico = document.getElementById('servico').value;
  const telefone = document.getElementById('telefone').value;
  const mensagem = document.getElementById('mensagem').value;

  const msg = encodeURIComponent(
    `Olá! Sou ${nome} da empresa ${empresa}.\n` +
    `E-mail: ${email}\n` +
    (telefone ? `Telefone: ${telefone}\n` : '') +
    (servico ? `Interesse: ${servico}\n` : '') +
    (mensagem ? `\n${mensagem}` : '')
  );

  window.open(`https://wa.me/5521982874662?text=${msg}`, '_blank');
}

// ===== CAROUSEL PAUSE ON HOVER (already in CSS, but reinforce) =====
const track = document.querySelector('.carousel-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ===== FADE IN ANIMATION =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== HERO WAVES ANIMATION =====
class HeroWaves {
    constructor() {
        this.canvas = document.getElementById('hero-waves-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.hero = this.canvas.closest('section');
        if (!this.hero) return;

        this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        this.mouse = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            influence: 0,
            active: false,
            radius: 220
        };

        this.time = 0;
        this.waves = [
            {
                yPercent: 0.65,
                length: 0.0018,
                amplitude: 35,
                speed: 0.008,
                phase: 0,
                colorStart: 'rgba(31, 78, 121, 0.35)', // --azul (#1F4E79)
                colorEnd: 'rgba(14, 35, 52, 0.7)'     // --noite (#0E2334)
            },
            {
                yPercent: 0.70,
                length: 0.0028,
                amplitude: 25,
                speed: -0.012,
                phase: Math.PI / 4,
                colorStart: 'rgba(45, 111, 168, 0.3)',   // --azul-mid (#2d6fa8)
                colorEnd: 'rgba(31, 78, 121, 0.6)'
            },
            {
                yPercent: 0.74,
                length: 0.004,
                amplitude: 15,
                speed: 0.015,
                phase: Math.PI / 2,
                colorStart: 'rgba(236, 230, 214, 0.15)', // --areia (#ECE6D6)
                colorEnd: 'rgba(31, 78, 121, 0.25)'
            },
            {
                yPercent: 0.78,
                length: 0.0022,
                amplitude: 20,
                speed: -0.006,
                phase: Math.PI,
                colorStart: 'rgba(206, 142, 82, 0.12)',  // --cobre-light (#CE8E52)
                colorEnd: 'rgba(14, 35, 52, 0.5)'
            }
        ];

        this.particles = [];
        this.maxParticles = this.isTouchDevice ? 8 : 25;
        if (this.isTouchDevice) {
            this.waves = this.waves.slice(0, 3); // optimize for mobile
        }

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Event listeners for mouse tracking on the hero section
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.targetX = e.clientX - rect.left;
            this.mouse.targetY = e.clientY - rect.top;
            
            if (!this.mouse.active) {
                this.mouse.x = this.mouse.targetX;
                this.mouse.y = this.mouse.targetY;
                this.mouse.active = true;
            }
        });

        this.hero.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        // Initialize particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                offsetY: (Math.random() - 0.5) * 45,
                speedX: 0.2 + Math.random() * 0.4,
                size: 1 + Math.random() * 2,
                alpha: 0.1 + Math.random() * 0.35,
                waveIndex: Math.floor(Math.random() * this.waves.length)
            });
        }

        this.animate();
    }

    resize() {
        const rect = this.hero.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    getWaveY(x, wave, mouseInfluence, mouseX, mouseY) {
        const baselineY = this.height * wave.yPercent;
        let y = baselineY + Math.sin(x * wave.length + wave.phase) * wave.amplitude;

        if (mouseInfluence > 0) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < this.mouse.radius) {
                const force = (this.mouse.radius - dist) / this.mouse.radius;
                const smoothForce = force * force * (3 - 2 * force); // smoothstep
                
                // Push/pull force and subtle ripple wave
                const push = dy * smoothForce * 0.4;
                const ripple = Math.sin(dist * 0.04 - this.time * 5) * 8 * smoothForce;
                
                y += (push + ripple) * mouseInfluence;
            }
        }
        return y;
    }

    animate() {
        this.time += 0.01;
        
        // Update time-based phase for waves safely
        this.waves.forEach(w => {
            w.phase = (w.phase + w.speed) % (Math.PI * 2);
        });

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Smoothly update mouse coordinates and influence factor
        if (this.mouse.active) {
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
            this.mouse.influence += (1 - this.mouse.influence) * 0.05;
        } else {
            // Decay mouse influence and return target coordinates to center
            this.mouse.influence += (0 - this.mouse.influence) * 0.03;
            
            const centerX = this.width / 2;
            const centerY = this.height * 0.7;
            this.mouse.x += (centerX - this.mouse.x) * 0.03;
            this.mouse.y += (centerY - this.mouse.y) * 0.03;
        }

        // Draw Interactive Spotlight Glow
        if (this.mouse.influence > 0.01) {
            const glow = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouse.radius * 1.2
            );
            // Light blue highlight blending with branding
            glow.addColorStop(0, `rgba(160, 202, 252, ${0.1 * this.mouse.influence})`);
            glow.addColorStop(0.5, `rgba(31, 78, 121, ${0.03 * this.mouse.influence})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius * 1.2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Render each wave layer
        this.waves.forEach((wave, idx) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height);

            // Step by 4px for high-performance rendering while maintaining smoothness
            const step = 4;
            for (let x = 0; x <= this.width; x += step) {
                const y = this.getWaveY(x, wave, this.mouse.influence, this.mouse.x, this.mouse.y);
                this.ctx.lineTo(x, y);
            }

            // Close shape to bottom of canvas
            this.ctx.lineTo(this.width, this.height);
            this.ctx.closePath();

            // Create gradient for current wave shape
            const baselineY = this.height * wave.yPercent;
            const grad = this.ctx.createLinearGradient(0, baselineY - wave.amplitude, 0, this.height);
            grad.addColorStop(0, wave.colorStart);
            grad.addColorStop(1, wave.colorEnd);

            this.ctx.fillStyle = grad;
            this.ctx.fill();
        });

        // Render and update micro-particles
        this.particles.forEach(p => {
            // Base wave height at particle's current x position
            const wave = this.waves[p.waveIndex];
            const waveY = this.getWaveY(p.x, wave, this.mouse.influence, this.mouse.x, this.mouse.y);
            
            // Ride the wave + random offset
            p.y = waveY + p.offsetY;

            // Move particle horizontally
            p.x += p.speedX;
            if (p.x > this.width + 20) {
                p.x = -20;
                p.offsetY = (Math.random() - 0.5) * 45;
            }

            // Mouse repulsion for particles
            if (this.mouse.influence > 0.05) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = this.mouse.radius * 0.7;

                if (dist < repelRadius) {
                    const force = (repelRadius - dist) / repelRadius;
                    // Push particles outward
                    p.x += (dx / (dist || 1)) * force * 3 * this.mouse.influence;
                }
            }

            // Draw particle
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// The animated wave canvas was replaced by a cinematic video background.
// HeroWaves stays defined for safety but no-ops when the canvas is absent.
if (document.getElementById('hero-waves-canvas')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new HeroWaves());
    } else {
        new HeroWaves();
    }
}



// ===== ANIMATED COUNTERS (hero stats + dashboard KPIs) =====
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  function animateCount(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    if (reduceMotion || target === 0) { el.textContent = target + suffix; return; }

    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => countObserver.observe(c));
})();

// ===== SCROLL PARALLAX TRACKER (Updates CSS Variables) =====
(function () {
  const container = document.querySelector('.scroll-container');
  const sections = document.querySelectorAll('.parallax-section');

  function handleScroll() {
    const containerHeight = window.innerHeight || 1;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const progress = rect.top / containerHeight; // range -1 (above) to 0 (centered) to 1 (below)
      section.style.setProperty('--scroll-percent', progress);
      section.style.setProperty('--scroll-percent-abs', Math.abs(progress));
    });
  }

  if (container) {
    container.addEventListener('scroll', handleScroll, { passive: true });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Run once at load
  handleScroll();
})();

// ===== SERVICES CAROUSEL SLIDER CONTROLLER =====
(function () {
  const track = document.querySelector('.services-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlide = 0;

  function updateSlider() {
    if (!track) return;
    const cards = track.querySelectorAll('.servico');
    const totalCards = cards.length;
    if (totalCards === 0) return;
    
    const wrapWidth = track.parentElement.getBoundingClientRect().width;
    const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 320;
    const cardGap = 24; // gap is 1.5rem (24px)
    
    const visibleCards = Math.max(1, Math.floor(wrapWidth / (cardWidth + cardGap)));
    const maxSlide = Math.max(0, totalCards - visibleCards);
    
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    if (currentSlide < 0) currentSlide = 0;
    
    track.style.setProperty('--current-slide', currentSlide);
    track.style.setProperty('--card-width', cardWidth + 'px');
    
    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === maxSlide);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });
    nextBtn.addEventListener('click', () => {
      const cards = track.querySelectorAll('.servico');
      const totalCards = cards.length;
      const wrapWidth = track.parentElement.getBoundingClientRect().width;
      const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 320;
      const cardGap = 24;
      const visibleCards = Math.max(1, Math.floor(wrapWidth / (cardWidth + cardGap)));
      const maxSlide = Math.max(0, totalCards - visibleCards);
      
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
      }
    });
  }

  window.addEventListener('resize', updateSlider);
  
  // Also watch for DOM loading completed to get accurate rects
  document.addEventListener('DOMContentLoaded', updateSlider);
  window.addEventListener('load', updateSlider);
  updateSlider();
})();

// ===== QUEM SOMOS MOUSE PARALLAX & SPOTLIGHT =====
(function() {
  const qsSection = document.getElementById('quem-somos');
  if (!qsSection) return;
  const qsBg = qsSection.querySelector('.section-bg');
  
  qsSection.addEventListener('mousemove', (e) => {
    const rect = qsSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    const spotX = (x / rect.width) * 100;
    const spotY = (y / rect.height) * 100;
    
    requestAnimationFrame(() => {
      if (qsBg) {
        qsBg.style.setProperty('--mouse-x', `${normX * -20}px`);
        qsBg.style.setProperty('--mouse-y', `${normY * -20}px`);
      }
      qsSection.style.setProperty('--cursor-x', `${spotX}%`);
      qsSection.style.setProperty('--cursor-y', `${spotY}%`);
    });
  });
  
  qsSection.addEventListener('mouseleave', () => {
    requestAnimationFrame(() => {
      if (qsBg) {
        qsBg.style.setProperty('--mouse-x', '0px');
        qsBg.style.setProperty('--mouse-y', '0px');
      }
      qsSection.style.setProperty('--cursor-x', '50%');
      qsSection.style.setProperty('--cursor-y', '50%');
    });
  });
})();

// ===== EAD CANVAS GEOMETRIC PARTICLES =====
(function() {
  const canvas = document.getElementById('ead-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('ead');
  
  let width = canvas.width = section.offsetWidth;
  let height = canvas.height = section.offsetHeight;
  
  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
  });
  
  const particles = [];
  const particleCount = 45;
  const colors = [
    'rgba(255, 255, 255, 0.35)', // white
    'rgba(206, 142, 82, 0.45)',   // copper
    'rgba(45, 111, 168, 0.45)'    // blue-mid
  ];
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Track mouse
  let mouse = { x: null, y: null, active: false };
  
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  
  section.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particles.forEach(p => {
      // Very gentle mouse repulsion if close
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= (dx / dist) * 0.45;
          p.y -= (dy / dist) * 0.45;
        }
      }
      
      p.update();
      p.draw();
    });
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.active) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = (1 - dist / 180) * 0.15;
          ctx.strokeStyle = `rgba(206, 142, 82, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();

// ===== NR TABS INTERACTIVITY =====
(function() {
  const tabButtons = document.querySelectorAll('.nr-tab-btn');
  const tabContents = document.querySelectorAll('.nr-tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      
      // Deactivate all buttons
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      
      // Deactivate all contents
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Activate clicked button
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      // Activate corresponding content
      const targetId = `nr-cat-${category}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        
        // Retrigger scroll reveal animations inside the tab
        const revealInTab = targetContent.querySelectorAll('.reveal');
        revealInTab.forEach(el => {
          el.classList.add('active');
        });
      }
    });
  });
})();

// ===== MOBILE INTERACTIVE ACCORDIONS (Diferenciais & Cursos) =====
(function() {
  // Diferenciais
  const vantagens = document.querySelectorAll('#vantagens .vantagem');
  vantagens.forEach(item => {
    item.addEventListener('click', (e) => {
      // Toggle current
      const isExpanded = item.classList.contains('expanded');
      vantagens.forEach(v => v.classList.remove('expanded'));
      if (!isExpanded) {
        item.classList.add('expanded');
      }
    });
  });

  // Cursos Técnicos
  const tCards = document.querySelectorAll('#treinamentos .t-card');
  tCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle current
      const isExpanded = card.classList.contains('expanded');
      tCards.forEach(c => c.classList.remove('expanded'));
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
})();
