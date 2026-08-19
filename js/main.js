/* ═══════════════════════════════════════════════════════════════════════════════
   DESCO PREMIUM — LEAD FRONTEND LOGIC & REAL MASSAGER WORKING SIMULATOR
   ═══════════════════════════════════════════════════════════════════════════════ */

let isMassageRunning = false;
let currentDemoModel = 'gold';
let massageTimerInterval = null;
let phaseCycleInterval = null;
let timerSeconds = 15 * 60;
let currentPhase = 1;

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Header Scroll Dynamics ──
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── 2. Mobile Menu Navigation ──
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  // ── 3. Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // ── 4. Interactive Hero Model Switcher & 3D Tilt ──
  const heroSwitchBtns = document.querySelectorAll('.h-switch-btn');
  const heroProductPic = document.getElementById('heroProductPic');
  const heroStage = document.getElementById('heroStage');
  const productBox = document.getElementById('productFloatingBox');

  if (heroSwitchBtns.length > 0 && heroProductPic) {
    heroSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        heroSwitchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const newSrc = btn.getAttribute('data-img');
        
        heroProductPic.style.opacity = '0';
        heroProductPic.style.transform = 'scale(0.9) translateY(10px)';
        
        setTimeout(() => {
          heroProductPic.src = newSrc;
          heroProductPic.style.opacity = '1';
          heroProductPic.style.transform = 'scale(1) translateY(0)';
        }, 200);
      });
    });
  }

  if (heroStage && productBox && window.innerWidth > 768) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / rect.height) * -16;
      const tiltY = (x / rect.width) * 16;

      productBox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    heroStage.addEventListener('mouseleave', () => {
      productBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ── 5. Installment Duration Switcher (Tabs) ──
  const tabBtns = document.querySelectorAll('.installment-tabs .tab-btn');
  const matrixRows = document.querySelectorAll('.matrix-row');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      
      matrixRows.forEach(row => {
        row.classList.remove('highlight', 'gold-highlight', 'dark-highlight');
        if (period !== 'cash' && row.getAttribute('data-row') === period) {
          const card = row.closest('.catalog-card');
          if (card.classList.contains('featured-gold-card')) {
            row.classList.add('highlight');
          } else if (card.classList.contains('vip-gift-card')) {
            row.classList.add('dark-highlight');
          } else {
            row.classList.add('gold-highlight');
          }
        }
      });
    });
  });

  // ── 6. FAQ Accordion ──
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-header-btn');
    btn.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      faqCards.forEach(c => c.classList.remove('active'));
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // ── 7. Phone Mask Formatter ──
  function setupPhoneMask(input) {
    if (!input) return;
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('998')) val = val.slice(3);
      if (val.length > 9) val = val.slice(0, 9);

      if (val.length >= 7) {
        e.target.value = `+998 (${val.slice(0,2)}) ${val.slice(2,5)}-${val.slice(5,7)}-${val.slice(7)}`;
      } else if (val.length >= 5) {
        e.target.value = `+998 (${val.slice(0,2)}) ${val.slice(2,5)}-${val.slice(5)}`;
      } else if (val.length >= 2) {
        e.target.value = `+998 (${val.slice(0,2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        e.target.value = `+998 (${val}`;
      } else {
        e.target.value = '';
      }
    });
  }

  setupPhoneMask(document.getElementById('userPhone'));
  setupPhoneMask(document.getElementById('modalPhone'));

  // ── 8. Lead Form Submission to Telegram ──
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value;
      const phone = document.getElementById('userPhone').value;
      const productSelect = document.getElementById('userProduct');
      const product = productSelect.options[productSelect.selectedIndex].text;
      const planSelect = document.getElementById('userPlan');
      const plan = planSelect.options[planSelect.selectedIndex].text;

      const telegramMsg = `✨ Yangi Buyurtma (Desco Landing) ✨%0A%0A👤 Ism: ${encodeURIComponent(name)}%0A📞 Tel: ${encodeURIComponent(phone)}%0A📦 Mahsulot: ${encodeURIComponent(product)}%0A💳 To'lov Rejasi: ${encodeURIComponent(plan)}`;

      window.open(`https://t.me/Desco_premium_bot?start=${telegramMsg}`, '_blank');

      const submitBtn = leadForm.querySelector('.btn-submit');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Arizangiz Qabul Qilindi!</span>';
      submitBtn.style.background = '#10B981';

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.style.background = '';
        leadForm.reset();
      }, 3000);
    });
  }

  // ── 9. Modal Order Form ──
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value;
      const phone = document.getElementById('modalPhone').value;
      const product = document.getElementById('modalProductName').value;
      const price = document.getElementById('modalProductPrice').value;
      const plan = document.getElementById('modalPlan').value;

      const telegramMsg = `👑 Yangi Tezkor Buyurtma 👑%0A%0A👤 Ism: ${encodeURIComponent(name)}%0A📞 Tel: ${encodeURIComponent(phone)}%0A📦 Mahsulot: ${encodeURIComponent(product)} (Naqd: ${encodeURIComponent(price)} so'm)%0A💳 Reja: ${encodeURIComponent(plan)}`;

      window.open(`https://t.me/Desco_premium_bot?start=${telegramMsg}`, '_blank');

      closeOrderModal();
    });
  }

});

