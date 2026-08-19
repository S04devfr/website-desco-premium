/**
 * DESCO.PREMIUM — MAIN JAVASCRIPT & ROG-STYLE INTERACTIVE COLOR CAROUSEL
 * Swipeable color carousel (ROG/Apple style), clean hero switcher & direct Telegram lead dispatch
 */

const TG_BOT_CONFIG = {
  botToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',
  botUsername: 'webdesco_bot'
};

// Global Carousel State
let activeModelKey = 'gold'; // 'gold' (3-func) or 'silver' (6-func)
let currentColorIndex = 0;

const MODEL_COLOR_DATA = {
  gold: [
    { name: "Tillo rang (Champagne Gold)", img: "img/color-3-gold.png", glow: "rgba(197, 155, 39, 0.3)" },
    { name: "Seriy (Metallic Silver)", img: "img/color-3-silver.png", glow: "rgba(156, 163, 175, 0.3)" },
    { name: "Qora (Obsidian Black)", img: "img/color-3-black.png", glow: "rgba(30, 30, 30, 0.4)" },
    { name: "Qizil (Ruby Red Edition)", img: "img/color-3-red.png", glow: "rgba(239, 68, 68, 0.35)" }
  ],
  silver: [
    { name: "Seriy (Silver Edition)", img: "img/color-6-silver.png", glow: "rgba(156, 163, 175, 0.3)" },
    { name: "Qora (Obsidian Black)", img: "img/color-6-black.png", glow: "rgba(30, 30, 30, 0.4)" },
    { name: "Tillo (Champagne Gold)", img: "img/color-6-gold.png", glow: "rgba(197, 155, 39, 0.3)" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHeroSwitcher();
  initRogCarousel();
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

/* ── 3. HERO MODEL SWITCHER ── */
function initHeroSwitcher() {
  const switchBtns = document.querySelectorAll('.h-switch-btn');
  const heroPic = document.getElementById('heroProductPic');
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

      if (heroPic) {
        heroPic.style.opacity = '0';
        heroPic.style.transform = 'scale(0.92) translateY(8px)';
        setTimeout(() => {
          heroPic.src = imgPath;
          heroPic.style.opacity = '1';
          heroPic.style.transform = 'scale(1) translateY(0)';
        }, 220);
      }
    });
  });
}

/* ── 4. ROG/APPLE STYLE SWIPEABLE COLOR CAROUSEL ── */
function initRogCarousel() {
  const container = document.getElementById('rogCarouselContainer');
  if (!container) return;

  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        // Swiped Left -> Next color
        carouselSlide(1);
      } else {
        // Swiped Right -> Prev color
        carouselSlide(-1);
      }
    }
  }
}

function selectDemoModel(model) {
  activeModelKey = model;
  currentColorIndex = 0;

  const tabGold = document.getElementById('demoTabGold');
  const tabSilver = document.getElementById('demoTabSilver');
  const swatches3 = document.getElementById('swatches3Func');
  const swatches6 = document.getElementById('swatches6Func');

  if (model === 'gold') {
    tabGold.classList.add('active');
    tabSilver.classList.remove('active');
    swatches3.style.display = 'flex';
    swatches6.style.display = 'none';
  } else {
    tabSilver.classList.add('active');
    tabGold.classList.remove('active');
    swatches3.style.display = 'none';
    swatches6.style.display = 'flex';
  }

  updateCarouselUI();
}

function setCarouselColor(index) {
  currentColorIndex = index;
  updateCarouselUI();
}

function carouselSlide(dir) {
  const colors = MODEL_COLOR_DATA[activeModelKey];
  if (!colors) return;
  
  currentColorIndex = (currentColorIndex + dir + colors.length) % colors.length;
  updateCarouselUI();
}

function updateCarouselUI() {
  const colors = MODEL_COLOR_DATA[activeModelKey];
  if (!colors || !colors[currentColorIndex]) return;

  const currentItem = colors[currentColorIndex];
  const simImg = document.getElementById('simRealImg');
  const activeColorName = document.getElementById('activeColorName');
  
  const swatchesGroup = activeModelKey === 'gold' ? document.getElementById('swatches3Func') : document.getElementById('swatches6Func');

  // Update Swatch buttons active state
  if (swatchesGroup) {
    const btns = swatchesGroup.querySelectorAll('.swatch-btn');
    btns.forEach((b, idx) => {
      if (idx === currentColorIndex) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  // Smooth ROG 3D slide transition
  if (simImg) {
    simImg.style.opacity = '0.2';
    simImg.style.transform = 'scale(0.92) translateX(12px)';
    
    setTimeout(() => {
      simImg.src = currentItem.img;
      simImg.style.opacity = '1';
      simImg.style.transform = 'scale(1) translateX(0)';
    }, 180);
  }

  if (activeColorName) {
    activeColorName.textContent = currentItem.name;
  }
}

/* ── 5. LIVE MASSAGE SIMULATOR ENGINE ── */
let isSimulatorRunning = false;
let simulatorTimerInterval = null;
let simulatorPressureInterval = null;
let currentSeconds = 900;

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

/* ── 6. SMOOTH SCROLL TO CONTACT LEAD FORM WITH PREFILL ── */
function scrollToContact(productCode) {
  const contactSec = document.getElementById('contact');
  const userProduct = document.getElementById('userProduct');
  const userName = document.getElementById('userName');

  if (userProduct && productCode !== 'all') {
    userProduct.value = productCode;
  }

  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (userName) userName.focus();
    }, 600);
  }
}

/* ── 7. CATALOG INSTALLMENT DURATION FILTER ── */
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

/* ── 8. FAQ ACCORDION ── */
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

/* ── 9. DIRECT TELEGRAM BOT LEAD DISPATCH ── */
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
  setTimeout(() => { notice.classList.remove('open'); }, 6500);
}

async function sendLeadToTelegramBot(lead) {
  const message = `
🛍 <b>YANGI BUYURTMA (Desco.premium)</b>

👤 <b>Xaridor:</b> ${lead.name}
📞 <b>Telefon:</b> <code>${lead.phone}</code>
📦 <b>Model:</b> ${lead.product}
💳 <b>To'lov turi:</b> ${lead.plan}
🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}

⚡ <i>Iltimos, tezkorlik bilan mijozga qo'ng'iroq qiling!</i>
  `.trim();

  try {
    const updatesRes = await fetch(`https://api.telegram.org/bot${TG_BOT_CONFIG.botToken}/getUpdates`);
    const updatesData = await updatesRes.json();
    
    const targetChatIds = new Set();

    if (updatesData.ok && Array.isArray(updatesData.result)) {
      updatesData.result.forEach(u => {
        if (u.message && u.message.chat && u.message.chat.id) {
          targetChatIds.add(u.message.chat.id);
        } else if (u.my_chat_member && u.my_chat_member.chat && u.my_chat_member.chat.id) {
          targetChatIds.add(u.my_chat_member.chat.id);
        }
      });
    }

    if (targetChatIds.size > 0) {
      for (const chatId of targetChatIds) {
        fetch(`https://api.telegram.org/bot${TG_BOT_CONFIG.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        }).catch(err => console.error('Send error for chat:', chatId, err));
      }
    }
  } catch (err) {
    console.error('Telegram Bot Dispatch Error:', err);
  }
}

function initForms() {
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
