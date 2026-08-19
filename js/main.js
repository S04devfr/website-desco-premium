/**
 * DESCO.PREMIUM — MAIN JAVASCRIPT & UNIFIED HERO SHOWCASE
 * High-Definition Color Switching, Live Anatomical Leg Simulator, Compact Footer & Telegram Dispatch
 */

const TG_BOT_CONFIG = {
  botToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',
  botUsername: 'webdesco_bot'
};

// Global State
let activeModelKey = 'gold'; // 'gold' (3-func), 'silver' (6-func), 'gift' (To'plam)
let currentColorIndex = 0;
let activeNasiyaPlanMonths = '12';

const MODEL_COLOR_DATA = {
  gold: [
    { name: "Tillo rang (Champagne Gold)", img: "img/color-3-gold.png" },
    { name: "Seriy (Metallic Silver)", img: "img/color-3-silver.png" },
    { name: "Qora (Obsidian Black)", img: "img/color-3-black.png" },
    { name: "Qizil (Ruby Red Edition)", img: "img/color-3-red.png" }
  ],
  silver: [
    { name: "Seriy (Silver Edition)", img: "img/color-6-silver.png" },
    { name: "Qora (Obsidian Black)", img: "img/color-6-black.png" },
    { name: "Tillo (Champagne Gold)", img: "img/color-6-gold.png" }
  ],
  gift: [
    { name: "Qora Premium Qutida", img: "img/gift-product-trans.png" }
  ]
};

