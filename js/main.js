/**
 * DESCO.PREMIUM — JAVASCRIPT
 * Ketma-ket mahsulotlar, Ranglar tanlash, Swipe, Nasiya kalkulyatori va Telegram bot
 */

const TG_BOT_CONFIG = {
  botToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',
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

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initFaqAccordion();
  initForms();
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

/* ─── 4. COLOR SWITCHING & SLIDING (3-FUNKSIYALIK) ─── */
function changeColorM3(idx) {
  currentIndexM3 = idx;
  const item = COLORS_M3[idx];
  if (!item) return;

  const pic = document.getElementById('picM3');
  const cap = document.getElementById('colorCapM3');
  const row = document.getElementById('swatchesRowM3');

  if (row) {
    const pills = row.querySelectorAll('.swatch-pill');
    pills.forEach((p, i) => {
      if (i === idx) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  if (cap) {
    cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  }

  if (pic) {
    pic.style.opacity = '0.5';
    pic.style.transform = 'scale(0.97)';
    setTimeout(() => {
      pic.src = item.img;
      pic.style.opacity = '1';
      pic.style.transform = 'scale(1)';
    }, 80);
  }
}

function slideM3(dir) {
  let next = (currentIndexM3 + dir + COLORS_M3.length) % COLORS_M3.length;
  changeColorM3(next);
}

/* ─── 5. COLOR SWITCHING & SLIDING (6-FUNKSIYALIK) ─── */
function changeColorM6(idx) {
  currentIndexM6 = idx;
  const item = COLORS_M6[idx];
  if (!item) return;

  const pic = document.getElementById('picM6');
  const cap = document.getElementById('colorCapM6');
  const row = document.getElementById('swatchesRowM6');

  if (row) {
    const pills = row.querySelectorAll('.swatch-pill');
    pills.forEach((p, i) => {
      if (i === idx) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  if (cap) {
    cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  }

  if (pic) {
    pic.style.opacity = '0.5';
    pic.style.transform = 'scale(0.97)';
    setTimeout(() => {
      pic.src = item.img;
      pic.style.opacity = '1';
      pic.style.transform = 'scale(1)';
    }, 80);
  }
}

function slideM6(dir) {
  let next = (currentIndexM6 + dir + COLORS_M6.length) % COLORS_M6.length;
  changeColorM6(next);
}

/* ─── 6. TOUCH SWIPE GESTURES ─── */
function initTouchSwipe() {
  addSwipeListener('stageM3', slideM3);
  addSwipeListener('stageM6', slideM6);
}

function addSwipeListener(elementId, callback) {
  const el = document.getElementById(elementId);
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
        callback(1); // Swipe left -> Next
      } else {
        callback(-1); // Swipe right -> Prev
      }
    }
  }, { passive: true });
}

/* ─── 7. NASIYA ACCORDION TOGGLE ─── */
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

/* ─── 8. SCROLL TO FORM WITH PRODUCT SELECTION ─── */
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

/* ─── 9. FAQ ACCORDION ─── */
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

/* ─── 10. FORM & TELEGRAM DISPATCH ─── */
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