// ── REAL PRODUCT LIVE MASSAGE SIMULATOR LOGIC ──

function selectDemoModel(model) {
  currentDemoModel = model;
  const tabGold = document.getElementById('demoTabGold');
  const tabSilver = document.getElementById('demoTabSilver');
  const simImg = document.getElementById('simRealImg');
  const hudStatusText = document.getElementById('hudStatusText');

  if (model === 'gold') {
    tabGold.classList.add('active');
    tabSilver.classList.remove('active');
    simImg.src = 'img/gold-product.jpg';
    if (isMassageRunning) {
      hudStatusText.textContent = '3-FUNKSIYALIK (TILLO RANG) JONLI ISHLAMOQDA';
    }
  } else {
    tabSilver.classList.add('active');
    tabGold.classList.remove('active');
    simImg.src = 'img/silver-product.jpg';
    if (isMassageRunning) {
      hudStatusText.textContent = '6-FUNKSIYALIK (SERIY) 3D JONLI ISHLAMOQDA';
    }
  }
}

function toggleLiveMassage() {
  const arena = document.getElementById('demoStageArena');
  const toggleBtn = document.getElementById('btnLiveToggle');
  const toggleIcon = document.getElementById('toggleIcon');
  const toggleText = document.getElementById('toggleText');
  const hudStatus = document.getElementById('hudStatus');
  const hudStatusText = document.getElementById('hudStatusText');

  isMassageRunning = !isMassageRunning;

  if (isMassageRunning) {
    arena.classList.add('running');
    toggleBtn.classList.add('running');
    toggleIcon.className = 'fas fa-pause';
    toggleText.textContent = 'To\'xtatish';
    hudStatus.classList.add('active');

    const modelName = currentDemoModel === 'gold' ? '3-FUNKSIYALIK (TILLO RANG)' : '6-FUNKSIYALIK (SERIY)';
    hudStatusText.textContent = `${modelName} JONLI ISHLAMOQDA`;

    // Start Timer
    timerSeconds = 15 * 60;
    updateTimerDisplay();
    clearInterval(massageTimerInterval);
    massageTimerInterval = setInterval(() => {
      timerSeconds--;
      if (timerSeconds <= 0) {
        toggleLiveMassage();
      } else {
        updateTimerDisplay();
      }
    }, 1000);

    // Rotate Massage Phases
    currentPhase = 1;
    updatePhasesTracker(1);
    clearInterval(phaseCycleInterval);
    phaseCycleInterval = setInterval(() => {
      currentPhase = (currentPhase % 3) + 1;
      updatePhasesTracker(currentPhase);
    }, 3500);

  } else {
    arena.classList.remove('running');
    toggleBtn.classList.remove('running');
    toggleIcon.className = 'fas fa-play';
    toggleText.textContent = 'Massajni Ishga Tushirish';
    hudStatus.classList.remove('active');
    hudStatusText.textContent = 'KUTISH REJIMI (Tugmani bosing)';

    clearInterval(massageTimerInterval);
    clearInterval(phaseCycleInterval);
  }
}

function updateTimerDisplay() {
  const timerVal = document.getElementById('timerVal');
  if (!timerVal) return;
  const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const secs = (timerSeconds % 60).toString().padStart(2, '0');
  timerVal.textContent = `${mins}:${secs}`;
}

function updatePhasesTracker(phase) {
  document.querySelectorAll('.phase-step').forEach(p => p.classList.remove('active'));
  const activePhase = document.getElementById(`phase${phase}`);
  if (activePhase) activePhase.classList.add('active');
}

// Shortcut from Catalog Cards: Jump to Demo and Auto-Start
function loadInteractiveDemo(model) {
  selectDemoModel(model);
  const demoSection = document.getElementById('interactive-demo');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (!isMassageRunning) {
        toggleLiveMassage();
      }
    }, 600);
  }
}

// ── Global Modal Open/Close ──
function openOrderModal(productName, price) {
  const modal = document.getElementById('orderModal');
  const titleElem = document.getElementById('modalProductTitle');
  const hiddenName = document.getElementById('modalProductName');
  const hiddenPrice = document.getElementById('modalProductPrice');

  if (modal) {
    titleElem.textContent = `${productName} — ${price} so'm`;
    hiddenName.value = productName;
    hiddenPrice.value = price;
    modal.classList.add('open');
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('open');
}
