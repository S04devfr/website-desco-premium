/**
 * DESCO.PREMIUM — JAVASCRIPT
 * Hero Studio Showcase, Model Switcher, Touch Swipe, Ranglar tanlash, Nasiya va Telegram bot
 */

const TG_BOT_CONFIG = {
  botToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',
  botUsername: 'webdesco_bot'
};

/* ─── 1. MODELLAR VA RANG MA'LUMOTLARI ─── */
const STUDIO_DATA = {
  m6: {
    code: '6ta-silver',
    title: '6-Funksiyalik Oyoq Massajeri (Katta Model)',
    cashPrice: '1,800,000',
    monthlyPrice: '225,000 so'm/oy',
    orderBtnText: 'Ushbu 6-Funksiyalikni Buyurtma Qilish',
    colors: [
      { name: "Tillo rang (Champagne Gold)", img: "img/model6-gold.jpg", dotClass: "swatch-gold" },
      { name: "Qora (Obsidian Black)", img: "img/model6-black.jpg", dotClass: "swatch-black" },
      { name: "Seriy (Silver Edition)", img: "img/model6-silver.jpg", dotClass: "swatch-silver" }
    ]
  },
  m3: {
    code: '3ta-gold',
    title: '3-Funksiyalik Oyoq Massajeri (Ixcham Model)',
    cashPrice: '1,300,000',
    monthlyPrice: '163,000 so'm/oy',
    orderBtnText: 'Ushbu 3-Funksiyalikni Buyurtma Qilish',
    colors: [
      { name: "Seriy (Metallic Silver)", img: "img/model3-silver.jpg", dotClass: "swatch-silver" },
      { name: "Qora (Obsidian Black)", img: "img/model3-black.jpg", dotClass: "swatch-black" },
      { name: "Tillo rang (Champagne Gold)", img: "img/model3-gold.jpg", dotClass: "swatch-gold" }
    ]
  },
  gift: {
    code: 'gift-set',
    title: '5-tasi-1 Desco.premium Hadiya To'plami',
    cashPrice: '3,500,000',
    monthlyPrice: '437,000 so'm/oy',
    orderBtnText: 'Ushbu Hadiya To'plamini Buyurtma Qilish',
    colors: [
      { name: "5-in-1 Maxsus To'plam Qutisi", img: "img/gift-product-trans.png", dotClass: "swatch-gold" }
    ]
  }
};

let currentModelKey = 'm6';
let currentColorIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initFaqAccordion();
  initForms();
  initStudio();
  initTouchSwipe();
});

/* ─── 2. HEADER SCROLL ─── */
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─── 3. MOBILE DRAWER NAV ─── */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const links = document.querySelectorAll('.nav-link');

  function openNav(e) {
    if (e) e.preventDefault();
    nav?.classList.add('open');
    overlay?.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function closeNav(e) {
    if (e) e.preventDefault();
    nav?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  if (toggle) toggle.addEventListener('click', openNav);
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

/* ─── 4. STUDIO INTERACTION ─── */
function initStudio() {
  renderStudioUI();
}

function selectStudioModel(key) {
  if (!STUDIO_DATA[key]) return;
  currentModelKey = key;
  currentColorIndex = 0;

  // Tabs
  document.getElementById('tabM6')?.classList.toggle('active', key === 'm6');
  document.getElementById('tabM3')?.classList.toggle('active', key === 'm3');
  document.getElementById('tabGift')?.classList.toggle('active', key === 'gift');

  renderStudioUI();
}

function renderStudioUI() {
  const data = STUDIO_DATA[currentModelKey];
  const color = data.colors[currentColorIndex] || data.colors[0];

  // Image
  const pic = document.getElementById('studioPic');
  if (pic) {
    pic.style.opacity = '0.5';
    pic.style.transform = 'scale(0.97)';
    setTimeout(() => {
      pic.src = color.img;
      pic.style.opacity = '1';
      pic.style.transform = 'scale(1)';
    }, 80);
  }

  // Prices & CTA
  const cashEl = document.getElementById('studioCashPrice');
  const monthlyEl = document.getElementById('studioMonthlyPrice');
  const btnTextEl = document.getElementById('studioOrderBtnText');
  const capEl = document.getElementById('studioColorCaption');

  if (cashEl) cashEl.innerHTML = `${data.cashPrice} <small>so'm</small>`;
  if (monthlyEl) monthlyEl.innerText = data.monthlyPrice;
  if (btnTextEl) btnTextEl.innerText = data.orderBtnText;
  if (capEl) capEl.innerHTML = `Tanlangan rang: <strong>${color.name}</strong>`;

  // Swatches
  const row = document.getElementById('studioSwatchesRow');
  if (row) {
    row.innerHTML = '';
    data.colors.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = `swatch-pill ${idx === currentColorIndex ? 'active' : ''}`;
      btn.innerHTML = `<span class="swatch-dot ${c.dotClass}"></span><span>${c.name.split(' ')[0]}</span>`;
      btn.onclick = () => selectStudioColor(idx);
      row.appendChild(btn);
    });
  }
}

function selectStudioColor(idx) {
  const data = STUDIO_DATA[currentModelKey];
  if (!data.colors[idx]) return;
  currentColorIndex = idx;
  renderStudioUI();
}

function slideStudio(dir) {
  const data = STUDIO_DATA[currentModelKey];
  const len = data.colors.length;
  currentColorIndex = (currentColorIndex + dir + len) % len;
  renderStudioUI();
}

function orderCurrentStudioModel() {
  const data = STUDIO_DATA[currentModelKey];
  scrollToContact(data.code);
}

/* ─── 5. TOUCH SWIPE (MOBILE & DESKTOP GESTURES) ─── */
function initTouchSwipe() {
  const el = document.getElementById('studioViewport');
  if (!el) return;

  let touchStartX = 0;
  let touchEndX = 0;

  el.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 35) {
      if (diff < 0) {
        slideStudio(1); // Swipe left -> Next
      } else {
        slideStudio(-1); // Swipe right -> Prev
      }
    }
  }, { passive: true });
}

/* ─── 6. NASIYA ACCORDION TOGGLE ─── */
function toggleNasiyaAccordion(boxId, btnEl) {
  const box = document.getElementById(boxId);
  if (!box) return;

  const isOpen = box.classList.contains('open');
  if (isOpen) {
    box.classList.remove('open');
    btnEl?.classList.remove('active');
  } else {
    box.classList.add('open');
    btnEl?.classList.add('active');
  }
}

/* ─── 7. SCROLL TO FORM WITH PRODUCT SELECTION ─── */
function scrollToContact(productCode) {
  const contactSec = document.getElementById('contact');
  const userProduct = document.getElementById('userProduct');
  const userName = document.getElementById('userName');

  if (userProduct && productCode) {
    userProduct.value = productCode;
  }

  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (userName) userName.focus();
    }, 600);
  }
}

/* ─── 8. FAQ ACCORDION ─── */
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

/* ─── 9. FORM & TELEGRAM DISPATCH ─── */
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
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Buyurtmani Tasdiqlash</span>'; }

      showSuccessNotice(name);
    });
  }
}
