/* ═══════════════════════════════════════════════════════════════════════════════
   DESCO PREMIUM — LEAD FRONTEND LOGIC & THREE.JS 3D INTERACTIVITY
   ═══════════════════════════════════════════════════════════════════════════════ */

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

  // ── 4. Installment Duration Switcher (Tabs) ──
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
            row.classList.add('gold-highlight');
          } else if (card.classList.contains('vip-gift-card')) {
            row.classList.add('dark-highlight');
          } else {
            row.classList.add('highlight');
          }
        }
      });
    });
  });

  // ── 5. FAQ Accordion ──
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

  // ── 6. Phone Mask Formatter ──
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

  // ── 7. Lead Form Submission to Telegram ──
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

  // ── 8. Modal Order Form ──
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

  // ── 9. Three.js 3D Interactive Massager Canvas ──
  initThreeDViewer();

});

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

// ── Hotspot Highlighter ──
function highlightHotspot(num) {
  document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
  document.querySelectorAll('.th-feat').forEach(f => f.classList.remove('active'));

  const spot = document.querySelector(`.hotspot-${num}`);
  if (spot) spot.classList.add('active');

  const feat = document.querySelectorAll('.th-feat')[num - 1];
  if (feat) feat.classList.add('active');
}

// ── 3D Interactive Three.js Engine ──
function initThreeDViewer() {
  const container = document.getElementById('canvasContainer');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1.6, 3.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
  dirLight.position.set(5, 8, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const goldAccentLight = new THREE.PointLight(0xC59B27, 2, 8);
  goldAccentLight.position.set(-3, 2, 2);
  scene.add(goldAccentLight);

  const blueAirGlow = new THREE.PointLight(0x6366f1, 1.5, 6);
  blueAirGlow.position.set(0, 0.5, 0);
  scene.add(blueAirGlow);

  // Group for the 3D Massager
  const massagerGroup = new THREE.Group();

  // 1. Base Housing (Curved Metallic Silver / Champagne Gold Body)
  const baseGeo = new THREE.CylinderGeometry(1.2, 1.05, 0.65, 32);
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xE5E7EB,
    metalness: 0.85,
    roughness: 0.25
  });
  const baseMesh = new THREE.Mesh(baseGeo, silverMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  massagerGroup.add(baseMesh);

  // 2. Gold Trim Accent Ring
  const ringGeo = new THREE.TorusGeometry(1.21, 0.035, 16, 64);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.95,
    roughness: 0.15
  });
  const trimRing = new THREE.Mesh(ringGeo, goldMat);
  trimRing.rotation.x = Math.PI / 2;
  trimRing.position.y = 0.1;
  massagerGroup.add(trimRing);

  // 3. Foot Cavity 1 (Left Massage Chamber)
  const cavityGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.5, 24);
  const darkCavityMat = new THREE.MeshStandardMaterial({
    color: 0x1E1E24,
    roughness: 0.8
  });
  const cavityLeft = new THREE.Mesh(cavityGeo, darkCavityMat);
  cavityLeft.position.set(-0.45, 0.18, 0.05);
  cavityLeft.rotation.x = 0.15;
  massagerGroup.add(cavityLeft);

  // 4. Foot Cavity 2 (Right Massage Chamber)
  const cavityRight = new THREE.Mesh(cavityGeo, darkCavityMat);
  cavityRight.position.set(0.45, 0.18, 0.05);
  cavityRight.rotation.x = 0.15;
  massagerGroup.add(cavityRight);

  // 5. Smart Touch Control Display on Top
  const screenGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.04, 32);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.9,
    roughness: 0.1
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.34, -0.35);
  screenMesh.rotation.x = 0.25;
  massagerGroup.add(screenMesh);

  // 6. Glowing Blue LED Ring on Screen
  const ledRingGeo = new THREE.TorusGeometry(0.28, 0.015, 16, 32);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const ledRing = new THREE.Mesh(ledRingGeo, ledMat);
  ledRing.position.set(0, 0.365, -0.35);
  ledRing.rotation.x = Math.PI / 2 + 0.25;
  massagerGroup.add(ledRing);

  scene.add(massagerGroup);

  // Interactive Drag Rotation
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotationY = 0.35;
  let targetRotationX = 0.2;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;
    targetRotationX = Math.max(-0.2, Math.min(0.6, targetRotationX));
  });

  // Touch support for mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;
    targetRotationX = Math.max(-0.2, Math.min(0.6, targetRotationX));
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!isDragging) {
      targetRotationY += 0.003; // Gentle auto-rotation
    }

    massagerGroup.rotation.y += (targetRotationY - massagerGroup.rotation.y) * 0.08;
    massagerGroup.rotation.x += (targetRotationX - massagerGroup.rotation.x) * 0.08;
    massagerGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

    blueAirGlow.intensity = 1.2 + Math.sin(elapsedTime * 3) * 0.5;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
