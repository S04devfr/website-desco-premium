/**
 * DESCO.PREMIUM — MAIN JAVASCRIPT & 3D 360° INTERACTIVE ENGINE
 * High-performance 360° orbital rotation with inertia damping & direct Telegram lead dispatch
 */

// TELEGRAM BOT CONFIGURATION FOR INSTANT LEADS
const TG_BOT_CONFIG = {
  // Agar bot tokeningiz bo'lsa shu yerga yozing, to'g'ridan-to'g'ri guruh/kanalga tushadi:
  botToken: '8143244837:AAFI0yBwQzF8KkKz23n_5zL8o9_DescoProd', 
  chatId: '-1002398472910', // Admin guruhi yoki kanali
  fallbackUsername: 'desco_premium'
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHero360Rotation();
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

/* ── 3. INTERACTIVE 360° ORBITAL ROTATION & INERTIA ENGINE ── */
function initHero360Rotation() {
  const card = document.getElementById('hero3dCard');
  const productWrapper = document.getElementById('product3dWrapper');
  const glare = document.getElementById('product3dGlare');

  if (!card || !productWrapper) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let currentRotY = 0;
  let currentRotX = 0;
  let targetRotY = 0;
  let targetRotX = 0;
  let velocityY = 0;
  let autoRotateSpeed = 0.35; // Soft continuous 360 spin when idle
  let isInteracting = false;
  let animFrameId = null;

  function render360() {
    if (!isInteracting) {
      targetRotY += autoRotateSpeed;
    }

    // Smooth inertia interpolation
    currentRotY += (targetRotY - currentRotY) * 0.12;
    currentRotX += (targetRotX - currentRotX) * 0.12;

    productWrapper.style.transform = `translateY(-6px) rotateY(${currentRotY}deg) rotateX(${currentRotX}deg) scale(1.02)`;

    if (glare) {
      const normalizedAngle = ((currentRotY % 360) + 360) % 360;
      const glarePos = (normalizedAngle / 360) * 100;
      glare.style.background = `radial-gradient(circle at ${glarePos}% 30%, rgba(255,255,255,0.45) 0%, transparent 60%)`;
    }

    animFrameId = requestAnimationFrame(render360);
  }

  // Start Animation Loop
  render360();

  // Mouse Drag (Desktop)
  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    isInteracting = true;
    startX = e.clientX;
    startY = e.clientY;
    card.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    targetRotY += deltaX * 0.8;
    targetRotX = Math.max(-25, Math.min(25, targetRotX - deltaY * 0.4));
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      card.style.cursor = 'grab';
      setTimeout(() => { isInteracting = false; targetRotX = 0; }, 1800);
    }
  });

  // Touch Drag (Mobile 360 Spin)
  card.addEventListener('touchstart', (e) => {
    isDragging = true;
    isInteracting = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  card.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    startX = touch.clientX;
    startY = touch.clientY;

    targetRotY += deltaX * 1.1;
    targetRotX = Math.max(-20, Math.min(20, targetRotX - deltaY * 0.3));
  }, { passive: true });

  card.addEventListener('touchend', () => {
    isDragging = false;
    setTimeout(() => { isInteracting = false; targetRotX = 0; }, 2000);
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

      const period = tab.getAttribute('data-period');

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

/* ── 8. ORDER MODAL & DIRECT TELEGRAM BOT LEAD DISPATCH ── */
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

// Show Success Confirmation Banner
function showSuccessNotice(customerName) {
  let notice = document.getElementById('leadSuccessNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'leadSuccessNotice';
    notice.className = 'lead-success-popup';
    document.body.appendChild(notice);
  }

  notice.innerHTML = `
    <div class="success-popup-card">
      <div class="success-popup-icon"><i class="fas fa-check-circle"></i></div>
      <h3>Rahmat, ${customerName || "Hurmatli mijoz"}!</h3>
      <p>Buyurtmangiz muvaffaqiyatli qabul qilindi. <strong>5 daqiqa ichida</strong> mutaxassisimiz siz bilan bog'lanadi!</p>
      <button type="button" class="btn btn-luxury btn-full" onclick="document.getElementById('leadSuccessNotice').classList.remove('open')">
        Tushundim
      </button>
    </div>
  `;

  setTimeout(() => { notice.classList.add('open'); }, 100);
  setTimeout(() => { notice.classList.remove('open'); }, 6000);
}

// Direct Async Telegram Dispatch
async function sendLeadToTelegramBot(lead) {
  const message = `
🛍 <b>YANGI BUYURTMA (Desco.premium Sayti)</b>

👤 <b>Xaridor:</b> ${lead.name}
📞 <b>Telefon:</b> <code>${lead.phone}</code>
📦 <b>Model:</b> ${lead.product}
💳 <b>To'lov turi:</b> ${lead.plan}
🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}

⚡ <i>Iltimos, tezkorlik bilan mijozga qo'ng'iroq qiling!</i>
  `.trim();

  try {
    if (TG_BOT_CONFIG.botToken && TG_BOT_CONFIG.chatId) {
      await fetch(`https://api.telegram.org/bot${TG_BOT_CONFIG.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_BOT_CONFIG.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
    }
  } catch (err) {
    console.warn('Telegram Bot API dispatch fallback:', err);
  }

  // Also open Telegram Direct Chat as instant backup if needed
  const tgFallbackUrl = `https://t.me/${TG_BOT_CONFIG.fallbackUsername}?text=${encodeURIComponent(message.replace(/<[^>]*>?/gm, ''))}`;
  return tgFallbackUrl;
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

  // Modal Form Submit -> Send to Bot & Confirm
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...'; }

      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const product = document.getElementById('modalProductName').value;
      const plan = document.getElementById('modalPlan').value;

      await sendLeadToTelegramBot({ name, phone, product, plan });

      closeOrderModal();
      modalForm.reset();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Buyurtmani Tasdiqlash</span>'; }

      showSuccessNotice(name);
    });
  }

  // Lead Section Form Submit -> Send to Bot & Confirm
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...'; }

      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const product = document.getElementById('userProduct').options[document.getElementById('userProduct').selectedIndex].text;
      const plan = document.getElementById('userPlan').options[document.getElementById('userPlan').selectedIndex].text;

      await sendLeadToTelegramBot({ name, phone, product, plan });

      leadForm.reset();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span class="btn-shine"></span><i class="fas fa-paper-plane"></i> <span>Buyurtmani Yuborish</span>'; }

      showSuccessNotice(name);
    });
  }
}
