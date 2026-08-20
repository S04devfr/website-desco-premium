/**
 * DESCO.PREMIUM — JAVASCRIPT
 * Mahsulotlar almashishi, Ranglar palitrasi, Touch Swipe, Nasiya kalkulyatori va Telegram Lead Integratsiyasi
 */

const TG_BOT_CONFIG = {
  botToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',    // @webdesco_bot (Asosiy Bot)
  crmBotToken: '8618897926:AAEUvGUuGDF3IDQIQFnY1rD0zXTZdQmL36k', // @crmhisobchi_bot (CRM Bot)
  chatIds: ['6710023395'], // Asosiy qabul qiluvchi Admin / Guruh Chat ID
  botUsername: 'webdesco_bot'
};

/* ─── 1. MAHSULOT RANG MA'LUMOTLARI (ASL RASMLAR) ─── */
const COLORS_M3 = [
  { name: "Seriy (Metallic Silver)", img: "img/model3-silver.jpg" },
  { name: "Qora (Obsidian Black)", img: "img/model3-black.jpg" },
  { name: "Tillo rang (Champagne Gold)", img: "img/model3-gold.jpg" }
];

const COLORS_M6 = [
  { name: "Tillo rang (Champagne Gold)", img: "img/model6-gold.jpg" },
  { name: "Qora (Obsidian Black)", img: "img/model6-black.jpg" },
  { name: "Seriy (Silver Edition)", img: "img/model6-silver.jpg" }
];

let currentIndexM3 = 0;
let currentIndexM6 = 0;

/* ─── 2. COLOR SWITCHING & SLIDING (3-FUNKSIYALIK) ─── */
function changeColorM3(idx) {
  currentIndexM3 = (idx + COLORS_M3.length) % COLORS_M3.length;
  const item = COLORS_M3[currentIndexM3];
  if (!item) return;

  const pic = document.getElementById('picM3');
  const cap = document.getElementById('colorCapM3');
  const row = document.getElementById('swatchesRowM3');
  const dots = document.getElementById('dotsM3');

  if (row) {
    const pills = row.querySelectorAll('.swatch-pill');
    pills.forEach((p, i) => {
      p.classList.toggle('active', i === currentIndexM3);
    });
  }

  if (dots) {
    const dotEls = dots.querySelectorAll('.stage-dot-indicator');
    dotEls.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndexM3);
    });
  }

  if (cap) {
    cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  }

  if (pic) {
    pic.src = item.img;
  }
}

function slideM3(dir) {
  changeColorM3(currentIndexM3 + dir);
}

/* ─── 3. COLOR SWITCHING & SLIDING (6-FUNKSIYALIK) ─── */
function changeColorM6(idx) {
  currentIndexM6 = (idx + COLORS_M6.length) % COLORS_M6.length;
  const item = COLORS_M6[currentIndexM6];
  if (!item) return;

  const pic = document.getElementById('picM6');
  const cap = document.getElementById('colorCapM6');
  const row = document.getElementById('swatchesRowM6');
  const dots = document.getElementById('dotsM6');

  if (row) {
    const pills = row.querySelectorAll('.swatch-pill');
    pills.forEach((p, i) => {
      p.classList.toggle('active', i === currentIndexM6);
    });
  }

  if (dots) {
    const dotEls = dots.querySelectorAll('.stage-dot-indicator');
    dotEls.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndexM6);
    });
  }

  if (cap) {
    cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  }

  if (pic) {
    pic.src = item.img;
  }
}

function slideM6(dir) {
  changeColorM6(currentIndexM6 + dir);
}

/* ─── 4. TOUCH SWIPE & MOUSE DRAG GESTURES ─── */
function addSwipeListener(elementId, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let startX = 0;
  let isDown = false;

  // Touch events
  el.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].screenX;
    const diff = endX - startX;
    if (Math.abs(diff) > 30) {
      if (diff < 0) {
        callback(1); // Swipe left -> Next
      } else {
        callback(-1); // Swipe right -> Prev
      }
    }
  }, { passive: true });

  // Mouse drag events (Desktop)
  el.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.screenX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    const endX = e.screenX;
    const diff = endX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        callback(1);
      } else {
        callback(-1);
      }
    }
  });
}

