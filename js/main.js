/**
 * DESCO.PREMIUM — JAVASCRIPT
 * Real-Time Telegram Lead Dispatch, Touch Gestures, Smooth Mobile Phone Mask & Interactive UI
 */

// ─── 1. TELEGRAM BOT CONFIGURATION ───
const TG_BOT_CONFIG = {
  primaryToken: '8849575482:AAH3y_v6lT0Bm1sV3CTmDsxDMaKoJE2D934',  // @webdesco_bot
  backupToken: '8618897926:AAEUvGUuGDF3IDQIQFnY1rD0zXTZdQmL36k',   // @crmhisobchi_bot
  chatIds: ['6710023395'] // Asosiy Admin / Guruh Chat ID
};

// ─── 2. PRODUCT COLOR ASSETS ───
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

// ─── 3. COLOR SWITCHING (3-FUNKSIYALIK) ───
function changeColorM3(idx) {
  currentIndexM3 = (idx + COLORS_M3.length) % COLORS_M3.length;
  const item = COLORS_M3[currentIndexM3];
  if (!item) return;

  const pic = document.getElementById('picM3');
  const cap = document.getElementById('colorCapM3');
  const row = document.getElementById('swatchesRowM3');
  const dots = document.getElementById('dotsM3');

  if (row) {
    row.querySelectorAll('.swatch-pill').forEach((p, i) => {
      p.classList.toggle('active', i === currentIndexM3);
    });
  }

  if (dots) {
    dots.querySelectorAll('.stage-dot-indicator').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndexM3);
    });
  }

  if (cap) cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  if (pic) pic.src = item.img;
}

function slideM3(dir) {
  changeColorM3(currentIndexM3 + dir);
}

// ─── 4. COLOR SWITCHING (6-FUNKSIYALIK) ───
function changeColorM6(idx) {
  currentIndexM6 = (idx + COLORS_M6.length) % COLORS_M6.length;
  const item = COLORS_M6[currentIndexM6];
  if (!item) return;

  const pic = document.getElementById('picM6');
  const cap = document.getElementById('colorCapM6');
  const row = document.getElementById('swatchesRowM6');
  const dots = document.getElementById('dotsM6');

  if (row) {
    row.querySelectorAll('.swatch-pill').forEach((p, i) => {
      p.classList.toggle('active', i === currentIndexM6);
    });
  }

  if (dots) {
    dots.querySelectorAll('.stage-dot-indicator').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndexM6);
    });
  }

  if (cap) cap.innerHTML = `Tanlangan rang: <strong>${item.name}</strong>`;
  if (pic) pic.src = item.img;
}

function slideM6(dir) {
  changeColorM6(currentIndexM6 + dir);
}

// ─── 5. TOUCH SWIPE & MOUSE GESTURES ───
function addSwipeListener(elementId, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let startX = 0;
  let isDown = false;

  el.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      startX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].screenX;
      const diff = endX - startX;
      if (Math.abs(diff) > 35) {
        callback(diff < 0 ? 1 : -1);
      }
    }
  }, { passive: true });

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.screenX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = e.screenX - startX;
    if (Math.abs(diff) > 40) {
      callback(diff < 0 ? 1 : -1);
    }
  });
}

function initTouchSwipe() {
  addSwipeListener('stageM3', slideM3);
  addSwipeListener('stageM6', slideM6);
}

// ─── 6. NASIYA ACCORDION ───
function toggleNasiyaAccordion(boxId, btnEl) {
  const box = document.getElementById(boxId);
  if (!box) return;

  const isOpen = box.classList.contains('open');
  if (isOpen) {
    box.classList.remove('open');
    if (btnEl) btnEl.classList.remove('active');
  } else {
    box.classList.add('open');
    if (btnEl) btnEl.classList.add('active');
  }
}

// ─── 7. SCROLL TO FORM WITH AUTO-SELECT ───
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
    }, 450);
  }
}

// ─── 8. FAQ ACCORDION ───
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

// ─── 9. HEADER & MOBILE NAVIGATION DRAWER ───
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

