/**
 * DESCO.PREMIUM — MAIN JAVASCRIPT ENGINE
 * Fast, responsive, luxury interactive engine & dynamic live massage simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
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

/* ── 2. MOBILE DRAWER NAVIGATION ── */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const links = document.querySelectorAll('.nav-link');

  function openNav() {
    nav.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  if (toggle) toggle.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeNav();
    else openNav();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  links.forEach(l => {
    l.addEventListener('click', () => {
      closeNav();
      links.forEach(x => x.classList.remove('active'));
      l.classList.add('active');
    });
  });
}

/* ── 3. HERO MODEL SWITCHER ── */
function initHeroSwitcher() {
  const switchBtns = document.querySelectorAll('.h-switch-btn');
  const heroPic = document.getElementById('heroProductPic');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgPath = btn.getAttribute('data-img');

      if (heroPic) {
        heroPic.style.opacity = '0';
        heroPic.style.transform = 'scale(0.92)';
        setTimeout(() => {
          heroPic.src = imgPath;
          heroPic.style.opacity = '1';
          heroPic.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

/* ── 4. LIVE MASSAGE SIMULATOR ENGINE ── */
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
    // Start Simulation
    arena.classList.add('running');
    toggleBtn.classList.add('running');
    toggleText.textContent = "Massajni To'xtatish";
    toggleIcon.className = "fas fa-stop";
    hudStatus.classList.add('active');
    hudStatusText.textContent = "MASSAJ JARAYONI FAOL";
    if (modeVal) modeVal.textContent = "3D Airbag & Rolik";

    // Dynamic Pressure Simulation (Air compression pulse)
    let pStep = 0;
    const pressures = [35, 52, 68, 76, 54, 28, 45, 72, 80, 60, 32];
    simulatorPressureInterval = setInterval(() => {
      pStep = (pStep + 1) % pressures.length;
      if (pressureVal) pressureVal.textContent = pressures[pStep] + " kPa";

      // Rotate active phase step
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

    // Timer Countdown
    simulatorTimerInterval = setInterval(() => {
      if (currentSeconds > 0) {
        currentSeconds--;
        const m = Math.floor(currentSeconds / 60);
        const s = currentSeconds % 60;
        if (timerVal) timerVal.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);

  } else {
    // Stop Simulation
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

/* ── 5. CATALOG INSTALLMENT FILTER ── */
function initInstallmentFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const matrixRows = document.querySelectorAll('.matrix-row');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const period = tab.getAttribute('data-period');

      matrixRows.forEach(row => {
        const rowPeriod = row.getAttribute('data-row');
        if (period === 'cash') {
          row.classList.remove('highlight', 'gold-highlight', 'dark-highlight');
        } else if (rowPeriod === period) {
          row.classList.add('highlight');
        } else {
          row.classList.remove('highlight', 'gold-highlight', 'dark-highlight');
        }
      });
    });
  });
}

/* ── 6. FAQ ACCORDION ── */
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

/* ── 7. ORDER MODAL & TELEGRAM DISPATCH ── */
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
