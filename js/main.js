/**
 * DESCO.PREMIUM — MAIN JAVASCRIPT & 3D INTERACTIVE ENGINE
 * High-performance, 3D gyroscope/touch tilt physics, dynamic live massage simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHero3DInteraction();
  initHeroSwitcher();
  initFaqAccordion();
  initInstallmentFilter();
  initForms();
});

/* ── 1. HEADER SCROLL EFFECT ── */
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ── 2. BULLETPROOF MOBILE DRAWER NAVIGATION ── */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const links = document.querySelectorAll('.nav-link');

  function openNav(e) {
    if (e) e.preventDefault();
    nav.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeNav(e) {
    if (e) e.preventDefault();
    nav.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      if (nav.classList.contains('open')) {
        closeNav(e);
      } else {
        openNav(e);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  links.forEach(l => {
    l.addEventListener('click', () => {
      closeNav();
      links.forEach(x => x.classList.remove('active'));
      l.classList.add('active');
    });
  });
}

/* ── 3. INTERACTIVE 3D GYROSCOPE & TOUCH TILT ENGINE ── */
function initHero3DInteraction() {
  const card = document.getElementById('hero3dCard');
  const productWrapper = document.getElementById('product3dWrapper');
  const glare = document.getElementById('product3dGlare');

  if (!card || !productWrapper) return;

  let isTouching = false;
  let startX = 0, startY = 0;
  let currentRotX = 0, currentRotY = 0;
  let targetRotX = 0, targetRotY = 0;

  function update3DTransform() {
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;

    card.style.transform = `rotateX(${currentRotX * 0.4}deg) rotateY(${currentRotY * 0.4}deg)`;
    productWrapper.style.transform = `translateY(-6px) rotateX(${currentRotX * 0.8}deg) rotateY(${currentRotY * 0.8}deg) scale(1.03)`;

    if (glare) {
      const glareX = 50 + currentRotY * 2;
      const glareY = 50 - currentRotX * 2;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, transparent 65%)`;
    }

    if (Math.abs(targetRotX - currentRotX) > 0.01 || Math.abs(targetRotY - currentRotY) > 0.01) {
      requestAnimationFrame(update3DTransform);
    }
  }

  // Mouse Move (Desktop)
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    targetRotY = (x / (rect.width / 2)) * 14;
    targetRotX = -(y / (rect.height / 2)) * 14;
    requestAnimationFrame(update3DTransform);
  });

  card.addEventListener('mouseleave', () => {
    targetRotX = 0;
    targetRotY = 0;
    requestAnimationFrame(update3DTransform);
  });

  // Touch Move (Smartphones)
  card.addEventListener('touchstart', (e) => {
    isTouching = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  card.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    targetRotY = Math.max(-18, Math.min(18, deltaX * 0.25));
    targetRotX = Math.max(-18, Math.min(18, -deltaY * 0.25));
    requestAnimationFrame(update3DTransform);
  }, { passive: true });

  card.addEventListener('touchend', () => {
    isTouching = false;
    targetRotX = 0;
    targetRotY = 0;
    requestAnimationFrame(update3DTransform);
  });
}

/* ── 4. HERO MODEL SWITCHER WITH DYNAMIC PRICE BADGE ── */
function initHeroSwitcher() {
  const switchBtns = document.querySelectorAll('.h-switch-btn');
  const heroPic = document.getElementById('heroProductPic');
  const productWrapper = document.getElementById('product3dWrapper');
  const badgeText = document.getElementById('heroLiveBadgeText');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgPath = btn.getAttribute('data-img');
      const priceText = btn.getAttribute('data-price');

      if (badgeText && priceText) {
        badgeText.textContent = priceText;
      }

      if (heroPic && productWrapper) {
        productWrapper.style.transform = 'translateY(10px) rotateY(90deg) scale(0.85)';
        heroPic.style.opacity = '0';
        
        setTimeout(() => {
          heroPic.src = imgPath;
          heroPic.style.opacity = '1';
          productWrapper.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
        }, 220);
      }
    });
  });
}

/* ── 5. ULTRA-REALISTIC LIVE MASSAGE SIMULATOR ── */
let isSimulatorRunning = false;
let simulatorTimerInterval = null;
let simulatorPressureInterval = null;
let currentSeconds = 900; // 15 mins

function selectDemoModel(model) {
  const tabGold = document.getElementById('demoTabGold');
  const tabSilver = document.getElementById('demoTabSilver');
  const simImg = document.getElementById('simRealImg');

  if (model === 'gold') {
    tabGold.classList.add('active');
    tabSilver.classList.remove('active');
    simImg.src = 'img/gold-product-trans.png';
  } else {
    tabSilver.classList.add('active');
    tabGold.classList.remove('active');
    simImg.src = 'img/silver-product-trans.png';
  }
}

function toggleLiveMassage() {
  const arena = document.getElementById('demoStageArena');
  const toggleBtn = document.getElementById('btnLiveToggle');
  const toggleText = document.getElementById('toggleText');
  const toggleIcon = document.getElementById('toggleIcon');
  const hudStatus = document.getElementById('hudStatus');
  const hudStatusText = document.getElementById('hudStatusText');
  const pressureVal = document.getElementById('pressureVal');
  const timerVal = document.getElementById('timerVal');
  const modeVal = document.getElementById('modeVal');

  const phase1 = document.getElementById('phase1');
  const phase2 = document.getElementById('phase2');
  const phase3 = document.getElementById('phase3');

  isSimulatorRunning = !isSimulatorRunning;

  if (isSimulatorRunning) {
    arena.classList.add('running');
    toggleBtn.classList.add('running');
    toggleText.textContent = "Massajni To'xtatish";
    toggleIcon.className = "fas fa-stop";
    hudStatus.classList.add('active');
    hudStatusText.textContent = "MASSAJ JARAYONI FAOL";
    if (modeVal) modeVal.textContent = "3D Airbag & Rolik";

    let pStep = 0;
    const pressures = [38, 54, 68, 82, 60, 32, 48, 75, 86, 64, 35];
    simulatorPressureInterval = setInterval(() => {
      pStep = (pStep + 1) % pressures.length;
      if (pressureVal) pressureVal.textContent = pressures[pStep] + " kPa";

      if (pStep < 4) {
        phase1.classList.add('active');
        phase2.classList.remove('active');
        phase3.classList.remove('active');
      } else if (pStep < 8) {
        phase1.classList.remove('active');
        phase2.classList.add('active');
        phase3.classList.remove('active');
      } else {
        phase1.classList.remove('active');
        phase2.classList.remove('active');
        phase3.classList.add('active');
      }
    }, 1200);

    simulatorTimerInterval = setInterval(() => {
      if (currentSeconds > 0) {
        currentSeconds--;
        const m = Math.floor(currentSeconds / 60);
        const s = currentSeconds % 60;
        if (timerVal) timerVal.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);

  } else {
    arena.classList.remove('running');
    toggleBtn.classList.remove('running');
    toggleText.textContent = "Massajni Ishga Tushirish";
    toggleIcon.className = "fas fa-play";
    hudStatus.classList.remove('active');
    hudStatusText.textContent = "KUTISH REJIMI";
    if (pressureVal) pressureVal.textContent = "0 kPa";
    if (modeVal) modeVal.textContent = "Avtomatik Massaj";

    clearInterval(simulatorPressureInterval);
    clearInterval(simulatorTimerInterval);
    currentSeconds = 900;
    if (timerVal) timerVal.textContent = "15:00";
    phase1.classList.add('active');
    phase2.classList.remove('active');
    phase3.classList.remove('active');
  }
}

function loadInteractiveDemo(model) {
  selectDemoModel(model);
  const demoSec = document.getElementById('interactive-demo');
  if (demoSec) {
    demoSec.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (!isSimulatorRunning) toggleLiveMassage();
    }, 600);
  }
}

/* ── 6. CATALOG INSTALLMENT DURATION FILTER (SYNCS MATRIX ROWS) ── */
function initInstallmentFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const allRows = document.querySelectorAll('.p-matrix-row');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const period = tab.getAttribute('data-period'); // '3', '6', '12'

      allRows.forEach(row => {
        const rowPeriod = row.getAttribute('data-row');
        const valSpan = row.querySelector('.m-val');
        if (rowPeriod === period) {
          row.classList.add('active-row');
          if (valSpan) valSpan.classList.add('highlight-val');
        } else {
          row.classList.remove('active-row');
          if (valSpan) valSpan.classList.remove('highlight-val');
        }
      });
    });
  });
}

/* ── 7. FAQ ACCORDION ── */
function initFaqAccordion() {
  const cards = document.querySelectorAll('.faq-card');
  cards.forEach(card => {
    const btn = card.querySelector('.faq-header-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));
        if (!isOpen) card.classList.add('active');
      });
    }
  });
}

/* ── 8. ORDER MODAL & TELEGRAM DISPATCH ── */
function openOrderModal(productName, price) {
  const modal = document.getElementById('orderModal');
  const title = document.getElementById('modalProductTitle');
  const hiddenName = document.getElementById('modalProductName');
  const hiddenPrice = document.getElementById('modalProductPrice');

  if (title) title.textContent = productName;
  if (hiddenName) hiddenName.value = productName;
  if (hiddenPrice) hiddenPrice.value = price;

  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
}

function initForms() {
  // Phone Mask
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(inp => {
    inp.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (!v.startsWith('998')) v = '998' + v;
      if (v.length > 12) v = v.substring(0, 12);
      
      let formatted = '+998 ';
      if (v.length > 3) formatted += '(' + v.substring(3, 5);
      if (v.length >= 5) formatted += ') ' + v.substring(5, 8);
      if (v.length >= 8) formatted += '-' + v.substring(8, 10);
      if (v.length >= 10) formatted += '-' + v.substring(10, 12);

      e.target.value = formatted;
    });
  });

  // Modal Form Submit -> Telegram
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const product = document.getElementById('modalProductName').value;
      const plan = document.getElementById('modalPlan').value;

      const message = `🛍 *YANGI BUYURTMA (Desco.premium)*\n\n👤 *Xaridor:* ${name}\n📞 *Telefon:* ${phone}\n📦 *Mahsulot:* ${product}\n💳 *To'lov usuli:* ${plan}\n\nIltimos, tezkor aloqaga chiqing!`;
      const tgUrl = `https://t.me/desco_premium?text=${encodeURIComponent(message)}`;

      closeOrderModal();
      window.open(tgUrl, '_blank');
    });
  }

  // Lead Section Form Submit -> Telegram
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const product = document.getElementById('userProduct').options[document.getElementById('userProduct').selectedIndex].text;
      const plan = document.getElementById('userPlan').options[document.getElementById('userPlan').selectedIndex].text;

      const message = `🛍 *YANGI BUYURTMA (Desco.premium)*\n\n👤 *Xaridor:* ${name}\n📞 *Telefon:* ${phone}\n📦 *Model:* ${product}\n💳 *Reja:* ${plan}\n\nIltimos, tezkor aloqaga chiqing!`;
      const tgUrl = `https://t.me/desco_premium?text=${encodeURIComponent(message)}`;

      window.open(tgUrl, '_blank');
    });
  }
}