// ─── 10. SUCCESS MODAL NOTIFICATION ───
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

  setTimeout(() => { notice.classList.add('open'); }, 40);
  setTimeout(() => { notice.classList.remove('open'); }, 7500);
}

// ─── 11. ULTRA-RESILIENT TELEGRAM LEAD DISPATCH ───
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

  // Target chat IDs
  const chatIds = [...TG_BOT_CONFIG.chatIds];

  // Restore cached chat IDs from localStorage
  try {
    const saved = localStorage.getItem('desco_lead_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => {
          if (!chatIds.includes(String(id))) chatIds.push(String(id));
        });
      }
    }
  } catch (e) {}

  const botTokens = [TG_BOT_CONFIG.primaryToken, TG_BOT_CONFIG.backupToken].filter(Boolean);
  const requests = [];

  const encodedText = encodeURIComponent(message);

  for (const token of botTokens) {
    for (const cid of chatIds) {
      // 1. Direct GET fetch (No CORS preflight restrictions, works on iOS/Android/Chrome/Safari)
      const getUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${cid}&text=${encodedText}&parse_mode=HTML`;
      requests.push(
        fetch(getUrl, { method: 'GET', mode: 'no-cors' }).catch(() => {})
      );

      // 2. Direct POST fetch with JSON
      requests.push(
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cid,
            text: message,
            parse_mode: 'HTML'
          })
        }).catch(() => {})
      );

      // 3. Guaranteed Image beacon (immune to all fetch/CORS blocks)
      try {
        const beacon = new Image();
        beacon.src = getUrl;
      } catch (e) {}
    }
  }

  // 4. Server API Dispatch (if running locally/production)
  try {
    requests.push(
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }).catch(() => {})
    );
  } catch (e) {}

  // Wait max 1.2s so user UI feels instant
  await Promise.race([
    Promise.allSettled(requests),
    new Promise(resolve => setTimeout(resolve, 1200))
  ]);

  // Background check for newly started chat updates
  fetch(`https://api.telegram.org/bot${TG_BOT_CONFIG.primaryToken}/getUpdates`)
    .then(res => res.json())
    .then(data => {
      if (data && data.ok && Array.isArray(data.result)) {
        const discovered = new Set(chatIds);
        data.result.forEach(u => {
          if (u.message && u.message.chat && u.message.chat.id) discovered.add(String(u.message.chat.id));
          if (u.my_chat_member && u.my_chat_member.chat && u.my_chat_member.chat.id) discovered.add(String(u.my_chat_member.chat.id));
        });
        localStorage.setItem('desco_lead_chats', JSON.stringify(Array.from(discovered)));
      }
    })
    .catch(() => {});
}

// ─── 12. PHONE INPUT MASK (NATURAL & MOBILE FRIENDLY) ───
function formatUzPhone(raw) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.substring(3);
  }
  digits = digits.substring(0, 9); // 9 digits after 998

  if (digits.length === 0) return '';

  let out = '+998 ';
  if (digits.length > 0) out += '(' + digits.substring(0, 2);
  if (digits.length >= 2) out += ') ';
  if (digits.length > 2) out += digits.substring(2, 5);
  if (digits.length >= 5) out += '-';
  if (digits.length > 5) out += digits.substring(5, 7);
  if (digits.length >= 7) out += '-';
  if (digits.length > 7) out += digits.substring(7, 9);

  return out;
}

function initForms() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(inp => {
    inp.addEventListener('input', (e) => {
      const formatted = formatUzPhone(e.target.value);
      e.target.value = formatted;
    });

    inp.addEventListener('focus', (e) => {
      if (!e.target.value.trim()) {
        e.target.value = '+998 ';
      }
    });

    inp.addEventListener('blur', (e) => {
      if (e.target.value.trim() === '+998 ' || e.target.value.trim() === '+998') {
        e.target.value = '';
      }
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
      } catch (err) {
        console.error('Lead submission error:', err);
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

// ─── 13. GLOBAL BINDINGS & INIT ───
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