const PRICING_DATA = {
  gold: {
    title: "3-Funksiyalik Oyoq Massajeri",
    p3: "563,000 so'm/oy",
    p6: "303,000 so'm/oy",
    p12: "163,000 so'm/oy",
    badgePrice: "Oyiga 163,000 so'mdan (12 oy nasiya)",
    cash: "1,300,000 so'm",
    code: "3ta-gold"
  },
  silver: {
    title: "6-Funksiyalik Oyoq Massajeri",
    p3: "780,000 so'm/oy",
    p6: "420,000 so'm/oy",
    p12: "225,000 so'm/oy",
    badgePrice: "Oyiga 225,000 so'mdan (12 oy nasiya)",
    cash: "1,800,000 so'm",
    code: "6ta-silver"
  },
  gift: {
    title: "Desco.premium 5-in-1 Hadiya To'plami",
    p3: "1,516,000 so'm/oy",
    p6: "816,000 so'm/oy",
    p12: "437,000 so'm/oy",
    badgePrice: "Oyiga 437,000 so'mdan (12 oy nasiya)",
    cash: "3,500,000 so'm",
    code: "gift-set"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initRogCarousel();
  initFaqAccordion();
  initForms();
  updateNasiyaCardUI();
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

/* ── 3. EXPANDABLE NASIYA PRICING CARD TOGGLE ── */
function toggleNasiyaCard() {
  const card = document.getElementById('expandableNasiyaCard');
  const toggleBtn = document.getElementById('btnNasiyaToggle');

  if (card && toggleBtn) {
    const isOpen = card.classList.contains('open');
    if (isOpen) {
      card.classList.remove('open');
      toggleBtn.classList.remove('active');
    } else {
      card.classList.add('open');
      toggleBtn.classList.add('active');
      updateNasiyaCardUI();
    }
  }
}

function selectNasiyaPlan(months) {
  activeNasiyaPlanMonths = months;
  const boxes = document.querySelectorAll('.nasiya-plan-box');
  boxes.forEach(b => b.classList.remove('active'));

  if (months === '3') boxes[0]?.classList.add('active');
  if (months === '6') boxes[1]?.classList.add('active');
  if (months === '12') boxes[2]?.classList.add('active');
}

function updateNasiyaCardUI() {
  const p = PRICING_DATA[activeModelKey];
  const cData = MODEL_COLOR_DATA[activeModelKey][currentColorIndex];

  const titleEl = document.getElementById('nasiyaModelTitle');
  const colorTagEl = document.getElementById('nasiyaModelColorTag');
  const badgeText = document.getElementById('heroLiveBadgeText');
  const val3 = document.getElementById('nasiyaVal3');
  const val6 = document.getElementById('nasiyaVal6');
  const val12 = document.getElementById('nasiyaVal12');
  const cashVal = document.getElementById('nasiyaCashVal');

  if (titleEl) titleEl.textContent = p.title;
  if (badgeText) badgeText.textContent = p.badgePrice;
  if (colorTagEl && cData) colorTagEl.innerHTML = `<i class="fas fa-palette gold-icon"></i> Tanlangan rang: ${cData.name}`;
  
  if (val3) val3.innerHTML = `${p.p3.split(' ')[0]} <small>so'm/oy</small>`;
  if (val6) val6.innerHTML = `${p.p6.split(' ')[0]} <small>so'm/oy</small>`;
  if (val12) val12.innerHTML = `${p.p12.split(' ')[0]} <small>so'm/oy</small>`;
  if (cashVal) cashVal.textContent = p.cash;
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
        carouselSlide(1);
      } else {
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
  const tabGift = document.getElementById('demoTabGift');

  const swatches3 = document.getElementById('swatches3Func');
  const swatches6 = document.getElementById('swatches6Func');
  const swatchesGift = document.getElementById('swatchesGift');

  [tabGold, tabSilver, tabGift].forEach(t => t?.classList.remove('active'));

  if (model === 'gold') {
    tabGold?.classList.add('active');
    swatches3.style.display = 'flex';
    swatches6.style.display = 'none';
    swatchesGift.style.display = 'none';
  } else if (model === 'silver') {
    tabSilver?.classList.add('active');
    swatches3.style.display = 'none';
    swatches6.style.display = 'flex';
    swatchesGift.style.display = 'none';
  } else {
    tabGift?.classList.add('active');
    swatches3.style.display = 'none';
    swatches6.style.display = 'none';
    swatchesGift.style.display = 'flex';
  }

  updateCarouselUI();
  updateNasiyaCardUI();
}

function setCarouselColor(index) {
  currentColorIndex = index;
  updateCarouselUI();
  updateNasiyaCardUI();
}

function carouselSlide(dir) {
  const colors = MODEL_COLOR_DATA[activeModelKey];
  if (!colors) return;
  
  currentColorIndex = (currentColorIndex + dir + colors.length) % colors.length;
  updateCarouselUI();
  updateNasiyaCardUI();
}

function updateCarouselUI() {
  const colors = MODEL_COLOR_DATA[activeModelKey];
  if (!colors || !colors[currentColorIndex]) return;

  const currentItem = colors[currentColorIndex];
  const simImg = document.getElementById('heroProductPic');
  
  let swatchesGroup = document.getElementById('swatches3Func');
  if (activeModelKey === 'silver') swatchesGroup = document.getElementById('swatches6Func');

  if (swatchesGroup && activeModelKey !== 'gift') {
    const btns = swatchesGroup.querySelectorAll('.swatch-btn');
    btns.forEach((b, idx) => {
      if (idx === currentColorIndex) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  if (simImg) {
    simImg.style.opacity = '0.7';
    simImg.style.transform = 'scale(0.97)';
    
    setTimeout(() => {
      simImg.src = currentItem.img;
      simImg.style.opacity = '1';
      simImg.style.transform = 'scale(1)';
    }, 120);
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
    if (arena) arena.classList.add('running');
    if (toggleBtn) toggleBtn.classList.add('running');
    if (toggleText) toggleText.textContent = "Massajni To'xtatish";
    if (toggleIcon) toggleIcon.className = "fas fa-stop";
    if (hudStatus) hudStatus.classList.add('active');
    if (hudStatusText) hudStatusText.textContent = "MASSAJ JARAYONI FAOL";
    if (modeVal) modeVal.textContent = "3D Airbag & Rolik";

    let pStep = 0;
    const pressures = [38, 54, 68, 82, 60, 32, 48, 75, 86, 64, 35];
    simulatorPressureInterval = setInterval(() => {
      pStep = (pStep + 1) % pressures.length;
      if (pressureVal) pressureVal.textContent = pressures[pStep] + " kPa";

      if (pStep < 4) {
        phase1?.classList.add('active');
        phase2?.classList.remove('active');
        phase3?.classList.remove('active');
      } else if (pStep < 8) {
        phase1?.classList.remove('active');
        phase2?.classList.add('active');
        phase3?.classList.remove('active');
      } else {
        phase1?.classList.remove('active');
        phase2?.classList.remove('active');
        phase3?.classList.add('active');
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
    if (arena) arena.classList.remove('running');
    if (toggleBtn) toggleBtn.classList.remove('running');
    if (toggleText) toggleText.textContent = "Massajni Ishga Tushirish";
    if (toggleIcon) toggleIcon.className = "fas fa-play";
    if (hudStatus) hudStatus.classList.remove('active');
    if (hudStatusText) hudStatusText.textContent = "KUTISH REJIMI";
    if (pressureVal) pressureVal.textContent = "0 kPa";
    if (modeVal) modeVal.textContent = "Avtomatik Massaj";

    clearInterval(simulatorPressureInterval);
    clearInterval(simulatorTimerInterval);
    currentSeconds = 900;
    if (timerVal) timerVal.textContent = "15:00";
    phase1?.classList.add('active');
    phase2?.classList.remove('active');
    phase3?.classList.remove('active');
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

function scrollToContactWithPrefill() {
  const pData = PRICING_DATA[activeModelKey];
  scrollToContact(pData ? pData.code : 'all');

  const userPlan = document.getElementById('userPlan');
  if (userPlan) {
    if (activeNasiyaPlanMonths === '12') userPlan.value = '12-oy';
    if (activeNasiyaPlanMonths === '6') userPlan.value = '6-oy';
    if (activeNasiyaPlanMonths === '3') userPlan.value = '3-oy';
  }
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

/* ── 8. DIRECT TELEGRAM BOT LEAD DISPATCH ── */
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
      const productSelect = document.getElementById('userProduct');
      const product = productSelect.options[productSelect.selectedIndex].text;
      const plan = document.getElementById('userPlan').options[document.getElementById('userPlan').selectedIndex].text;

      await sendLeadToTelegramBot({ name, phone, product, plan });

      leadForm.reset();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span class="btn-shine"></span><i class="fas fa-paper-plane"></i> <span>Buyurtmani Yuborish</span>'; }

      showSuccessNotice(name);
    });
  }
}
