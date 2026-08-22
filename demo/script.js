document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Features logic
  const modules = [
    { id: 'elicitation' },
    { id: 'feasibility' },
    { id: 'prototyping' },
    { id: 'verification' },
    { id: 'specification' }
  ];

  let activeModule = 0;
  let isPaused = false;
  
  const buttons = document.querySelectorAll('.feature-btn');
  const slides = document.querySelectorAll('.feature-slide');
  const pill = document.getElementById('feature-pill');
  const featureSection = document.getElementById('features');
  const dotNavs = document.querySelectorAll('.dot-nav');

  function updatePill() {
    const activeBtn = buttons[activeModule];
    if (activeBtn && pill) {
      pill.style.top = activeBtn.offsetTop + 'px';
      pill.style.height = activeBtn.offsetHeight + 'px';
      pill.style.opacity = '1';
    }
  }

  function setActiveModule(index) {
    activeModule = index;
    
    // Update buttons
    buttons.forEach((btn, idx) => {
      const isActive = idx === activeModule;
      btn.className = `feature-btn group relative z-10 flex w-full items-center gap-4 rounded-[1.8rem] border px-4 py-4 text-left transition-colors duration-500 ${isActive ? 'border-transparent text-white' : 'border-slate-200/70 bg-white/40 text-slate-600 hover:border-slate-200 hover:bg-white'}`;
      
      const iconContainer = btn.querySelector('.icon-container');
      if (iconContainer) {
        iconContainer.className = `icon-container flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-500 ${isActive ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200/70 bg-slate-50 text-slate-800'}`;
      }
      
      const arrow = btn.querySelector('.arrow-icon');
      if (arrow) {
        arrow.className = `arrow-icon lucide lucide-arrow-right h-4 w-4 shrink-0 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`;
      }
      
      const tagline = btn.querySelector('.tagline-text');
      if (tagline) {
        tagline.className = `tagline-text mt-1 text-xs leading-snug ${isActive ? 'text-slate-300/80' : 'text-slate-500'}`;
      }
    });

    // Update slides
    slides.forEach((slide, idx) => {
      if (idx === activeModule) {
        slide.classList.remove('hidden');
        // Force reflow for animation
        void slide.offsetWidth;
        slide.classList.add('animate-in', 'fade-in', 'slide-in-from-right-6');
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('animate-in', 'fade-in', 'slide-in-from-right-6');
      }
    });

    // Update dot navs
    dotNavs.forEach(navGroup => {
        const dots = navGroup.querySelectorAll('.dot-btn');
        dots.forEach((dot, idx) => {
            dot.className = `dot-btn h-2.5 w-10 rounded-full transition-all duration-500 cursor-pointer ${idx === activeModule ? 'bg-slate-900' : 'bg-slate-300/70 hover:bg-slate-400/80'}`;
        });
        const label = navGroup.querySelector('.module-label');
        if(label) label.textContent = `Module ${activeModule + 1}`;
    });

    updatePill();
  }

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      setActiveModule(idx);
    });
  });
  
  document.addEventListener('click', (e) => {
      if(e.target.classList.contains('dot-btn')) {
          const idx = Array.from(e.target.parentElement.children).indexOf(e.target);
          if(idx !== -1) setActiveModule(idx);
      }
  });

  window.addEventListener('resize', updatePill);

  if (featureSection) {
    featureSection.addEventListener('mouseenter', () => isPaused = true);
    featureSection.addEventListener('mouseleave', () => isPaused = false);
    featureSection.addEventListener('focus', () => isPaused = true);
    featureSection.addEventListener('blur', () => isPaused = false);

    featureSection.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveModule((activeModule + 1) % modules.length);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveModule((activeModule - 1 + modules.length) % modules.length);
      }
    });
  }

  // Auto-advance
  setInterval(() => {
    if (!isPaused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveModule((activeModule + 1) % modules.length);
    }
  }, 1800);

  // Initialize
  setTimeout(() => {
      setActiveModule(0);
      updatePill();
  }, 100);

  // Modals logic
  const termsBtn = document.getElementById('terms-btn');
  const privacyBtn = document.getElementById('privacy-btn');
  const modalContainer = document.getElementById('modal-container');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const termsContent = document.getElementById('terms-content');
  const privacyContent = document.getElementById('privacy-content');
  const modalTitle = document.getElementById('modal-title');

  function openModal(type) {
    if (modalContainer) {
      modalContainer.classList.remove('hidden');
      if (type === 'terms') {
        modalTitle.textContent = 'Terms of Service';
        termsContent.classList.remove('hidden');
        privacyContent.classList.add('hidden');
      } else {
        modalTitle.textContent = 'Privacy Policy';
        privacyContent.classList.remove('hidden');
        termsContent.classList.add('hidden');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (termsBtn) termsBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('terms'); });
  if (privacyBtn) privacyBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('privacy'); });
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
});
