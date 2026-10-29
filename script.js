/**
 * SWASTHIK NAYAK PORTFOLIO ENGINE
 * Includes: Ambient Canvas, Web Audio API Sound FX, Recruiter Terminal CLI,
 * Interactive RMS Demo Simulator (RBAC + Tables + GST Billing), Typewriter, Theme Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SOUND EFFECTS ENGINE (Web Audio API)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSynthTone = (freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const soundFX = {
    click: () => playSynthTone(587.33, 'sine', 0.06, 0.04), // D5 blip
    hover: () => playSynthTone(880, 'sine', 0.03, 0.015), // A5 subtle
    success: () => {
      if (!soundEnabled) return;
      playSynthTone(523.25, 'triangle', 0.1, 0.05); // C5
      setTimeout(() => playSynthTone(659.25, 'triangle', 0.1, 0.05), 80); // E5
      setTimeout(() => playSynthTone(783.99, 'triangle', 0.15, 0.06), 160); // G5
    },
    terminal: () => playSynthTone(720, 'square', 0.04, 0.02)
  };

  // Sound toggle button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  
  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        showToast('Sound effects enabled', 'fa-solid fa-volume-high');
        soundFX.click();
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        showToast('Sound effects muted', 'fa-solid fa-volume-xmark');
      }
    });
  }

  // ==========================================
  // 2. THEME SWITCHER (Dark / Light)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('swasthik-theme') || 'dark';
  setTheme(savedTheme);

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('swasthik-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      soundFX.click();
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon');
    });
  }

  // ==========================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 4. NAVBAR SCROLL & ACTIVE LINK SPY
  // ==========================================
  const header = document.getElementById('header');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;

    // Progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercentage}%`;
    }

    // Header background change
    if (header) {
      if (scrollPos > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for active link
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      soundFX.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Hamburger menu toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      soundFX.click();
      const isActive = hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close mobile menu on click link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 5. TYPEWRITER EFFECT
  // ==========================================
  const typewriterElement = document.getElementById('typewriter-text');
  const typewriterPhrases = [
    'Software Engineer',
    'MCA Candidate @ PIM Udupi',
    'IIT Kharagpur Elite Medalist',
    'Full-Stack Web Developer',
    'Problem Solver & Team Leader'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // ==========================================
  // 6. AMBIENT GLOW & PARTICLES CANVAS
  // ==========================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 35), 45);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ==========================================
  // 7. 3D CARD TILT INTERACTION
  // ==========================================
  const tiltCard = document.getElementById('profile-card-3d');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', e => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / (rect.height / 2)) * -12;
      const rotY = (x / (rect.width / 2)) * 12;

      const inner = tiltCard.querySelector('.card-inner-frame');
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    tiltCard.addEventListener('mouseleave', () => {
      const inner = tiltCard.querySelector('.card-inner-frame');
      if (inner) {
        inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  // ==========================================
  // 8. SKILLS CATEGORY FILTERING
  // ==========================================
  const skillTabBtns = document.querySelectorAll('.skills-filter-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skills-cards-grid .skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.click();
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });



  // ==========================================
  // 10. RECRUITER INTERACTIVE TERMINAL CLI
  // ==========================================
  const terminalModal = document.getElementById('terminal-modal');
  const terminalTriggerBtn = document.getElementById('terminal-trigger-btn');
  const openTerminalCardBtn = document.getElementById('open-terminal-card-btn');
  const closeTerminalBtn = document.getElementById('close-terminal-btn');
  const termCloseDot = document.getElementById('term-close-dot');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalQuickBtns = document.querySelectorAll('.terminal-quick-buttons .t-qbtn');

  const openTerminal = () => {
    soundFX.terminal();
    if (terminalModal) {
      terminalModal.classList.add('active');
      terminalModal.setAttribute('aria-hidden', 'false');
      if (terminalInput) {
        setTimeout(() => terminalInput.focus(), 150);
      }
    }
  };

  const closeTerminal = () => {
    soundFX.click();
    if (terminalModal) {
      terminalModal.classList.remove('active');
      terminalModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (terminalTriggerBtn) terminalTriggerBtn.addEventListener('click', openTerminal);
  if (openTerminalCardBtn) openTerminalCardBtn.addEventListener('click', openTerminal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);
  if (termCloseDot) termCloseDot.addEventListener('click', closeTerminal);

  // Global Ctrl + K shortcut
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (terminalModal && terminalModal.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape') {
      if (terminalModal && terminalModal.classList.contains('active')) closeTerminal();
      if (resumeModal && resumeModal.classList.contains('active')) closeResumeModal();
    }
  });

  // Terminal Command Execution Logic
  const commandMap = {
    help: () => `
<span class="term-msg">Available commands:</span>
  • <span class="t-cmd">about</span>          - View Swasthik's profile & background
  • <span class="t-cmd">skills</span>         - List technical proficiencies
  • <span class="t-cmd">projects</span>       - View details of Restaurant Management System (RMS)
  • <span class="t-cmd">nptel</span>          - View IIT Kharagpur Elite Medal certification
  • <span class="t-cmd">education</span>      - Display education timeline (MCA, BSc, PUC, SSLC)
  • <span class="t-cmd">experience</span>     - View Web Development Internship details
  • <span class="t-cmd">achievements</span>   - View 3-yr Cultural Secretary & NSS honors
  • <span class="t-cmd">contact</span>        - Get email, phone, location & WhatsApp
  • <span class="t-cmd">resume</span>         - Download official PDF resume
  • <span class="t-cmd">theme</span>          - Toggle dark/light interface mode
  • <span class="t-cmd">clear</span>          - Clear terminal history
`,
    about: () => `
<strong>SWASTHIK NAYAK</strong> - Fresher / Software Engineer & Full-Stack Developer
• MCA Candidate at <em>Poornaprajna Institute of Management (PIM)</em>, Udupi (2025-2027)
• BSc in Computer Science from <em>Alvas Degree College</em>, Moodubidre (2023-2025)
• Passionate about scalable backend systems, algorithms, modern databases & UI design.
`,
    skills: () => `
<strong>Technical & Professional Arsenal:</strong>
[Core CS & Languages]     Python, JavaScript (ES6+), HTML5, CSS3, SQL
[Algorithms & Math]       IIT Kharagpur Elite Medal in Data Structures & Algorithms
[Systems & Architecture]  Role-Based Access Control (RBAC), Database Management (DBMS)
[Web & UI/UX]             Responsive Layouts, Glassmorphic UI, Vanilla JS Components
[Leadership & Soft]       Cultural Secretary (3 Yrs), NSS Volunteer, Teamwork, Time Mgmt
`,
    projects: () => `
<strong>Featured Project: Restaurant Management System (RMS)</strong>
• Real-time table reservations (Available / Reserved / Occupied)
• Multi-tier Role-Based Access Control (Admin, Waiter, Kitchen Staff)
• Kitchen order tracking pipeline (New -> Preparing -> Ready)
• Automated GST Billing Engine with 9% CGST + 9% SGST calculation
`,
    nptel: () => `
<strong>🏅 NPTEL Online Certification: IIT Kharagpur (Elite Medal)</strong>
• Course: Data Structures and Algorithms in Python
• Issuing Body: Indian Institute of Technology Kharagpur / NPTEL
• Credential Grade: ELITE MEDALIST
`,
    education: () => `
<strong>Academic Timeline:</strong>
1. 2025-2027: MCA - Poornaprajna Institute of Management (PIM), Udupi
2. 2023-2025: BSc Computer Science - Alvas Degree College, Moodubidre
3. 2020-2022: PUC - Govt PU College, Karkala
4. 2019:      SSLC - S B M P M High School, Durga Tellaru
`,
    experience: () => `
<strong>Web Development Intern (2025)</strong>
• Engineered frontend interfaces with HTML5, CSS3 & vanilla JS (ES6+)
• Developed practical knowledge in UI/UX design, visual hierarchy, and accessibility
• Worked on component styling, performance optimization, and cross-browser consistency
`,
    achievements: () => `
<strong>Honors & Leadership:</strong>
• <strong>Cultural Secretary in Alvas (3 Consecutive Years):</strong> Led campus fests, team committees of 50+, event logistics and campus performances.
• <strong>NSS Volunteer (1 Year):</strong> Dedicated social responsibility and public welfare service.
`,
    contact: () => `
<strong>Direct Contact Channels:</strong>
• Email:    <a href="mailto:swasthiknayak09@gmail.com" style="color:#58a6ff;">swasthiknayak09@gmail.com</a>
• Phone:    <a href="tel:+918197194701" style="color:#58a6ff;">+91 8197194701</a>
• WhatsApp: <a href="https://wa.me/918197194701" target="_blank" style="color:#7ee787;">wa.me/918197194701</a>
• Location: Mahalaxmi Nilaya, Durga Tellaru, Karkala, Udupi, Karnataka, India
`,
    resume: () => {
      // Trigger download
      const a = document.createElement('a');
      a.href = 'assets/swasthik-resume.pdf';
      a.download = 'Swasthik_Nayak_Resume.pdf';
      a.click();
      return `[✓] Downloading Swasthik_Nayak_Resume.pdf directly to your device!`;
    },
    theme: () => {
      const cur = htmlRoot.getAttribute('data-theme');
      const nxt = cur === 'light' ? 'dark' : 'light';
      setTheme(nxt);
      return `Switched theme to [${nxt}] mode.`;
    },
    clear: () => {
      if (terminalHistory) terminalHistory.innerHTML = '';
      return '';
    },
    whoami: () => `guest@swasthik-portfolio-visitor`,
    date: () => new Date().toString(),
    sudo: () => `Permission denied: You already have read access to Swasthik's complete portfolio! 😉`
  };

  const handleTerminalCommand = cmdRaw => {
    soundFX.terminal();
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      commandMap.clear();
      return;
    }

    const histItem = document.createElement('div');
    histItem.className = 'terminal-history-item';

    let outputHtml = '';
    if (commandMap[cmd]) {
      outputHtml = commandMap[cmd]();
    } else {
      outputHtml = `<span style="color:#ff7b72;">Command not found: '${cmd}'. Type <span class="t-cmd">help</span> for a list of commands.</span>`;
    }

    histItem.innerHTML = `
      <div class="term-hist-cmd"><span class="term-prompt">swasthik@developer:~$</span> ${cmdRaw}</div>
      <div class="term-hist-out">${outputHtml}</div>
    `;

    if (terminalHistory) {
      terminalHistory.appendChild(histItem);
      const termBody = document.getElementById('terminal-body');
      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        handleTerminalCommand(val);
        terminalInput.value = '';
      }
    });
  }

  terminalQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      handleTerminalCommand(cmd);
      if (terminalInput) terminalInput.focus();
    });
  });

  // ==========================================
  // 11. RESUME MODAL & VIEWER
  // ==========================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeModalBtns = [
    document.getElementById('open-resume-modal-btn'),
    document.getElementById('about-view-resume-btn'),
    document.getElementById('btn-preview-pdf-main'),
    document.getElementById('resume-thumb-trigger')
  ];
  const closeResumeModalBtn = document.getElementById('close-resume-modal-btn');

  const openResumeModal = () => {
    soundFX.click();
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    soundFX.click();
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openResumeModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openResumeModal);
  });

  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

  window.addEventListener('click', e => {
    if (e.target === resumeModal) closeResumeModal();
  });

  // ==========================================
  // 12. 1-CLICK COPY TO CLIPBOARD
  // ==========================================
  const copyBtns = document.querySelectorAll('.ci-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.click();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'fa-solid fa-copy');
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`, 'fa-solid fa-copy');
    } catch (e) {
      showToast(`Please manually copy: ${text}`, 'fa-solid fa-info-circle');
    }
    document.body.removeChild(textarea);
  }

  // ==========================================
  // 13. INTERACTIVE CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      soundFX.success();

      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const subject = document.getElementById('contact-subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('contact-message')?.value || '';

      // Direct mailto fallback trigger
      const mailtoUrl = `mailto:swasthiknayak09@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Swasthik,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      showToast(`Thank you, ${name}! Opening mail client...`, 'fa-solid fa-paper-plane');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      contactForm.reset();
    });
  }

  console.log('%c Swasthik Nayak Portfolio Loaded Successfully! ', 'background: #6366f1; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});