function initTouchSwipe() {
  addSwipeListener('stageM3', slideM3);
  addSwipeListener('stageM6', slideM6);
}

/* ─── 5. NASIYA ACCORDION TOGGLE ─── */
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

/* ─── 6. SCROLL TO FORM WITH PRODUCT SELECTION ─── */
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

/* ─── 7. FAQ ACCORDION ─── */
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

/* ─── 8. HEADER SCROLL & MOBILE NAV ─── */
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

/* ─── 9. FORM & TELEGRAM LEAD DISPATCH ─── */
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

  setTimeout(() => { notice.classList.add('open'); }, 50);
  setTimeout(() => { notice.classList.remove('open'); }, 7000);
}

async function sendLeadToTelegramBot(lead) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Tashkent' });
  const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tashkent' });

  const message = `
🛍 <b>YANGI BUYURTMA — DESCO.PREMIUM LEAD</b>

👤 <b>Mijoz:</b> ${lead.name || "Noma'lum"}
📞 <b>Telefon:</b> <code>${lead.phone || "Kiritilmadi"}</code>
📦 <b>Mahsulot:</b> ${lead.product || "Massajer"}
💳 <b>To'lov turi:</b> ${lead.plan || "Nasiya"}
🌐 <b>Manba:</b> Desco Landing Sayti
🕒 <b>Vaqt:</b> ${dateStr} | ${timeStr}

⚡ <i>Iltimos, tezkorlik bilan mijozga qo'ng'iroq qiling!</i>
  `.trim();

  // Target chat IDs: configured admin IDs + any cached chats
  const targetChatIds = new Set(TG_BOT_CONFIG.chatIds);

  // Restore remembered chats
  try {
    const saved = localStorage.getItem('desco_lead_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) parsed.forEach(id => targetChatIds.add(id));
    }
  } catch (e) {}

  // Check getUpdates to discover any newly started chats
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const updatesRes = await fetch(`https://api.telegram.org/bot${TG_BOT_CONFIG.botToken}/getUpdates`, { signal: controller.signal });
    clearTimeout(timeoutId);
    const updatesData = await updatesRes.json();

    if (updatesData.ok && Array.isArray(updatesData.result)) {
      updatesData.result.forEach(u => {
        if (u.message && u.message.chat && u.message.chat.id) targetChatIds.add(u.message.chat.id);
        if (u.my_chat_member && u.my_chat_member.chat && u.my_chat_member.chat.id) targetChatIds.add(u.my_chat_member.chat.id);
      });
      localStorage.setItem('desco_lead_chats', JSON.stringify(Array.from(targetChatIds)));
    }
  } catch (e) {}

  // Dispatch to all configured Telegram bots
  const botTokens = [TG_BOT_CONFIG.botToken, TG_BOT_CONFIG.crmBotToken].filter(Boolean);
  const sendPromises = [];

  for (const botToken of botTokens) {
    for (const chatId of targetChatIds) {
      const p = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      }).catch(err => console.error(`Telegram Bot Dispatch Error [${chatId}]:`, err));
      sendPromises.push(p);
    }
  }

  // Also notify server backend if available
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    }).catch(() => {});
  } catch (e) {}

  await Promise.allSettled(sendPromises);
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
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Yuborilmoqda...</span>';
      }

      const name = document.getElementById('userName')?.value?.trim() || '';
      const phone = document.getElementById('userPhone')?.value?.trim() || '';
      const productSelect = document.getElementById('userProduct');
      const product = productSelect ? productSelect.options[productSelect.selectedIndex].text : '';
      const planSelect = document.getElementById('userPlan');
      const plan = planSelect ? planSelect.options[planSelect.selectedIndex].text : '';

      try {
        await sendLeadToTelegramBot({ name, phone, product, plan });
      } catch (sendErr) {
        console.error('Lead submission error:', sendErr);
      }

      leadForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Buyurtmani Tasdiqlash</span>';
      }

      showSuccessNotice(name);
    });
  }
}

// Global scope bindings
window.changeColorM3 = changeColorM3;
window.slideM3 = slideM3;
window.changeColorM6 = changeColorM6;
window.slideM6 = slideM6;
window.toggleNasiyaAccordion = toggleNasiyaAccordion;
window.scrollToContact = scrollToContact;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initFaqAccordion();
  initForms();
  initTouchSwipe();
});
