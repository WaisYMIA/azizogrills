/* ============================================================
     SITE CONFIGURATION — edit these before going live.
     Everything a non-developer needs to fill in lives here.
     ============================================================ */
  const CONFIG = {
    // WhatsApp number that receives orders/enquiries (digits only, country code, no +)
    WA_NUMBER: "254724888057",

    // Your real Facebook Page URL (currently a placeholder)
    FACEBOOK_URL: "https://www.facebook.com/azizo254",

    // Google Maps JS API key (Places + Distance Matrix APIs enabled) — unlocks:
    //  - live address autocomplete at checkout
    //  - real road-distance delivery fee calculation (falls back to straight-line estimate without it)
    //  - live 5-review pull on the Reviews section (also needs GOOGLE_PLACE_ID below)
    // Get one at: https://console.cloud.google.com/google/maps-apis
    GOOGLE_MAPS_API_KEY: "",

    // Your business's Google Place ID — find it at:
    // https://developers.google.com/maps/documentation/places/web-service/place-id
    GOOGLE_PLACE_ID: "",

    // Backend endpoint for real M-Pesa STK Push (Safaricom Daraja API).
    // MUST be a server you control — Daraja credentials can never live in this file.
    // Leave null to keep the simulated flow (order still goes to WhatsApp either way).
    STK_PUSH_ENDPOINT: null, // e.g. "https://yourdomain.com/api/mpesa/stkpush"

    // Base URL of the Azizo backend (the Node/Express server in the backend/ folder),
    // with NO trailing slash and NO "/api" on the end — e.g. "https://api.azizobutchery.co.ke"
    // or, if it's reverse-proxied under a path on the same domain via cPanel's Node.js
    // Selector, just that domain, e.g. "https://azizobutchery.co.ke". Every call below
    // appends "/api" itself. Leave "" until the backend is deployed — while empty, the
    // live product catalog, accounts, and order history all quietly fall back to
    // products.json / local-only behavior, and WhatsApp checkout keeps working exactly
    // as before. Nothing breaks either way.
    API_BASE_URL: "",

    // ---- Staff / Admin access (two-tier — see the "Staff & Admin Access" section of
    // the deployment guide for the full explanation) ----
    // Light deterrent only — visible in page source, not real security.
    //
    // STAFF_PASSCODE_DEFAULT is the known factory default. On a device's first
    // successful login with it, that device is prompted to set its own personal
    // passcode (stored only on that device — see the guide for why this can't sync
    // across devices without a backend). Keep this constant as-is; it's the documented
    // fallback everyone already knows from onboarding.
    STAFF_PASSCODE_DEFAULT: "majani90",

    // ADMIN_PASSCODE is separate and higher-tier — logging in with it (via the same
    // "Staff" footer link) unlocks an extra "Reset Staff Passcode" control. Change this
    // from the placeholder before going live; keep it different from the staff one.
    ADMIN_PASSCODE: "majani90",

    // ---- Social profiles (Social Search Optimization) ----
    // Leave any of these "" to hide that icon/link entirely rather than shipping a dead link.
    INSTAGRAM_URL: "",  // e.g. "https://www.instagram.com/azizogrills"
    TIKTOK_URL: "",     // e.g. "https://www.tiktok.com/@azizogrills"

    // ---- Paid Acquisition tracking (PPC) ----
    // Leave "" to skip loading that tracking script entirely — no placeholder/test IDs
    // are ever loaded, so nothing fires until you add a real ID from your own ad account.
    GOOGLE_ADS_ID: "",   // Google Ads → Tools → Conversions → your Conversion ID, format "AW-XXXXXXXXX"
    META_PIXEL_ID: "",   // Meta Events Manager → your Pixel ID (numbers only)

    // ---- Free delivery & loyalty ----
    FREE_DELIVERY_THRESHOLD: 3000, // items subtotal (KSh) at or above which delivery is free
    LOYALTY_REORDER_DISCOUNT_PCT: 5, // % off shown to anyone using "Reorder Last Order" — set to 0 to disable

    // ---- Seasonal / holiday pre-order banner ----
    // Off by default — nothing should claim a "Christmas special" in July. Turn this on
    // manually ahead of a specific occasion (Christmas, Eid, Easter, etc.) and turn it
    // back off once it's passed.
    SEASONAL_BANNER: {
      enabled: false,
      text: "🎄 Christmas pre-orders now open — reserve your whole beef or turkey for the holidays.",
      ctaText: "Pre-Order Now",
      ctaLink: "events", // section id to scroll to, or set ctaHref below for a WhatsApp link instead
    },
  };
  const WA_NUMBER = CONFIG.WA_NUMBER;

  // In-page navigation without using real href="#id" links — some app webviews
  // (e.g. Claude's mobile file preview) intercept ANY <a href> tap, even same-page
  // anchors, as an "external link" and show a confirmation dialog. Scrolling via
  // JS on a plain element with no href avoids that entirely.
  // Maps a section id to the page it now lives on, for the multi-page site.
  // If the id exists on the CURRENT page, scroll smoothly; otherwise navigate there
  // (the target page's own scroll-margin-top CSS handles the fixed-nav offset on load).
  const SECTION_PAGE_MAP = {
    'top': 'index.html',
    'boxes': 'fresh-market.html', 'fresh': 'fresh-market.html',
    'planner': 'meal-planner.html',
    'ready': 'ready-to-eat.html',
    'events': 'outdoor-events.html',
    'recipes': 'recipes.html',
    'our-story': 'about.html', 'gallery': 'about.html', 'community': 'about.html',
    'reviews': 'reviews.html',
    'faq': 'faq.html',
    'find-us': 'contact.html', 'branches': 'contact.html',
  };
  function goSection(id){
    const el = document.getElementById(id);
    if(el){
      el.scrollIntoView({behavior:'smooth', block:'start'});
      return;
    }
    const targetPage = SECTION_PAGE_MAP[id];
    if(targetPage) window.location.href = `${targetPage}#${id}`;
  }

  // Fixed nav starts transparent (blends into the dark hero) and gets a solid
  // backdrop once the user scrolls past it — the "detects a color change as you
  // scroll" effect. Uses a small threshold so it doesn't flicker right at the top.
  const navEl = document.querySelector('header.nav');
  // Highlight the current page's nav link (both the desktop nav and the mobile
  // dropdown use this — not scoped to one or the other, so both get it)
  document.querySelectorAll('a[data-page]').forEach(a=>{
    if(a.getAttribute('data-page') === document.body.dataset.page) a.classList.add('current-page');
  });

  // ---------- SHOP-TAB EMPHASIS ----------
  // Fresh Market, Meal Plan and Ready to Eat are the actual e-commerce tabs — give
  // them a filled "shop" pill in the nav so they read as buttons, not plain links.
  // While browsing Fresh Market specifically, pulse the other two to cross-sell —
  // someone there to buy raw cuts is a good candidate for a meal plan or a
  // ready-to-eat order too.
  const SHOP_PAGES = ['fresh-market', 'meal-planner', 'ready-to-eat'];
  document.querySelectorAll('a[data-page]').forEach(a=>{
    const page = a.getAttribute('data-page');
    if(SHOP_PAGES.includes(page)){
      a.classList.add('nav-shop-link');
      if(document.body.dataset.page === 'fresh-market' && page !== 'fresh-market'){
        a.classList.add('nav-cross-sell');
      }
    }
  });

  // Only the home page has a dark hero image directly under the nav, which is the
  // only backdrop the light-gold nav text was ever designed to sit on transparently.
  // Every other page starts with light (cream) content, so on those pages the nav
  // must start solid/dark immediately — otherwise the gold text on a transparent
  // bar over a light page reads as invisible until the user scrolls past it.
  const hasHero = !!document.querySelector('.hero');
  function updateNavScrollState(){
    navEl.classList.toggle('scrolled', !hasHero || window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavScrollState, {passive:true});
  updateNavScrollState();

  // Mobile/tablet hamburger nav — the CSS for this existed already but the button
  // and this toggle logic did not, meaning nav links were previously unreachable
  // on any screen under 900px (tablets included). Fixed here.
  function toggleMobileNav(){
    const links = document.getElementById('mobileLinks');
    const btn = document.getElementById('menuToggle');
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.textContent = isOpen ? '✕' : '☰';
    // Hides the floating Buy Now button and social rail while the dropdown is
    // open — both are fixed, higher-z-index widgets that would otherwise sit
    // on top of the menu and block taps on the links underneath them.
    document.body.classList.toggle('mobile-nav-open', isOpen);
  }
  // Close the mobile menu after tapping a link, and on outside tap
  document.getElementById('mobileLinks')?.addEventListener('click', (e)=>{
    if(e.target.tagName === 'A') toggleMobileNav();
  });
  document.addEventListener('click', (e)=>{
    const links = document.getElementById('mobileLinks');
    const btn = document.getElementById('menuToggle');
    if(!links || !links.classList.contains('open')) return;
    if(!links.contains(e.target) && e.target !== btn) toggleMobileNav();
  });

  // ---------- LANGUAGE TOGGLE (EN / SW) ----------
  // Covers the main navigation, hero, and section headings/eyebrows — the parts of
  // the page a Swahili-speaking visitor needs to orient themselves and find their way
  // to the menu. Full literal translation of every product description, FAQ answer,
  // and paragraph on the page is a much bigger undertaking best done by a fluent
  // professional translator rather than guessed here; this covers the high-traffic
  // wayfinding text so the site reads as genuinely bilingual-aware, not just English-only.
  const translations = {
    sw: {
      'nav.fresh': 'Nyama Mbichi', 'nav.planner': 'Mpango wa Mlo', 'nav.ready': 'Tayari Kuliwa',
      'nav.groceries': 'Mboga na Viungo',
      'nav.events': 'Matukio', 'nav.branches': 'Matawi', 'nav.cart': 'Kikapu',
      'hero.eyebrow': 'Nairobi · Wazi Saa 24',
      'hero.headline': 'Kila kipande,<br><em>kimekatwa vizuri</em>,<br>saa yoyote ya usiku.',
      'hero.lead': 'Nyama mbichi, nyama choma ya kuagiza, na huduma kamili ya matukio ya nje — kutoka matawi manne Nairobi, hadi mlangoni pako au sherehe yako.',
      'hero.cta1': 'Nunua Nyama Mbichi', 'hero.cta2': 'Panga Tukio',
      'serve.eyebrow': 'Duka Moja, Kila Mteja', 'serve.h2': 'Imejengwa kwa jinsi unavyonunua nyama.',
      'fresh.eyebrow': 'Nyama Mbichi, Kata Kama Unavyotaka', 'fresh.h2': 'Soko la Nyama Mbichi',
      'planner.eyebrow': 'Nyama Mbichi Pekee · Okoa 10%', 'planner.h2': 'Jenga Mpango Wako wa Nyama',
      'ready.eyebrow': 'Moto Kutoka kwa Jiko', 'ready.h2': 'Tayari Kuliwa',
      'events.eyebrow': 'Imejengwa kwa Mapokezi na Sherehe', 'events.h2': 'Matukio ya Nje na Milo ya Wingi',
      'story.eyebrow': 'Watu Wetu na Ahadi Yetu', 'story.h2': 'Mikono Nyuma ya Kila Kipande',
      'reviews.eyebrow': 'Maoni', 'reviews.h2': 'Nairobi Inasema Nini',
      'faq.eyebrow': 'Maswali Yanayoulizwa Mara Kwa Mara', 'faq.h2': 'Maswali Yanayoulizwa Mara Kwa Mara',
      'findus.eyebrow': 'Pata Tawi', 'findus.h2': 'Tupate',
    }
  };
  let currentLang = localStorage.getItem('azizoLang') || 'en';
  const originalText = {}; // cache of original English content, keyed by element index

  function applyLanguage(lang){
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach((el, idx) => {
      if(originalText[idx] === undefined) originalText[idx] = el.innerHTML;
      const key = el.getAttribute('data-i18n');
      if(lang === 'sw' && translations.sw[key]){
        el.innerHTML = translations.sw[key];
      } else {
        el.innerHTML = originalText[idx];
      }
    });
    document.documentElement.lang = lang;
    document.getElementById('langToggle').textContent = lang === 'sw' ? 'SW / EN' : 'EN / SW';
    currentLang = lang;
    localStorage.setItem('azizoLang', lang);
  }
  function toggleLanguage(){
    applyLanguage(currentLang === 'en' ? 'sw' : 'en');
  }

  // ---------- PROMO CODE ENGINE ----------
  // Static site, no backend/database — so codes are "self-validating": the checkout
  // recomputes a checksum from the code itself rather than looking it up anywhere.
  // Format: AZIZO-<tier digit>-<5 random base36 chars>-<1 checksum char>
  // LIMITATIONS (be upfront with the business about these):
  //  1. Not cryptographically secure — this JS is visible in page source, so a
  //     technically determined person could work out the checksum rule and mint
  //     their own codes. Fine for casual small-business promos, not for high-value ones.
  //  2. No "one-time use" enforcement — with no shared database, the same code can be
  //     used by anyone who has it, any number of times. True single-use tracking needs
  //     a backend (the same kind of infrastructure the M-Pesa STK push needs).
  const PROMO_SALT = 137;
  const PROMO_TIERS = {1:5, 2:10, 3:15, 4:20}; // tier digit -> % discount
  const B36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function promoChecksum(tierDigit, body){
    let sum = PROMO_SALT;
    for(const ch of (tierDigit+body)) sum += ch.charCodeAt(0);
    return B36[sum % 36];
  }

  function generatePromoCode(tier){
    const tierDigit = String(tier);
    let body = '';
    for(let i=0;i<5;i++) body += B36[Math.floor(Math.random()*36)];
    const check = promoChecksum(tierDigit, body);
    return `AZIZO-${tierDigit}-${body}-${check}`;
  }

  function validatePromoCode(code){
    const parts = String(code).trim().toUpperCase().split('-');
    if(parts.length !== 4 || parts[0] !== 'AZIZO') return null;
    const [, tierDigit, body, check] = parts;
    if(!PROMO_TIERS[tierDigit]) return null;
    if(body.length !== 5) return null;
    if(promoChecksum(tierDigit, body) !== check) return null;
    return PROMO_TIERS[tierDigit];
  }

  let appliedPromo = null; // {code, discountPct}

  function togglePromoBox(){
    document.getElementById('promoBox').style.display = document.getElementById('promoCheckbox').checked ? 'block' : 'none';
  }

  function applyPromoCode(){
    const input = document.getElementById('promoInput');
    const status = document.getElementById('promoStatus');
    const pct = validatePromoCode(input.value);
    if(pct == null){
      status.textContent = "That code doesn't look valid — double-check and try again.";
      status.className = 'stk-status pending';
      appliedPromo = null;
      updateCartUI();
      return;
    }
    appliedPromo = {code: input.value.trim().toUpperCase(), discountPct: pct};
    status.innerHTML = `<span class="promo-tag">✓ ${appliedPromo.code} — ${pct}% off items <button onclick="removePromoCode()" title="Remove">&times;</button></span>`;
    updateCartUI();
    showToast(`Promo applied — ${pct}% off`);
  }

  function removePromoCode(){
    appliedPromo = null;
    document.getElementById('promoStatus').innerHTML = '';
    document.getElementById('promoInput').value = '';
    updateCartUI();
  }

  // ---------- STAFF PANEL ----------
  // A prompt() passcode is a light deterrent for casual customers, not real security —
  // like the promo checksum above, it's readable in page source. Fine for keeping
  // browsing customers out of a tool meant for staff, not for protecting anything sensitive.
  let selectedTier = 1;

  function getActiveStaffPasscode(){
    return localStorage.getItem('azizoStaffPasscode') || CONFIG.STAFF_PASSCODE_DEFAULT;
  }

  function promptSetNewStaffPasscode(){
    alert('First time logging in on this device — set your own passcode before continuing. (Staff only need to do this once per device.)');
    while(true){
      const newPass = prompt('Choose a new passcode (at least 4 characters):');
      if(newPass === null) return false; // cancelled — access not granted
      if(newPass.trim().length < 4){
        alert('Passcode must be at least 4 characters — try again.');
        continue;
      }
      const confirmPass = prompt('Confirm your new passcode:');
      if(confirmPass === null) return false;
      if(newPass !== confirmPass){
        alert("Those didn't match — let's try again.");
        continue;
      }
      localStorage.setItem('azizoStaffPasscode', newPass);
      alert('Passcode set. Use this one to log in on this device from now on.');
      return true;
    }
  }

  function openStaffPanel(){
    const entered = prompt('Staff or Admin passcode:');
    if(entered === null) return;

    if(entered === CONFIG.ADMIN_PASSCODE){
      showStaffPanel(true);
      return;
    }

    const active = getActiveStaffPasscode();
    if(entered !== active){
      alert("Incorrect passcode. Forgotten yours? Ask your admin to reset it on this device — they'll need to do that from this same device.");
      return;
    }

    // Correct, but if it's still the untouched factory default, force a personal one first.
    const hasCustomPasscode = localStorage.getItem('azizoStaffPasscode') !== null;
    if(!hasCustomPasscode){
      if(!promptSetNewStaffPasscode()) return; // cancelled — don't grant access this time
    }
    showStaffPanel(false);
  }

  function showStaffPanel(isAdmin){
    document.getElementById('staffPanel').classList.add('open');
    document.getElementById('staffOverlay').classList.add('open');
    document.getElementById('adminResetSection').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('defaultPasscodeDisplay').textContent = CONFIG.STAFF_PASSCODE_DEFAULT;
  }

  function resetStaffPasscode(){
    if(!confirm(`Reset the staff passcode on THIS device back to the default (${CONFIG.STAFF_PASSCODE_DEFAULT})? This only affects this device.`)) return;
    localStorage.removeItem('azizoStaffPasscode');
    alert(`Done — this device's staff passcode is back to the default (${CONFIG.STAFF_PASSCODE_DEFAULT}). The next person who logs in here will be asked to set a new personal one again.`);
  }

  function closeStaffPanel(){
    document.getElementById('staffPanel').classList.remove('open');
    document.getElementById('staffOverlay').classList.remove('open');
  }
  function selectTier(tier){
    selectedTier = tier;
    document.querySelectorAll('#tierChips .pay-chip').forEach(c=>c.classList.remove('active'));
    document.querySelector(`#tierChips .pay-chip[data-tier="${tier}"]`).classList.add('active');
  }
  function staffGenerateCode(){
    const code = generatePromoCode(selectedTier);
    const pct = PROMO_TIERS[selectedTier];
    document.getElementById('staffResult').innerHTML = `
      <div class="staff-code">${code}</div>
      <button class="staff-copy-btn" onclick="navigator.clipboard.writeText('${code}').then(()=>showToast('Copied to clipboard'))">Copy Code (${pct}% off)</button>
    `;
  }

  // NOTE: Coordinates below are best-effort neighborhood-center estimates, not verified
  // exact pins. Replace with your precise branch coordinates (drop a pin on Google Maps,
  // right-click > "What's here?" to get the exact lat/lng) for accurate delivery pricing.
  const GOOGLE_MAPS_API_KEY = CONFIG.GOOGLE_MAPS_API_KEY;

  // ---------- BRANCHES / MAP ----------
  const branches = [
    {id:'syokimau', name:'Syokimau (Main)', query:'Azizo Butchery and Grill, Syokimau, Nairobi, Kenya', lat:-1.3810, lng:36.9270},
    {id:'umoja', name:'Umoja', query:'Azizo Butchery and Grill, Umoja, Nairobi, Kenya', lat:-1.2833, lng:36.8956},
    {id:'buruburu', name:'Buruburu', query:'Azizo Butchery and Grill, Buruburu, Nairobi, Kenya', lat:-1.2864, lng:36.8790},
    {id:'utawala', name:'Utawala', query:'Azizo Butchery and Grill, Utawala, Nairobi, Kenya', lat:-1.2870, lng:36.9600},
  ];

  function renderBranchTabs(activeId='syokimau'){
    const bar = document.getElementById('branchTabs');
    if(!bar) return;
    bar.innerHTML = branches.map(b=>`<button class="chip ${activeId===b.id?'active':''}" onclick="selectBranch('${b.id}')">${b.name}</button>`).join('');
    const branch = branches.find(b=>b.id===activeId);
    const q = encodeURIComponent(branch.query);
    document.getElementById('branchMap').src = `https://www.google.com/maps?q=${q}&output=embed`;
    document.getElementById('mapBranchName').textContent = branch.name;
    document.getElementById('mapDirections').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  }
  function selectBranch(id){ renderBranchTabs(id); }

  // ---------- DATA ----------
  // Product catalog: loaded from products.json (the file to edit for menu/price/photo
  // updates — no need to touch this HTML). The arrays below are a fallback only, used if
  // products.json can't be fetched (e.g. opening this file directly as file:// instead of
  // through a real web server — browsers block local fetches like that for security).
  let freshItems = [
    {id:'f1', cat:'Beef', kind:'red', name:'Beef Rump', desc:'Lean, tender cut ideal for grilling or roasting. Cut to your preferred thickness.', price:650, unit:'kg', img:''},
    {id:'f2', cat:'Beef', kind:'red', name:'Beef Ribeye', desc:'Well-marbled steak cut, perfect for the grill.', price:850, unit:'kg', img:''},
    {id:'f3', cat:'Beef', kind:'red', name:'Beef Mince', desc:'Freshly ground beef, great for stews and burgers.', price:600, unit:'kg', img:''},
    {id:'f4', cat:'Pork', kind:'red', name:'Pork Chops', desc:'Bone-in chops, trimmed and ready to marinate.', price:700, unit:'kg', img:''},
    {id:'f5', cat:'Pork', kind:'red', name:'Pork Ribs', desc:'Full rack, ideal for slow grilling.', price:750, unit:'kg', img:''},
    {id:'f6', cat:'Chicken', kind:'white', name:'Whole Chicken', desc:'Farm-fresh, cleaned and ready to cook.', price:550, unit:'bird', img:''},
    {id:'f7', cat:'Chicken', kind:'white', name:'Chicken Breast', desc:'Skinless, boneless fillets.', price:520, unit:'kg', img:''},
    {id:'f8', cat:'Fish', kind:'white', name:'Tilapia (Whole)', desc:'Fresh whole tilapia, scaled and gutted on request.', price:450, unit:'kg', img:''},
    {id:'f9', cat:'Fish', kind:'white', name:'Nile Perch Fillet', desc:'Boneless fillet, ready for the pan or grill.', price:700, unit:'kg', img:''},
  ];

  let readyItems = [
    {id:'r1', cat:'Grilled', name:'Nyama Choma (Beef)', desc:'Charcoal-grilled beef, served with kachumbari on request.', price:700, unit:'kg', img:''},
    {id:'r2', cat:'Grilled', name:'Grilled Chicken', desc:'Half or whole, marinated and grilled to order.', price:600, unit:'half', img:''},
    {id:'r3', cat:'Fried', name:'Fried Chicken', desc:'Crispy fried chicken pieces, made fresh to order.', price:550, unit:'plate', img:''},
    {id:'r4', cat:'Fried', name:'Fried Fish', desc:'Deep-fried tilapia, whole or filleted.', price:500, unit:'plate', img:''},
    {id:'r5', cat:'Shawarma', name:'Beef Shawarma', desc:'Wrapped shawarma with beef, salad and house sauce.', price:350, unit:'wrap', img:''},
    {id:'r6', cat:'Shawarma', name:'Chicken Shawarma', desc:'Wrapped shawarma with chicken, salad and house sauce.', price:320, unit:'wrap', img:''},
  ];

  // Groceries — common meat-prep accompaniments (tomatoes, garlic, etc.), kept as a
  // fully separate section from the meat/ready-to-eat menu. Same fallback-array pattern
  // as freshItems/readyItems above; the real source of truth is products.json / the backend.
  let groceryItems = [
    {id:'g1', cat:'Vegetables', name:'Tomatoes', desc:'Fresh tomatoes — kachumbari and stew base.', price:120, unit:'kg', img:''},
    {id:'g2', cat:'Vegetables', name:'Onions', desc:'Red onions, essential for any meat dish.', price:100, unit:'kg', img:''},
    {id:'g3', cat:'Vegetables', name:'Dhania (Coriander)', desc:'Fresh coriander, sold by the bunch.', price:30, unit:'bunch', img:''},
    {id:'g4', cat:'Vegetables', name:'Pilipili (Chili)', desc:'Fresh green or red chili, for kachumbari or marinades.', price:50, unit:'250g', img:''},
    {id:'g5', cat:'Vegetables', name:'Lemon', desc:'Fresh lemons — great on grilled fish or chicken.', price:15, unit:'piece', img:''},
    {id:'g6', cat:'Vegetables', name:'Potatoes', desc:'Fresh potatoes — chips or a stew side.', price:90, unit:'kg', img:''},
    {id:'g7', cat:'Vegetables', name:'Kachumbari Mix', desc:'Pre-chopped tomato, onion and coriander — ready to serve.', price:150, unit:'pack', img:''},
    {id:'g8', cat:'Spices', name:'Garlic', desc:'Fresh garlic bulbs.', price:200, unit:'250g', img:''},
    {id:'g9', cat:'Spices', name:'Ginger', desc:'Fresh ginger root.', price:150, unit:'250g', img:''},
    {id:'g10', cat:'Spices', name:'Royco / Meat Masala', desc:'All-purpose seasoning for stews and grills.', price:80, unit:'packet', img:''},
    {id:'g11', cat:'Spices', name:'Cooking Oil', desc:'Vegetable cooking oil, 1 litre.', price:280, unit:'litre', img:''},
    {id:'g12', cat:'Spices', name:'Salt', desc:'Table salt, 1kg packet.', price:50, unit:'packet', img:''},
  ];

  // Which grocery items to recommend based on what kind of meat is in the cart — the
  // engine behind the "smart suggestions" panel in the cart drawer (see
  // getGrocerySuggestions()/renderGrocerySuggestions() below).
  const CAT_GROCERY_MAP = {
    'Beef':     ['g1','g2','g8','g3','g10'],
    'Pork':     ['g8','g2','g9','g4'],
    'Chicken':  ['g8','g9','g3','g5','g10'],
    'Fish':     ['g5','g3','g8','g4'],
    'Goat':     ['g2','g1','g3','g10'],
    'Grilled':  ['g7','g1','g2','g4','g5'],
    'Fried':    ['g1','g2','g4','g5'],
    'Shawarma': ['g8','g5','g4','g2'],
  };

  // A product's `img` can be: empty (placeholder), a plain filename meant to live in
  // this site's own images/ folder (the GitHub/manual-sync workflow), an absolute URL,
  // or a backend-relative path like "/uploads/f1-123.jpg" (an image uploaded through
  // admin.html straight to the backend). Only that last form needs the backend's own
  // origin prepended — the site and the API can live on completely different domains.
  function resolveImgSrc(img){
    if(!img) return '';
    if(/^https?:\/\//i.test(img)) return img;
    if(img.startsWith('/uploads/')) return `${apiBase()}${img}`;
    return `images/${img}`;
  }

  async function loadProducts(){
    // Prefer the live backend catalog (accounts/order-history's same API) when one is
    // configured — admin.html's uploads and Excel imports land there, in the database,
    // and this is what makes them show up on the site without a GitHub sync step.
    if(apiAvailable()){
      try{
        const res = await fetch(`${apiBase()}/api/products`, {cache:'no-store'});
        if(!res.ok) throw new Error(`backend returned ${res.status}`);
        const data = await res.json();
        if(Array.isArray(data.freshItems) && Array.isArray(data.readyItems)){
          freshItems = data.freshItems;
          readyItems = data.readyItems;
          if(Array.isArray(data.groceryItems)) groceryItems = data.groceryItems;
          refreshProductGrids();
          renderPlannerItems();
          renderPlanSummary();
          injectDynamicSEO();
          return;
        }
      }catch(e){
        console.warn('Backend product catalog unavailable, falling back to products.json:', e);
        // falls through to the static-file path below
      }
    }
    try{
      const res = await fetch('./products.json', {cache:'no-store'});
      if(!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      if(Array.isArray(data.freshItems) && Array.isArray(data.readyItems)){
        freshItems = data.freshItems;
        readyItems = data.readyItems;
        if(Array.isArray(data.groceryItems)) groceryItems = data.groceryItems;
        // Re-render everything that depends on the catalog now that real data has arrived
        refreshProductGrids();
        renderPlannerItems();
        renderPlanSummary();
      }
    } catch(e){
      // Silent fallback to the built-in defaults above — expected on file:// or if the
      // JSON has a syntax error (check the browser console for details in that case).
      console.warn('products.json not loaded, using built-in fallback menu:', e);
    } finally {
      injectDynamicSEO(); // stays in sync with whatever catalog actually ended up loaded
    }
  }

  // GEO/SEO: adds a second JSON-LD block (kept separate from the static one in <head>
  // so core business facts stay reliable even for crawlers that don't run JavaScript)
  // containing the live menu and social profile links — both change over time, so
  // generating them from the same data the page itself uses means they can't go stale.
  function injectDynamicSEO(){
    const sameAs = [CONFIG.FACEBOOK_URL, CONFIG.INSTAGRAM_URL, CONFIG.TIKTOK_URL]
      .filter(url => url && !url.includes('PASTE-YOUR'));
    const toMenuItems = items => items.map(i => ({
      "@type": "MenuItem",
      "name": i.name,
      "description": i.desc,
      "offers": {"@type": "Offer", "price": i.price, "priceCurrency": "KES"}
    }));
    const hasMenuSection = [];
    if(freshItems.length) hasMenuSection.push({"@type":"MenuSection","name":"Fresh Meat Market","hasMenuItem": toMenuItems(freshItems)});
    if(readyItems.length) hasMenuSection.push({"@type":"MenuSection","name":"Ready to Eat","hasMenuItem": toMenuItems(readyItems)});
    if(groceryItems.length) hasMenuSection.push({"@type":"MenuSection","name":"Groceries","hasMenuItem": toMenuItems(groceryItems)});

    const dynamic = {
      "@context": "https://schema.org",
      "@type": "GroceryStore",
      "name": "Azizo Butchery & Grill",
      "hasMenu": {"@type": "Menu", "hasMenuSection": hasMenuSection},
    };
    if(sameAs.length) dynamic.sameAs = sameAs;

    const existing = document.getElementById('dynamicSeoLd');
    if(existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamicSeoLd';
    script.textContent = JSON.stringify(dynamic);
    document.head.appendChild(script);
  }

  // Cart persists across pages (this is a multi-page site now) via localStorage —
  // still device-local only, same scope as favorites/last-order elsewhere in this file.
  function loadCartFromStorage(){
    try{
      const saved = JSON.parse(localStorage.getItem('azizoActiveCart') || '{}');
      return (saved && typeof saved === 'object') ? saved : {};
    }catch(e){ return {}; }
  }
  function saveCartToStorage(){
    try{ localStorage.setItem('azizoActiveCart', JSON.stringify(cart)); }catch(e){ /* storage full/unavailable */ }
  }
  let cart = loadCartFromStorage(); // id -> {item, qty, source}

  // ---------- RENDER FILTERS + GRIDS ----------
  function renderFresh(activeKind='all', activeCat='all'){
    if(!document.getElementById('freshFilters')) return;
    const kinds = [
      {k:'all', label:'All Meat'},
      {k:'red', label:'Red Meat', dot:'dot-red'},
      {k:'white', label:'White Meat', dot:'dot-white'},
    ];
    const cats = ['all', ...new Set(freshItems.map(i=>i.cat))];
    const bar = document.getElementById('freshFilters');
    const favOnly = !!window.freshFavOnly;
    bar.innerHTML = kinds.map(k=>`<button class="chip ${activeKind===k.k?'active':''}" onclick="renderFresh('${k.k}', currentFreshCat)">${k.dot?`<span class="dot ${k.dot}"></span>`:''}${k.label}</button>`).join('')
      + `<span style="width:1px;background:var(--line);margin:0 4px;"></span>`
      + cats.map(c=>`<button class="chip ${activeCat===c?'active':''}" onclick="renderFresh(currentFreshKind, '${c}')">${c==='all'?'All Categories':c}</button>`).join('')
      + `<span style="width:1px;background:var(--line);margin:0 4px;"></span>`
      + `<button class="chip fav-chip ${favOnly?'active':''}" onclick="toggleFreshFavFilter()">♥ Favorites</button>`;

    window.currentFreshKind = activeKind;
    window.currentFreshCat = activeCat;

    let filtered = freshItems.filter(i => (activeKind==='all'||i.kind===activeKind) && (activeCat==='all'||i.cat===activeCat));
    if(favOnly) filtered = filtered.filter(i => isFavorite(i.id));
    document.getElementById('freshGrid').innerHTML = filtered.map(i=>cardHTML(i,'fresh')).join('') || `<p style="color:var(--ink-soft);">${favOnly ? "No favorites saved yet — tap the heart on any item." : "No items match this filter."}</p>`;
  }
  function toggleFreshFavFilter(){
    window.freshFavOnly = !window.freshFavOnly;
    renderFresh(window.currentFreshKind, window.currentFreshCat);
  }

  function renderReady(activeCat='all'){
    if(!document.getElementById('readyFilters')) return;
    const cats = ['all', ...new Set(readyItems.map(i=>i.cat))];
    const bar = document.getElementById('readyFilters');
    const favOnly = !!window.readyFavOnly;
    bar.innerHTML = cats.map(c=>`<button class="chip ${activeCat===c?'active':''}" onclick="renderReady('${c}')">${c==='all'?'All Categories':c}</button>`).join('')
      + `<span style="width:1px;background:var(--line);margin:0 4px;"></span>`
      + `<button class="chip fav-chip ${favOnly?'active':''}" onclick="toggleReadyFavFilter()">♥ Favorites</button>`;
    window.currentReadyCat = activeCat;
    let filtered = readyItems.filter(i => activeCat==='all'||i.cat===activeCat);
    if(favOnly) filtered = filtered.filter(i => isFavorite(i.id));
    document.getElementById('readyGrid').innerHTML = filtered.map(i=>cardHTML(i,'ready')).join('') || `<p style="color:var(--ink-soft);">${favOnly ? "No favorites saved yet — tap the heart on any item." : "No items match this filter."}</p>`;
  }
  function toggleReadyFavFilter(){
    window.readyFavOnly = !window.readyFavOnly;
    renderReady(window.currentReadyCat);
  }

  function renderGroceries(activeCat='all'){
    if(!document.getElementById('groceryFilters')) return;
    const cats = ['all', ...new Set(groceryItems.map(i=>i.cat))];
    const bar = document.getElementById('groceryFilters');
    const favOnly = !!window.groceryFavOnly;
    bar.innerHTML = cats.map(c=>`<button class="chip ${activeCat===c?'active':''}" onclick="renderGroceries('${c}')">${c==='all'?'All Categories':c}</button>`).join('')
      + `<span style="width:1px;background:var(--line);margin:0 4px;"></span>`
      + `<button class="chip fav-chip ${favOnly?'active':''}" onclick="toggleGroceryFavFilter()">♥ Favorites</button>`;
    window.currentGroceryCat = activeCat;
    let filtered = groceryItems.filter(i => activeCat==='all'||i.cat===activeCat);
    if(favOnly) filtered = filtered.filter(i => isFavorite(i.id));
    document.getElementById('groceryGrid').innerHTML = filtered.map(i=>cardHTML(i,'groceries')).join('') || `<p style="color:var(--ink-soft);">${favOnly ? "No favorites saved yet — tap the heart on any item." : "No items match this filter."}</p>`;
  }
  function toggleGroceryFavFilter(){
    window.groceryFavOnly = !window.groceryFavOnly;
    renderGroceries(window.currentGroceryCat);
  }

  function cardHTML(i, source){
    const qty = cart[i.id] ? cart[i.id].qty : 0;
    const photoHTML = i.img
      ? `<img src="${resolveImgSrc(i.img)}" alt="${i.name}" class="tag-photo" onerror="this.parentElement.classList.add('no-photo'); this.remove();">`
      : '';
    const fav = isFavorite(i.id);
    const pairing = crossSellFor(i, source);
    // Sourcing badges/origin are opt-in per item in products.json — nothing fabricated
    // here. Only two universal, honest defaults apply when an item hasn't specified
    // anything of its own: that it's raw/prepared fresh daily, matching how the
    // business actually operates (see the Our Story section), not a specific claim
    // like "grass-fed" or "certified organic" that would need real substantiation.
    const badges = (i.badges && i.badges.length) ? i.badges : (i.kind ? ['Cut Fresh Daily'] : ['Prepared Fresh to Order']);
    const badgesHTML = badges.map(b=>`<span class="sourcing-badge">${b}</span>`).join('');
    const originHTML = i.origin ? `<div class="origin-note">📍 ${i.origin}</div>` : '';
    return `
    <div class="tag-card ${qty>0?'in-cart':''} ${i.img?'':'no-photo'}" id="card-${i.id}">
      ${photoHTML}
      <button class="fav-btn ${fav?'active':''}" title="${fav?'Remove from favorites':'Save to favorites'}" aria-label="${fav?'Remove '+i.name+' from favorites':'Save '+i.name+' to favorites'}" onclick="toggleFavorite('${i.id}')">${fav?'♥':'♡'}</button>
      <div class="tag-top">
        <span class="tag-cat">${i.kind?`<span class="dot ${i.kind==='red'?'dot-red':'dot-white'}"></span>`:''}${i.cat}</span>
      </div>
      <h3>${i.name}</h3>
      <div class="badges-row">${badgesHTML}</div>
      <p class="tag-desc">${i.desc}${originHTML}${pairing ? `<br><span class="pairing">Pairs well with: ${pairing}</span>` : ''}</p>
      <div class="tag-bottom">
        <span class="price">KSh ${i.price}<sup>/${i.unit}</sup></span>
        <div class="tag-actions">
          <button class="icon-btn" title="More details" aria-label="More details about ${i.name}" onclick="toggleExpand('${i.id}')">i</button>
          ${qty > 0
            ? `<div class="card-stepper">
                 <button onclick="setCardQty('${i.id}','${source}',${qty}-1)">−</button>
                 <span>${qty}</span>
                 <button onclick="setCardQty('${i.id}','${source}',${qty}+1)">+</button>
               </div>`
            : `<button class="add-btn" id="add-${i.id}" onclick="addToCart('${i.id}','${source}')">Add</button>`
          }
        </div>
      </div>
    </div>`;
  }

  function toggleExpand(id){
    document.getElementById(`card-${id}`).classList.toggle('expanded');
  }

  function findItem(id){
    return freshItems.find(i=>i.id===id) || readyItems.find(i=>i.id===id) || groceryItems.find(i=>i.id===id);
  }

  // ---------- WISHLIST / FAVORITES (localStorage — this browser only, no account/sync) ----------
  function getFavorites(){
    try{ return JSON.parse(localStorage.getItem('azizoFavorites') || '[]'); }
    catch(e){ return []; }
  }
  function isFavorite(id){ return getFavorites().includes(id); }
  function toggleFavorite(id){
    let favs = getFavorites();
    if(favs.includes(id)){
      favs = favs.filter(f=>f!==id);
      showToast('Removed from favorites');
    } else {
      favs.push(id);
      showToast('Saved to favorites ♥');
    }
    localStorage.setItem('azizoFavorites', JSON.stringify(favs));
    refreshProductGrids();
  }

  // ---------- CROSS-SELL ----------
  function crossSellFor(item, source){
    // Stay within the same section (fresh / ready-to-eat / groceries) — a grocery item
    // shouldn't suggest a cut of meat here, and vice versa. The cart's own "smart
    // suggestions" panel (getGrocerySuggestions) is what bridges meat -> groceries.
    const pool = source === 'groceries' ? groceryItems : (source === 'ready' ? readyItems : freshItems);
    const sameCat = pool.filter(p => p.cat === item.cat && p.id !== item.id);
    if(sameCat.length === 0) return '';
    return sameCat.slice(0,2).map(p=>p.name).join(' & ');
  }

  // ---------- SMART GROCERY UPSELL (shown in the cart drawer) ----------
  // Looks at what meat/ready-to-eat items are already in the cart, maps each one's
  // category to relevant grocery accompaniments (see CAT_GROCERY_MAP above), and
  // returns up to 4 grocery items worth suggesting — skipping anything already in cart.
  function getGrocerySuggestions(){
    const cartIds = Object.keys(cart);
    if(cartIds.length === 0 || !groceryItems.length) return [];
    const suggestedIds = [];
    cartIds.forEach(id=>{
      const entry = cart[id];
      if(!entry || !entry.item || entry.source === 'groceries') return;
      const mapped = CAT_GROCERY_MAP[entry.item.cat];
      if(mapped) mapped.forEach(gid=>{ if(!suggestedIds.includes(gid)) suggestedIds.push(gid); });
    });
    return suggestedIds
      .filter(gid => !cart[gid]) // don't suggest something already in the cart
      .map(gid => groceryItems.find(g=>g.id===gid))
      .filter(Boolean)
      .slice(0,4);
  }

  function renderGrocerySuggestions(){
    const box = document.getElementById('grocerySuggest');
    if(!box) return;
    const suggestions = getGrocerySuggestions();
    if(suggestions.length === 0){
      box.style.display = 'none';
      box.innerHTML = '';
      return;
    }
    box.style.display = 'block';
    box.innerHTML = `
      <div class="suggest-head">🧄 Don't forget these — pairs well with your order</div>
      <div class="suggest-row">
        ${suggestions.map(g=>`
          <div class="suggest-chip">
            <span class="suggest-name">${g.name}</span>
            <span class="suggest-price">KSh ${g.price}<sup>/${g.unit}</sup></span>
            <button onclick="addGrocerySuggestion('${g.id}')">+ Add</button>
          </div>`).join('')}
      </div>`;
  }

  function addGrocerySuggestion(id){
    addToCart(id, 'groceries');
  }

  // ---------- REORDER LAST ORDER (localStorage — this browser only) ----------
  function saveLastOrder(){
    const ids = Object.keys(cart);
    if(ids.length === 0) return;
    const snapshot = ids.map(id => ({id, qty: cart[id].qty}));
    localStorage.setItem('azizoLastOrder', JSON.stringify(snapshot));
  }
  function getLastOrder(){
    try{ return JSON.parse(localStorage.getItem('azizoLastOrder') || 'null'); }
    catch(e){ return null; }
  }
  function reorderLastOrder(){
    const last = getLastOrder();
    if(!last || last.length === 0){
      showToast("No previous order found on this device yet");
      return;
    }
    last.forEach(entry=>{
      // Only restore items that still exist in the current catalog (menu may have changed)
      if(findItem(entry.id) || entry.id.includes('::plan::')){
        const item = findItem(entry.id.split('::')[0]) || findItem(entry.id);
        if(item) cart[entry.id] = {item, qty: entry.qty, source: 'reorder'};
      }
    });
    // Loyalty reward for returning customers — reuses the same discount pipeline as
    // promo codes, so it flows through to the total, PDF, and WhatsApp message for free.
    if(CONFIG.LOYALTY_REORDER_DISCOUNT_PCT > 0){
      appliedPromo = {code: 'WELCOME-BACK', discountPct: CONFIG.LOYALTY_REORDER_DISCOUNT_PCT};
      document.getElementById('promoCheckbox').checked = true;
      document.getElementById('promoBox').style.display = 'block';
      document.getElementById('promoStatus').innerHTML = `<span class="promo-tag">✓ Returning customer — ${CONFIG.LOYALTY_REORDER_DISCOUNT_PCT}% off <button onclick="removePromoCode()" title="Remove">&times;</button></span>`;
    }
    updateCartUI();
    refreshProductGrids();
    showToast(CONFIG.LOYALTY_REORDER_DISCOUNT_PCT > 0 ? `Last order restored — ${CONFIG.LOYALTY_REORDER_DISCOUNT_PCT}% loyalty discount applied!` : 'Last order restored to cart');
    openCart();
  }

  function refreshProductGrids(){
    renderFresh(window.currentFreshKind || 'all', window.currentFreshCat || 'all');
    renderReady(window.currentReadyCat || 'all');
    renderGroceries(window.currentGroceryCat || 'all');
  }

  function setCardQty(id, source, qty){
    qty = Math.max(0, qty);
    if(qty === 0){
      delete cart[id];
    } else {
      const item = findItem(id);
      cart[id] = {item, qty, source};
    }
    updateCartUI();
    refreshProductGrids();
  }

  function addToCart(id, source){
    const item = findItem(id);
    const newQty = (cart[id] ? cart[id].qty : 0) + 1;
    cart[id] = {item, qty:newQty, source};
    updateCartUI();
    refreshProductGrids();
    showToast(`${item.name} added to cart`);
  }

  let toastTimer;
  function showToast(msg){
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('show'), 2600);
  }

  function changeQty(id, delta){
    if(!cart[id]) return;
    cart[id].qty += delta;
    if(cart[id].qty <= 0) delete cart[id];
    updateCartUI();
    refreshProductGrids();
  }

  function updateCartUI(){
    saveCartToStorage();
    const ids = Object.keys(cart);
    const count = ids.reduce((sum,id)=>sum+cart[id].qty,0);
    const countEl = document.getElementById('cartCount');
    countEl.textContent = count;
    countEl.classList.remove('bump');
    void countEl.offsetWidth;
    countEl.classList.add('bump');

    const body = document.getElementById('drawerBody');
    if(ids.length===0){
      const last = getLastOrder();
      body.innerHTML = `<div class="empty-cart">Your cart is empty.<br>Add items from Fresh Market or Ready to Eat.
        ${last && last.length ? `<button class="reorder-btn" onclick="reorderLastOrder()">↻ Reorder Last Order</button>` : ''}
      </div>`;
    } else {
      body.innerHTML = ids.map(id=>{
        const {item, qty} = cart[id];
        return `
        <div class="cart-item">
          <div>
            <div class="ci-cat">${item.cat}</div>
            <div class="ci-name">${item.name}</div>
            <div class="qty-row">
              <button onclick="changeQty('${id}',-1)">−</button>
              <span>${qty}</span>
              <button onclick="changeQty('${id}',1)">+</button>
            </div>
          </div>
          <div class="ci-price">KSh ${item.price*qty}</div>
        </div>`;
      }).join('');
    }

    const itemsTotal = getItemsSubtotal();
    const fee = (selectedDeliveryMethod === 'delivery' && deliveryFeeInfo) ? deliveryFeeInfo.fee : 0;
    const promoOff = appliedPromo ? Math.round(itemsTotal * appliedPromo.discountPct / 100) : 0;
    document.getElementById('cartTotal').textContent = `KSh ${itemsTotal + fee - promoOff}`;
    document.getElementById('waSend').disabled = ids.length===0;

    renderGrocerySuggestions();

    const nudgeEl = document.getElementById('freeDeliveryNudge');
    if(nudgeEl){
      const remaining = CONFIG.FREE_DELIVERY_THRESHOLD - itemsTotal;
      if(ids.length > 0 && remaining > 0){
        nudgeEl.innerHTML = `🚚 Add <strong>KSh ${remaining}</strong> more for free delivery`;
        nudgeEl.style.display = 'block';
      } else if(ids.length > 0 && remaining <= 0){
        nudgeEl.innerHTML = `🎉 You've unlocked free delivery!`;
        nudgeEl.style.display = 'block';
      } else {
        nudgeEl.style.display = 'none';
      }
    }
  }

  function openCart(){
    document.getElementById('drawer').classList.add('open');
    document.getElementById('overlay').classList.add('open');
    renderGrocerySuggestions(); // the smart grocery upsell — freshest right when the cart opens
  }
  function closeCart(){
    document.getElementById('drawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
  }

  let selectedPayMethod = 'cash';
  let selectedDeliveryMethod = 'pickup';
  let capturedLocation = null; // {lat, lng} when geolocation or Places Autocomplete succeeds
  let deliveryFeeInfo = null;  // {km, fee} once computable

  function selectDeliveryMethod(method){
    selectedDeliveryMethod = method;
    document.querySelectorAll('#deliveryMethods .pay-chip').forEach(c=>c.classList.remove('active'));
    document.querySelector(`.pay-chip[data-dmethod="${method}"]`).classList.add('active');
    document.getElementById('pickupBox').style.display = method==='pickup' ? 'block' : 'none';
    document.getElementById('deliveryBox').style.display = method==='delivery' ? 'block' : 'none';
    updateDeliveryFeeDisplay();
  }

  function getItemsSubtotal(){
    return Object.keys(cart).reduce((sum,id)=>sum+cart[id].item.price*cart[id].qty,0);
  }

  // ---------- DELIVERY FEE ENGINE ----------
  // Rule: minimum KSh 100, +KSh 30 per km travelled, capped at KSh 450.
  // Waived entirely once the items subtotal reaches CONFIG.FREE_DELIVERY_THRESHOLD.
  function computeDeliveryFee(km){
    if(getItemsSubtotal() >= CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
    return Math.min(450, Math.round(100 + 30 * km));
  }
  function haversineKm(lat1, lng1, lat2, lng2){
    const R = 6371;
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLng = (lng2-lng1) * Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function getOriginBranch(){
    const sel = document.getElementById('deliveryBranch');
    return branches.find(b=>b.id === sel.value) || branches[0];
  }

  async function updateDeliveryFeeDisplay(){
    const feeEl = document.getElementById('deliveryFeeDisplay');
    if(selectedDeliveryMethod !== 'delivery' || !capturedLocation){
      deliveryFeeInfo = null;
      feeEl.textContent = '';
      updateCartUI();
      return;
    }
    const origin = getOriginBranch();

    if(GOOGLE_MAPS_API_KEY && window.google && google.maps.DistanceMatrixService){
      try{
        const service = new google.maps.DistanceMatrixService();
        const result = await new Promise((resolve,reject)=>{
          service.getDistanceMatrix({
            origins:[{lat:origin.lat, lng:origin.lng}],
            destinations:[{lat:capturedLocation.lat, lng:capturedLocation.lng}],
            travelMode:'DRIVING',
          }, (res,status)=> status==='OK' ? resolve(res) : reject(status));
        });
        const meters = result.rows[0].elements[0].distance.value;
        const km = meters/1000;
        deliveryFeeInfo = {km, fee: computeDeliveryFee(km), routed:true};
      }catch(e){
        const km = haversineKm(origin.lat, origin.lng, capturedLocation.lat, capturedLocation.lng);
        deliveryFeeInfo = {km, fee: computeDeliveryFee(km), routed:false};
      }
    } else {
      const km = haversineKm(origin.lat, origin.lng, capturedLocation.lat, capturedLocation.lng);
      deliveryFeeInfo = {km, fee: computeDeliveryFee(km), routed:false};
    }

    const freeDelivery = deliveryFeeInfo.fee === 0;
    feeEl.innerHTML = freeDelivery
      ? `🎉 <strong>Free delivery unlocked!</strong> (order over KSh ${CONFIG.FREE_DELIVERY_THRESHOLD})`
      : `Distance from ${origin.name}: ~${deliveryFeeInfo.km.toFixed(1)} km ${deliveryFeeInfo.routed?'(Google-routed)':'(straight-line estimate)'}<br><strong>Delivery Fee: KSh ${deliveryFeeInfo.fee}</strong>`;
    updateCartUI();
  }

  function useMyLocation(){
    const status = document.getElementById('locateStatus');
    if(!navigator.geolocation){
      status.textContent = 'Location isn\'t supported on this browser — please type your address instead.';
      status.className = 'stk-status pending';
      return;
    }
    status.textContent = 'Requesting location access...';
    status.className = 'stk-status pending';
    navigator.geolocation.getCurrentPosition(
      pos=>{
        capturedLocation = {lat: pos.coords.latitude, lng: pos.coords.longitude};
        status.textContent = `Location captured ✓ (accuracy ~${Math.round(pos.coords.accuracy)}m). Your exact pin will be shared with the order.`;
        status.className = 'stk-status ok';
        updateDeliveryFeeDisplay();
      },
      err=>{
        capturedLocation = null;
        // Geolocation requires a secure context (https) — will fail on file:// or http
        status.textContent = 'Could not get your location (this needs the site to be hosted securely, or location permission granted). Please type your address above instead.';
        status.className = 'stk-status pending';
      },
      {enableHighAccuracy:true, timeout:8000}
    );
  }

  // ---------- GOOGLE PLACES AUTOCOMPLETE + REVIEWS (requires GOOGLE_MAPS_API_KEY) ----------
  const GOOGLE_PLACE_ID = CONFIG.GOOGLE_PLACE_ID;

  function initAutocomplete(){
    const input = document.getElementById('deliveryAddress');
    if(input && window.google){
      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: {country:'ke'},
        fields: ['formatted_address','geometry','name'],
      });
      autocomplete.addListener('place_changed', ()=>{
        const place = autocomplete.getPlace();
        if(!place.geometry) return;
        capturedLocation = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        input.value = place.formatted_address || place.name;
        const status = document.getElementById('locateStatus');
        status.textContent = 'Location matched from Google Maps ✓';
        status.className = 'stk-status ok';
        updateDeliveryFeeDisplay();
      });
    }
    fetchGoogleReviews();
  }

  function fetchGoogleReviews(){
    const grid = document.getElementById('reviewGrid');
    if(!GOOGLE_PLACE_ID || !window.google || !google.maps.places){
      return; // leaves the "not connected yet" placeholder note in place
    }
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({placeId: GOOGLE_PLACE_ID, fields:['reviews','rating','user_ratings_total']}, (place, status)=>{
      if(status !== google.maps.places.PlacesServiceStatus.OK || !place.reviews) return;
      document.getElementById('reviewStars').textContent = '★★★★★'.slice(0, Math.round(place.rating || 5));
      document.getElementById('reviewCount').textContent = `${place.rating?.toFixed(1) || ''} · ${place.user_ratings_total || 0} Google Reviews`;
      const top5 = place.reviews.slice(0, 5);
      grid.innerHTML = top5.map(r => `
        <div class="review-item-card">
          <div class="review-item-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          <p class="review-item-text">${(r.text || '').slice(0,180)}${r.text && r.text.length>180 ? '…' : ''}</p>
          <div class="review-item-author">${r.author_name}</div>
          <div class="review-item-date">${r.relative_time_description}</div>
        </div>
      `).join('');
    });
  }

  if(GOOGLE_MAPS_API_KEY){
    const gmScript = document.createElement('script');
    gmScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete`;
    gmScript.async = true;
    document.head.appendChild(gmScript);
  }

  // ---------- PAID ACQUISITION (PPC) TRACKING ----------
  // Loads Google Ads and/or Meta Pixel only if you've added real IDs to CONFIG — no
  // placeholder/test IDs ever load, so nothing tracks or costs anything until you
  // connect your own ad accounts. See trackConversion() below for what fires and when.
  if(CONFIG.GOOGLE_ADS_ID){
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ADS_ID}`;
    document.head.appendChild(gtagScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.GOOGLE_ADS_ID);
  }
  if(CONFIG.META_PIXEL_ID){
    (function(f,b,e,v,n,t,s){
      if(f.fbq) return; n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq) f._fbq=n; n.push=n; n.loaded=true; n.version='2.0'; n.queue=[];
      t=b.createElement(e); t.async=true; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CONFIG.META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Call this at meaningful actions (order placed, WhatsApp enquiry sent) so any ad
  // campaigns you run later can actually measure what's working. Safe to call even
  // with no ad accounts connected — it just no-ops if gtag/fbq were never loaded above.
  function trackConversion(eventName, params){
    params = params || {};
    if(window.gtag && CONFIG.GOOGLE_ADS_ID){
      gtag('event', eventName, params);
    }
    if(window.fbq && CONFIG.META_PIXEL_ID){
      const fbEventMap = {order_placed: 'Purchase', whatsapp_enquiry: 'Contact', story_shared: 'Contact'};
      fbq('track', fbEventMap[eventName] || 'Lead', params);
    }
  }

  function selectPayMethod(method){
    selectedPayMethod = method;
    document.querySelectorAll('#payMethods .pay-chip').forEach(c=>c.classList.remove('active'));
    document.querySelector(`.pay-chip[data-method="${method}"]`).classList.add('active');
    document.getElementById('mpesaBox').style.display = method==='mpesa' ? 'block' : 'none';
    document.getElementById('stkStatus').textContent = '';
    document.getElementById('stkStatus').className = 'stk-status';
  }

  // NOTE FOR DEVELOPER: A real M-Pesa STK Push must be triggered from a secure backend
  // that calls Safaricom's Daraja API — the consumer key/secret and passkey can never
  // live in client-side code like this file. This function simulates the prompt and
  // is wired to call your backend endpoint (see STK_PUSH_ENDPOINT) once you have one.
  const STK_PUSH_ENDPOINT = CONFIG.STK_PUSH_ENDPOINT;

  async function initiateSTKPush(){
    const phoneInput = document.getElementById('mpesaPhone');
    const status = document.getElementById('stkStatus');
    const btn = document.getElementById('stkBtn');
    const digits = phoneInput.value.replace(/\D/g,'');
    if(digits.length !== 9 || !/^[17]/.test(digits)){
      status.textContent = 'Enter a valid M-Pesa number, e.g. 712345678';
      status.className = 'stk-status pending';
      return;
    }
    const fullPhone = `254${digits}`;
    const total = Object.keys(cart).reduce((sum,id)=>sum+cart[id].item.price*cart[id].qty,0);

    btn.disabled = true;
    status.textContent = `Sending payment prompt to +${fullPhone}...`;
    status.className = 'stk-status pending';

    if(STK_PUSH_ENDPOINT){
      try{
        const res = await fetch(STK_PUSH_ENDPOINT, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({phone: fullPhone, amount: total})
        });
        if(!res.ok) throw new Error('backend error');
        status.textContent = 'Check your phone and enter your M-Pesa PIN to complete payment.';
        status.className = 'stk-status ok';
      }catch(e){
        status.textContent = "Couldn't reach the payment service. Tap \"Place Order\" and we'll confirm M-Pesa payment with you directly.";
        status.className = 'stk-status pending';
      }
    } else {
      // Simulated flow until a backend is connected
      await new Promise(r=>setTimeout(r,1400));
      status.textContent = `Payment request ready for +${fullPhone}. Tap "Place Order" below and we'll send the M-Pesa STK push and confirm payment with you directly.`;
      status.className = 'stk-status ok';
    }
    btn.disabled = false;
  }

  function buildOrderData(){
    const ids = Object.keys(cart);
    const lines = ids.map((id,idx)=>{
      const {item, qty} = cart[id];
      return {n: idx+1, name: item.name, cat: item.cat, qty, unit: item.unit, price: item.price, lineTotal: item.price*qty};
    });
    const itemsSubtotal = lines.reduce((s,l)=>s+l.lineTotal,0);
    const clientPhoneDigits = document.getElementById('clientPhone').value.replace(/\D/g,'');
    const clientPhone = clientPhoneDigits.length===9 ? `+254${clientPhoneDigits}` : '';

    let deliveryInfo;
    let total = itemsSubtotal;
    if(selectedDeliveryMethod === 'pickup'){
      deliveryInfo = {
        method:'Pickup',
        branch: document.getElementById('branchSelect').value,
        time: document.getElementById('pickupTime').value || 'Not specified'
      };
    } else {
      const address = document.getElementById('deliveryAddress').value.trim();
      let mapsLink = '';
      if(capturedLocation){
        mapsLink = `https://www.google.com/maps?q=${capturedLocation.lat},${capturedLocation.lng}`;
      } else if(address){
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }
      const originBranch = getOriginBranch().name;
      const fee = deliveryFeeInfo ? deliveryFeeInfo.fee : null;
      const distanceKm = deliveryFeeInfo ? deliveryFeeInfo.km : null;
      deliveryInfo = {method:'Home Delivery', address, mapsLink, pinned: !!capturedLocation, originBranch, fee, distanceKm};
      if(fee != null) total += fee;
    }

    const promo = appliedPromo ? {code: appliedPromo.code, pct: appliedPromo.discountPct, amount: Math.round(itemsSubtotal * appliedPromo.discountPct / 100)} : null;
    if(promo) total -= promo.amount;

    return {lines, itemsSubtotal, total, clientPhone, deliveryInfo, payment: selectedPayMethod, promo};
  }

  function validateOrder(order){
    if(order.lines.length === 0) return 'Your cart is empty.';
    if(!order.clientPhone) return 'Please enter your phone number.';
    if(order.deliveryInfo.method === 'Home Delivery' && !order.deliveryInfo.address && !capturedLocation){
      return 'Please type your delivery address or use current location.';
    }
    if(selectedPayMethod === 'mpesa'){
      const digits = document.getElementById('mpesaPhone').value.replace(/\D/g,'');
      if(digits.length !== 9) return 'Enter your M-Pesa number to continue, or switch to Cash.';
    }
    return null;
  }

  function generateOrderPDF(order){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 18;

    // Header band
    doc.setFillColor(22,18,16);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255,255,255);
    doc.setFont('helvetica','bold'); doc.setFontSize(16);
    doc.text('Azizo Butchery & Grill', 14, 15);
    doc.setFont('helvetica','normal'); doc.setFontSize(9);
    doc.setTextColor(200,155,60);
    doc.text('INVOICE / ORDER SUMMARY', 14, 22);
    doc.setTextColor(255,255,255);
    doc.text(new Date().toLocaleString(), pageW-14, 15, {align:'right'});
    doc.text(`Order #${String(Date.now()).slice(-8)}`, pageW-14, 22, {align:'right'});
    doc.setTextColor(0,0,0);
    y = 38;

    // Customer / delivery details box
    const detailRows = [
      ['Customer Phone', order.clientPhone],
      ['Payment Method', order.payment==='mpesa' ? 'M-Pesa' : 'Cash'],
    ];
    if(order.deliveryInfo.method === 'Pickup'){
      detailRows.push(['Fulfilment', 'Pickup']);
      detailRows.push(['Pickup Branch', order.deliveryInfo.branch]);
      detailRows.push(['Pickup Time', order.deliveryInfo.time]);
    } else {
      detailRows.push(['Fulfilment', 'Home Delivery']);
      detailRows.push(['Dispatch Branch', order.deliveryInfo.originBranch || '—']);
      detailRows.push(['Delivery Address', order.deliveryInfo.address || '(shared via map pin)']);
      if(order.deliveryInfo.distanceKm != null){
        detailRows.push(['Distance', `~${order.deliveryInfo.distanceKm.toFixed(1)} km`]);
      }
      if(order.deliveryInfo.mapsLink) detailRows.push(['Map Link', order.deliveryInfo.mapsLink]);
    }

    doc.autoTable({
      startY: y,
      body: detailRows,
      theme: 'plain',
      styles: {fontSize:9.5, cellPadding:1.5},
      columnStyles: {0:{fontStyle:'bold', cellWidth:38}, 1:{textColor:[40,80,160]}},
    });
    y = doc.lastAutoTable.finalY + 8;

    // Line items table
    const body = order.lines.map(l => [l.n, l.name, `${l.qty} ${l.unit}`, `KSh ${l.price}`, `KSh ${l.lineTotal}`]);
    doc.autoTable({
      startY: y,
      head: [['#','Item','Qty','Unit Price','Line Total']],
      body,
      theme: 'grid',
      headStyles: {fillColor:[22,18,16], textColor:[255,255,255], fontStyle:'bold'},
      styles: {fontSize:9.5, cellPadding:3},
      columnStyles: {0:{cellWidth:10, halign:'center'}, 2:{halign:'center'}, 3:{halign:'right'}, 4:{halign:'right'}},
    });
    y = doc.lastAutoTable.finalY + 4;

    // Totals block
    const totalsBody = [['Items Subtotal', `KSh ${order.itemsSubtotal}`]];
    if(order.promo){
      totalsBody.push([`Promo (${order.promo.code}, ${order.promo.pct}%)`, `− KSh ${order.promo.amount}`]);
    }
    if(order.deliveryInfo.method === 'Home Delivery'){
      totalsBody.push(['Delivery Fee', order.deliveryInfo.fee != null ? `KSh ${order.deliveryInfo.fee}` : 'To be confirmed']);
    }
    totalsBody.push(['TOTAL', `KSh ${order.total}`]);
    doc.autoTable({
      startY: y,
      body: totalsBody,
      theme: 'plain',
      styles: {fontSize: 10, cellPadding: 2},
      columnStyles: {0:{cellWidth:150, fontStyle:'bold', halign:'right'}, 1:{cellWidth:32, halign:'right', fontStyle:'bold'}},
      didParseCell: (data)=>{
        if(data.row.index === totalsBody.length-1){
          data.cell.styles.fontSize = 12.5;
          data.cell.styles.textColor = [22,18,16];
        }
      }
    });

    doc.setFontSize(8); doc.setTextColor(130,130,130);
    doc.text('Thank you for choosing Azizo Butchery & Grill — open 24 hours.', 14, doc.internal.pageSize.getHeight()-10);

    doc.save(`Azizo-Order-${Date.now()}.pdf`);
  }

  function padR(str, len){ str = String(str); return str.length >= len ? str.slice(0,len-1)+'…' : str.padEnd(len,' '); }
  function padL(str, len){ str = String(str); return str.length >= len ? str.slice(0,len) : str.padStart(len,' '); }

  function buildWhatsAppMessage(order){
    let msg = `*Azizo Butchery & Grill — New Order*\n\n`;
    msg += `*Customer Phone:* ${order.clientPhone}\n`;
    if(order.deliveryInfo.method === 'Pickup'){
      msg += `*Fulfilment:* Pickup\n`;
      msg += `*Branch:* ${order.deliveryInfo.branch}\n`;
      msg += `*Pickup Time:* ${order.deliveryInfo.time}\n`;
    } else {
      msg += `*Fulfilment:* Home Delivery\n`;
      if(order.deliveryInfo.originBranch) msg += `*Dispatch From:* ${order.deliveryInfo.originBranch}\n`;
      if(order.deliveryInfo.address) msg += `*Address:* ${order.deliveryInfo.address}\n`;
      if(order.deliveryInfo.distanceKm != null) msg += `*Distance:* ~${order.deliveryInfo.distanceKm.toFixed(1)} km\n`;
      if(order.deliveryInfo.mapsLink) msg += `*Location Pin:* ${order.deliveryInfo.mapsLink}\n`;
    }
    msg += `*Payment:* ${order.payment==='mpesa' ? 'M-Pesa' : 'Cash'}\n`;
    if(recurringOrderInfo){
      msg += `*Recurring Order:* Yes — please repeat this ${recurringOrderInfo.frequency.toLowerCase()} (we'll confirm each cycle with you on WhatsApp, no automatic billing)\n`;
    }
    msg += `\n`;

    msg += '```\n';
    msg += `${padR('#',3)}${padR('Item',20)}${padL('Qty',8)}${padL('Total',10)}\n`;
    msg += `${'-'.repeat(41)}\n`;
    order.lines.forEach(l=>{
      msg += `${padR(l.n,3)}${padR(l.name,20)}${padL(l.qty+' '+l.unit,8)}${padL(l.lineTotal,10)}\n`;
    });
    msg += `${'-'.repeat(41)}\n`;
    msg += `${padR('',23)}${padL('Items',8)}${padL(order.itemsSubtotal,10)}\n`;
    if(order.promo){
      msg += `${padR('',23)}${padL('Promo',8)}${padL('-'+order.promo.amount,10)}\n`;
    }
    if(order.deliveryInfo.method === 'Home Delivery'){
      msg += `${padR('',23)}${padL('Deliv.',8)}${padL(order.deliveryInfo.fee != null ? order.deliveryInfo.fee : 'TBC',10)}\n`;
    }
    msg += `${padR('',23)}${padL('TOTAL',8)}${padL(order.total,10)}\n`;
    msg += '```\n\n';
    if(order.promo) msg += `Promo code used: *${order.promo.code}* (${order.promo.pct}% off)\n`;
    msg += `_A PDF invoice of this order has been downloaded on my device — happy to send it here too._`;
    return msg;
  }

  // Plays a short "crowd cheer" — synthesized live in the browser (swelling
  // filtered noise for the crowd, scattered clap bursts, a bright ascending
  // chime) so there's no audio file to download or host. Fires once the
  // order is confirmed, as a little send-off to thank the customer.
  function playCelebrationSound(){
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if(!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);

      // Crowd swell: filtered white noise rising and fading like a cheer.
      const swellDur = 1.6;
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * swellDur), ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for(let i = 0; i < data.length; i++){ data[i] = Math.random() * 2 - 1; }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1800;
      bandpass.Q.value = 0.6;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.9, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + swellDur);
      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + swellDur);

      // Scattered claps: short high-passed noise bursts at random moments.
      for(let c = 0; c < 14; c++){
        const t = now + Math.random() * 1.1;
        const clapLen = 0.05 + Math.random() * 0.03;
        const clapBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * clapLen), ctx.sampleRate);
        const cd = clapBuf.getChannelData(0);
        for(let i = 0; i < cd.length; i++){ cd[i] = (Math.random() * 2 - 1) * (1 - i / cd.length); }
        const clapSrc = ctx.createBufferSource();
        clapSrc.buffer = clapBuf;
        const clapFilter = ctx.createBiquadFilter();
        clapFilter.type = 'highpass';
        clapFilter.frequency.value = 2200 + Math.random() * 1500;
        const clapGain = ctx.createGain();
        clapGain.gain.value = 0.25 + Math.random() * 0.2;
        clapSrc.connect(clapFilter);
        clapFilter.connect(clapGain);
        clapGain.connect(master);
        clapSrc.start(t);
        clapSrc.stop(t + clapLen);
      }

      // Triumphant chime: a short ascending four-note flourish (C-E-G-C).
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const t = now + 0.15 + idx * 0.11;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.5);
      });

      setTimeout(() => { try{ ctx.close(); }catch(e){} }, (swellDur + 0.6) * 1000);
    }catch(e){
      console.warn('Celebration sound skipped:', e);
    }
  }

  function placeOrder(){
    const order = buildOrderData();
    const note = document.getElementById('checkoutNote');
    const err = validateOrder(order);
    if(err){
      note.textContent = err;
      note.className = 'checkout-note err';
      return;
    }
    note.textContent = '';
    note.className = 'checkout-note';
    playCelebrationSound();

    let pdfOk = true;
    try{
      generateOrderPDF(order);
    }catch(e){
      pdfOk = false;
      console.error('PDF generation failed:', e);
    }

    const message = buildWhatsAppMessage(order);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    trackConversion('order_placed', {value: order.total, currency: 'KES'});
    saveLastOrder();
    submitOrderToBackend(order); // fire-and-forget — WhatsApp above is already the order of record
    recurringOrderInfo = null;

    if(!pdfOk){
      note.textContent = "Order sent to WhatsApp. (PDF download didn't work on this device/browser — the item list above still has everything we need.)";
      note.className = 'checkout-note';
    }
  }

  // ---------- CUSTOMER ACCOUNTS (optional) & BACKEND ORDER LOG ----------
  // Guest checkout always works via WhatsApp above, with or without the backend.
  // An account just saves order history for reordering — never required at checkout.
  const ACCOUNT_STORAGE_KEY = 'azizoCustomerAuth';
  function loadAuth(){
    try{ const v = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || 'null'); return (v && v.token) ? v : null; }
    catch(e){ return null; }
  }
  function saveAuth(auth){ try{ localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(auth)); }catch(e){} }
  function clearAuth(){ try{ localStorage.removeItem(ACCOUNT_STORAGE_KEY); }catch(e){} }
  let customerAuth = loadAuth();

  function apiBase(){ return (CONFIG.API_BASE_URL || '').replace(/\/+$/, ''); }
  function apiAvailable(){ return !!apiBase(); }

  // Every backend route is mounted under /api (see server.js: app.use('/api/orders', ...),
  // app.use('/api/auth', ...)), so every call here is built as <API_BASE_URL>/api<path>.
  async function apiFetch(path, options){
    options = options || {};
    const headers = Object.assign({'Content-Type':'application/json'}, options.headers || {});
    if(customerAuth && customerAuth.token) headers['Authorization'] = `Bearer ${customerAuth.token}`;
    const res = await fetch(`${apiBase()}/api${path}`, Object.assign({}, options, {headers}));
    let data = {};
    try{ data = await res.json(); }catch(e){}
    if(!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  // Sends a copy of every order to the backend order log (the "after-sales record"),
  // linked to the logged-in customer when there is one. Never blocks or alters the
  // WhatsApp flow — if the backend is unset or unreachable, this just quietly no-ops.
  async function submitOrderToBackend(order){
    if(!apiAvailable()) return;
    try{
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: (customerAuth && customerAuth.customer) ? customerAuth.customer.name : null,
          customer_phone: order.clientPhone,
          fulfilment: order.deliveryInfo.method === 'Pickup' ? 'pickup' : 'delivery',
          branch: order.deliveryInfo.branch || order.deliveryInfo.originBranch || null,
          pickup_time: order.deliveryInfo.time || null,
          delivery_address: order.deliveryInfo.address || null,
          delivery_lat: capturedLocation ? capturedLocation.lat : null,
          delivery_lng: capturedLocation ? capturedLocation.lng : null,
          delivery_fee: order.deliveryInfo.fee || 0,
          payment_method: order.payment,
          promo_code: order.promo ? order.promo.code : null,
          items_subtotal: order.itemsSubtotal,
          total: order.total,
          items: order.lines.map(l => ({id: l.id || null, name: l.name, qty: l.qty, unit: l.unit, price: l.price})),
        }),
      });
    }catch(e){
      console.warn('Backend order log skipped (non-fatal):', e.message);
    }
  }

  // ---------- FLOATING "BUY NOW" CTA ----------
  // Always-visible, conspicuous shortcut into the shop. Always goes to Fresh
  // Market — if we're already there, scroll to the product grid instead of a
  // no-op page reload.
  function injectFloatingBuyNow(){
    if(document.getElementById('floatingBuyNow')) return;
    const btn = document.createElement('a');
    btn.id = 'floatingBuyNow';
    btn.className = 'floating-buy-now';
    btn.innerHTML = '<span class="fb-icon">🛒</span><span>Buy Now</span>';
    if(document.body.dataset.page === 'fresh-market'){
      btn.href = '#boxes';
      btn.onclick = (e)=>{ e.preventDefault(); document.getElementById('boxes')?.scrollIntoView({behavior:'smooth', block:'start'}); };
    } else {
      btn.href = 'fresh-market.html';
    }
    document.body.appendChild(btn);
  }

  // ---------- FLOATING SOCIAL SIDEBAR ----------
  // Fixed to the viewport (not the page), so it travels with the user as they
  // scroll rather than sitting only in the footer. Reuses the same icons/URLs
  // as the footer's contact-icons and hides any platform left unconfigured.
  function injectFloatingSocial(){
    if(document.getElementById('floatingSocial')) return;
    const links = [];
    links.push(`<a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" title="WhatsApp us" aria-label="WhatsApp us"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.74 13.4L3 21l3.71-1.28a8.9 8.9 0 0 0 4.34 1.11h.01a8.93 8.93 0 0 0 8.93-8.93 8.87 8.87 0 0 0-2.4-6.27zm-5.55 13.7h-.01a7.4 7.4 0 0 1-3.78-1.04l-.27-.16-2.81.97.95-2.75-.18-.28a7.42 7.42 0 0 1 11.61-9.16 7.36 7.36 0 0 1 2.18 5.25 7.43 7.43 0 0 1-7.69 7.17zm4.07-5.56c-.22-.11-1.31-.65-1.52-.72-.2-.08-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06a6.06 6.06 0 0 1-1.78-1.1 6.65 6.65 0 0 1-1.23-1.53c-.13-.22 0-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43a.82.82 0 0 0-.6.28 2.5 2.5 0 0 0-.78 1.86c0 1.1.8 2.16.91 2.31.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.49-1.05.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.42-.26z"/></svg></a>`);
    if(CONFIG.FACEBOOK_URL){
      links.push(`<a href="${CONFIG.FACEBOOK_URL}" target="_blank" rel="noopener" title="Facebook" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg></a>`);
    }
    if(CONFIG.INSTAGRAM_URL){
      links.push(`<a href="${CONFIG.INSTAGRAM_URL}" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>`);
    }
    if(CONFIG.TIKTOK_URL){
      links.push(`<a href="${CONFIG.TIKTOK_URL}" target="_blank" rel="noopener" title="TikTok" aria-label="TikTok"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2h-3v14.2a2.8 2.8 0 1 1-2-2.68V10.4a5.9 5.9 0 1 0 5 5.83V8.9a7.6 7.6 0 0 0 4.5 1.5V7.4a4.6 4.6 0 0 1-4.5-4.5V2z"/></svg></a>`);
    }
    const bar = document.createElement('div');
    bar.id = 'floatingSocial';
    bar.className = 'floating-social';
    bar.innerHTML = links.join('');
    document.body.appendChild(bar);
  }

  // ---------- FLOATING UI VISIBILITY ----------
  // These two fixed-position widgets are injected on every page. Only the
  // home page has a hero sitting directly under them, and on small screens
  // the hero's own stat numbers and photo land exactly where these buttons
  // render — so on the home page they stay hidden until the hero has
  // scrolled by; everywhere else (no hero to collide with) they show right
  // away, same as before this fix.
  function updateFloatingVisibility(){
    const heroEl = document.querySelector('.hero');
    const show = !heroEl || window.scrollY > (heroEl.offsetHeight - 90);
    document.body.classList.toggle('floaters-visible', show);
  }

  function injectAccountUI(){
    if(!apiAvailable()) return; // no backend configured — don't show a feature that can't work yet
    const cartBtn = document.querySelector('.cart-btn');
    // Insert via the cart button's OWN parent (the .nav-utils cluster), not
    // .nav-inner directly — the utility buttons live one level deeper than
    // they used to, and inserting relative to the wrong parent throws.
    if(cartBtn && cartBtn.parentNode && !document.getElementById('accountBtn')){
      const btn = document.createElement('button');
      btn.className = 'account-btn';
      btn.id = 'accountBtn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Account');
      btn.onclick = openAccountPanel;
      cartBtn.parentNode.insertBefore(btn, cartBtn);
    }
    if(!document.getElementById('accountOverlay')){
      const overlay = document.createElement('div');
      overlay.className = 'account-overlay';
      overlay.id = 'accountOverlay';
      overlay.onclick = closeAccountPanel;
      document.body.appendChild(overlay);
    }
    if(!document.getElementById('accountPanel')){
      const panel = document.createElement('div');
      panel.className = 'account-panel';
      panel.id = 'accountPanel';
      panel.innerHTML = `
        <div class="drawer-head">
          <h3>Account</h3>
          <button class="drawer-close" onclick="closeAccountPanel()" aria-label="Close">&times;</button>
        </div>
        <div class="account-panel-body">
          <div id="accountLoggedOut">
            <div class="account-tabs">
              <button type="button" class="account-tab active" id="tabLogin" onclick="switchAccountTab('login')">Log In</button>
              <button type="button" class="account-tab" id="tabRegister" onclick="switchAccountTab('register')">Create Account</button>
            </div>
            <div id="loginPane">
              <input type="tel" class="account-field" id="loginPhone" placeholder="Phone e.g. 0712345678">
              <input type="password" class="account-field" id="loginPassword" placeholder="Password">
              <button type="button" class="account-submit" onclick="doLogin()">Log In</button>
            </div>
            <div id="registerPane" style="display:none;">
              <input type="text" class="account-field" id="regName" placeholder="Full name">
              <input type="tel" class="account-field" id="regPhone" placeholder="Phone e.g. 0712345678">
              <input type="password" class="account-field" id="regPassword" placeholder="Password (min 6 characters)">
              <button type="button" class="account-submit" onclick="doRegister()">Create Account</button>
            </div>
            <p class="account-note" id="accountNote"></p>
            <p class="account-guest-note">You never need an account to order — WhatsApp checkout always works as a guest. Creating one just saves your order history here for easy reordering.</p>
          </div>
          <div id="accountLoggedIn" style="display:none;">
            <p class="account-greeting">Hi, <span id="accountCustomerName"></span></p>
            <p class="account-sub">Your recent orders:</p>
            <div id="orderHistoryList"></div>
            <button type="button" class="account-logout-btn" onclick="doLogout()">Log Out</button>
          </div>
        </div>`;
      document.body.appendChild(panel);
    }
    renderAccountButton();
  }

  function renderAccountButton(){
    const btn = document.getElementById('accountBtn');
    if(!btn) return;
    btn.textContent = customerAuth ? `👤 ${customerAuth.customer.name.split(' ')[0]}` : '👤 Account';
  }

  function openAccountPanel(){
    document.getElementById('accountPanel').classList.add('open');
    document.getElementById('accountOverlay').classList.add('open');
    if(customerAuth){ showLoggedInView(); } else { showLoggedOutView(); }
  }
  function closeAccountPanel(){
    document.getElementById('accountPanel').classList.remove('open');
    document.getElementById('accountOverlay').classList.remove('open');
  }
  function switchAccountTab(which){
    document.getElementById('tabLogin').classList.toggle('active', which === 'login');
    document.getElementById('tabRegister').classList.toggle('active', which === 'register');
    document.getElementById('loginPane').style.display = which === 'login' ? 'block' : 'none';
    document.getElementById('registerPane').style.display = which === 'register' ? 'block' : 'none';
    document.getElementById('accountNote').textContent = '';
  }
  function showLoggedOutView(){
    document.getElementById('accountLoggedOut').style.display = 'block';
    document.getElementById('accountLoggedIn').style.display = 'none';
  }
  function showLoggedInView(){
    document.getElementById('accountLoggedOut').style.display = 'none';
    document.getElementById('accountLoggedIn').style.display = 'block';
    document.getElementById('accountCustomerName').textContent = customerAuth.customer.name;
    loadOrderHistory();
  }

  function setAccountNote(msg, ok){
    const note = document.getElementById('accountNote');
    if(!note) return;
    note.textContent = msg;
    note.className = 'account-note' + (ok ? ' ok' : '');
  }

  async function doLogin(){
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    if(!phone || !password){ setAccountNote('Enter your phone and password.'); return; }
    try{
      const data = await apiFetch('/auth/login', {method:'POST', body: JSON.stringify({phone, password})});
      customerAuth = {token: data.token, customer: data.customer};
      saveAuth(customerAuth);
      renderAccountButton();
      showLoggedInView();
    }catch(e){ setAccountNote(e.message); }
  }
  async function doRegister(){
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    if(!name || !phone || !password){ setAccountNote('Fill in your name, phone, and a password.'); return; }
    try{
      const data = await apiFetch('/auth/register', {method:'POST', body: JSON.stringify({name, phone, password})});
      customerAuth = {token: data.token, customer: data.customer};
      saveAuth(customerAuth);
      renderAccountButton();
      showLoggedInView();
    }catch(e){ setAccountNote(e.message); }
  }
  function doLogout(){
    customerAuth = null;
    clearAuth();
    renderAccountButton();
    showLoggedOutView();
    switchAccountTab('login');
  }

  async function loadOrderHistory(){
    const list = document.getElementById('orderHistoryList');
    if(!list) return;
    list.innerHTML = '<p class="order-history-empty">Loading…</p>';
    try{
      const data = await apiFetch('/orders/me/history');
      if(!data.orders || data.orders.length === 0){
        list.innerHTML = '<p class="order-history-empty">No orders yet — once you check out, they\'ll show up here.</p>';
        return;
      }
      list.innerHTML = data.orders.map(o => `
        <div class="order-history-item">
          <div class="order-history-top">
            <span class="order-history-id">#${o.id}</span>
            <span class="order-history-status">${(o.status || 'received').replace(/_/g,' ')}</span>
          </div>
          <div class="order-history-meta">KSh ${o.total} · ${o.fulfilment} · ${new Date(o.created_at).toLocaleDateString()}</div>
        </div>`).join('');
    }catch(e){
      list.innerHTML = `<p class="order-history-empty">Couldn't load order history (${e.message}).</p>`;
    }
  }

  function waEnquiry(packageName){
    const msg = encodeURIComponent(`Hello Azizo Butchery & Grill, I'd like to enquire about the "${packageName}" for an upcoming event. Could you share more details?`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    trackConversion('whatsapp_enquiry', {package: packageName});
  }

  function shareStory(){
    const msg = encodeURIComponent(`Hi Azizo Butchery & Grill! I'd like to share a food story (best meal / cooking tip / zero-waste tip):\n\n`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    trackConversion('story_shared', {});
  }

  // ---------- MEAL PLANNER ----------
  const planDurations = [
    {id:'1w', label:'1 Week'},
    {id:'2w', label:'2 Weeks'},
    {id:'3w', label:'3 Weeks'},
    {id:'1m', label:'1 Month'},
  ];
  const PLAN_DISCOUNT = 0.10;
  let planDuration = '1w';
  const planQty = {}; // itemId -> qty (kg/units for the whole period)

  function renderPlanDuration(){
    const bar = document.getElementById('planDuration');
    if(!bar) return;
    bar.innerHTML = planDurations.map(d=>`<button class="chip ${planDuration===d.id?'active':''}" onclick="selectPlanDuration('${d.id}')">${d.label}</button>`).join('');
  }
  function selectPlanDuration(id){
    planDuration = id;
    renderPlanDuration();
    renderPlanSummary();
  }

  function renderPlannerItems(){
    const wrap = document.getElementById('plannerItems');
    if(!wrap) return;
    wrap.innerHTML = freshItems.map(i=>{
      const qty = planQty[i.id] || 0;
      return `
      <div class="plan-item-card">
        <div class="plan-item-top">
          <span class="tag-cat"><span class="dot ${i.kind==='red'?'dot-red':'dot-white'}"></span>${i.cat}</span>
        </div>
        <h4>${i.name}</h4>
        <div class="plan-item-price">KSh ${i.price}/${i.unit}</div>
        <div class="stepper">
          <button onclick="setPlanQty('${i.id}', ${qty}-1)">−</button>
          <input type="number" min="0" value="${qty}" id="planqty-${i.id}" onchange="setPlanQty('${i.id}', this.value)">
          <button onclick="setPlanQty('${i.id}', ${qty}+1)">+</button>
          <span class="unit">${i.unit}</span>
        </div>
      </div>`;
    }).join('');
  }

  function setPlanQty(id, val){
    const q = Math.max(0, parseInt(val) || 0);
    if(q === 0) delete planQty[id]; else planQty[id] = q;
    renderPlannerItems();
    renderPlanSummary();
  }

  const quickPlans = {
    family: {f1:2, f7:2, f8:1},
    grill: {f2:3, f5:2, f6:1},
    lean: {f7:2, f9:2, f3:1},
  };
  function applyQuickPlan(key){
    const preset = quickPlans[key];
    if(!preset) return;
    Object.entries(preset).forEach(([id,qty])=>{ planQty[id] = qty; });
    renderPlannerItems();
    renderPlanSummary();
    showToast('Preset applied — adjust quantities anytime');
  }

  function renderPlanSummary(){
    if(!document.getElementById('planSummaryList')) return;
    const ids = Object.keys(planQty);
    const listEl = document.getElementById('planSummaryList');
    const emptyEl = document.getElementById('planSummaryEmpty');
    const totalsEl = document.getElementById('planTotals');
    const addBtn = document.getElementById('addPlanBtn');
    const durationLabel = planDurations.find(d=>d.id===planDuration).label;

    if(ids.length === 0){
      emptyEl.style.display = 'block';
      listEl.innerHTML = '';
      totalsEl.style.display = 'none';
      addBtn.disabled = true;
      return;
    }
    emptyEl.style.display = 'none';
    totalsEl.style.display = 'block';
    addBtn.disabled = false;

    listEl.innerHTML = ids.map(id=>{
      const item = freshItems.find(f=>f.id===id);
      const qty = planQty[id];
      return `
      <div class="plan-summary-row">
        <div>
          <div class="psr-name">${item.name}</div>
          <div class="psr-meta">${qty} ${item.unit} × KSh ${item.price}</div>
        </div>
        <button class="psr-remove" onclick="setPlanQty('${id}', 0)" title="Remove">&times;</button>
      </div>`;
    }).join('');

    const subtotal = ids.reduce((sum,id)=>sum + freshItems.find(f=>f.id===id).price * planQty[id], 0);
    const discount = Math.round(subtotal * PLAN_DISCOUNT);
    const total = subtotal - discount;
    document.getElementById('planSubtotal').textContent = `KSh ${subtotal}`;
    document.getElementById('planDiscount').textContent = `− KSh ${discount}`;
    document.getElementById('planGrandTotal').textContent = `KSh ${total}`;
  }

  let recurringOrderInfo = null; // {frequency} when the recurring checkbox is used

  function toggleRecurringBox(){
    const checked = document.getElementById('recurringCheckbox').checked;
    document.getElementById('recurringFrequency').style.display = checked ? 'block' : 'none';
  }

  function addPlanToCart(){
    const ids = Object.keys(planQty);
    if(ids.length === 0) return;
    const durationLabel = planDurations.find(d=>d.id===planDuration).label;
    const isRecurring = document.getElementById('recurringCheckbox').checked;
    recurringOrderInfo = isRecurring ? {frequency: document.getElementById('recurringFrequency').value} : null;
    ids.forEach(id=>{
      const item = freshItems.find(f=>f.id===id);
      const qty = planQty[id];
      const cartKey = `${id}::plan::${planDuration}`;
      cart[cartKey] = {
        item: {
          cat: `Meal Plan · ${durationLabel}`,
          name: item.name,
          price: Math.round(item.price * (1 - PLAN_DISCOUNT)),
          unit: item.unit
        },
        qty,
        source: 'plan'
      };
    });
    // reset planner
    for(const k of ids) delete planQty[k];
    renderPlannerItems();
    renderPlanSummary();
    updateCartUI();
    showToast(`${durationLabel} meat plan added to cart (10% off)${isRecurring ? ' — recurring' : ''}`);
    openCart();
  }

  const fbStoryEl = document.getElementById('fbStoryLink');
  if(fbStoryEl) fbStoryEl.href = CONFIG.FACEBOOK_URL;
  const fbIconEl = document.getElementById('fbIconLink');
  if(fbIconEl) fbIconEl.href = CONFIG.FACEBOOK_URL;
  if(CONFIG.INSTAGRAM_URL){
    const ig = document.getElementById('igIconLink');
    if(ig){ ig.href = CONFIG.INSTAGRAM_URL; ig.style.display = 'flex'; }
  }
  if(CONFIG.TIKTOK_URL){
    const tt = document.getElementById('ttIconLink');
    if(tt){ tt.href = CONFIG.TIKTOK_URL; tt.style.display = 'flex'; }
  }

  // ---------- GALLERY ----------
  function renderGallery(){
    const track = document.getElementById('galleryMarquee');
    if(!track) return;
    const shopfrontSrc = document.querySelector('.shopfront-photo')?.src || '';
    const tiles = [];
    if(shopfrontSrc){
      tiles.push(`<div class="marquee-item"><img src="${shopfrontSrc}" alt="Azizo Grill storefront"><div class="cap">Syokimau Branch</div></div>`);
    }
    const placeholderCount = 5;
    for(let i=0;i<placeholderCount;i++){
      tiles.push(`<div class="marquee-item placeholder"><span class="icon">📷</span><span>Photo Coming Soon</span></div>`);
    }
    // Duplicated so the CSS animation can scroll exactly one set's width and loop
    // seamlessly (translateX(-50%) lands precisely back where the first copy started).
    track.innerHTML = tiles.join('') + tiles.join('');
  }

  // ---------- CURATED BOXES ----------
  // Fixed combos mixing fresh + ready-to-eat items — one tap adds everything at once.
  // Priced as the sum of listed items (no separate discount, unlike the Meal Planner's
  // bulk raw-meat subscriptions). Edit contents/prices here as the menu evolves.
  const curatedBoxes = [
    {
      name: 'Braai Starter Pack',
      desc: 'Everything for a weekend braai with friends.',
      items: [{id:'f2', qty:2}, {id:'f7', qty:1}, {id:'r1', qty:1}], // Ribeye 2kg, Chicken Breast 1kg, Nyama Choma 1kg
    },
    {
      name: 'Family Weekly Box',
      desc: 'A balanced mix to stock the kitchen for the week.',
      items: [{id:'f1', qty:2}, {id:'f7', qty:2}, {id:'f8', qty:1}], // Rump 2kg, Chicken Breast 2kg, Tilapia 1kg
    },
    {
      name: 'Quick Grill Box',
      desc: 'Ready-to-eat favourites — minimal prep needed.',
      items: [{id:'r2', qty:1}, {id:'r5', qty:2}, {id:'r4', qty:1}], // Grilled Chicken, 2x Beef Shawarma, Fried Fish
    },
  ];

  // ---------- RECIPES ----------
  // One original recipe per raw/fresh product — these are the items people actually
  // cook at home, so they're what benefit from a real recipe. Ready-to-eat items
  // (nyama choma, shawarma, fried chicken/fish) are already prepared and don't need one.
  const recipes = [
    {
      productId: 'f1', tag: 'Beef',
      title: 'Pan-Seared Rump Steak with Garlic Butter',
      teaser: 'A weeknight steak that goes from fridge to plate in fifteen minutes, finished with a spoonful of melting garlic butter.',
      ingredients: ['Beef Rump steaks', 'Salt and black pepper', '2 tbsp butter', '2 cloves garlic, crushed', 'A sprig of rosemary or thyme'],
      method: ['Pat the steaks dry and season generously with salt at least 20 minutes before cooking.', 'Heat a heavy pan until almost smoking, add a little oil, and sear 2-3 minutes per side for medium.', 'In the last minute, add butter, garlic, and herbs, spooning the melted butter over the meat.', 'Rest for 5 minutes before slicing against the grain.'],
    },
    {
      productId: 'f2', tag: 'Beef',
      title: 'Classic Grilled Ribeye',
      teaser: 'Well-marbled and forgiving on the grill — this is the cut that rewards you for doing almost nothing to it.',
      ingredients: ['Beef Ribeye', 'Coarse salt', 'Black pepper', 'Olive oil'],
      method: ['Bring the steak to room temperature, about 30 minutes out of the fridge.', 'Season both sides generously with salt and pepper.', 'Grill over hot coals, 3-4 minutes per side for medium-rare.', 'Rest 5 minutes, then slice and serve.'],
    },
    {
      productId: 'f3', tag: 'Beef',
      title: 'One-Pan Beef and Onion Stew',
      teaser: 'A rich, slow-simmered stew that turns everyday mince into Sunday-dinner comfort food.',
      ingredients: ['Beef Mince', '1 large onion, sliced', '2 tomatoes, chopped', '2 cloves garlic', '1 tsp curry powder', 'Beef stock or water', 'Salt'],
      method: ['Brown the mince in a hot pan, breaking it up as it cooks.', 'Add onion and garlic, cook until soft.', 'Stir in tomatoes and curry powder, then add stock to just cover.', 'Simmer uncovered 25-30 minutes until thickened. Serve over rice or ugali.'],
    },
    {
      productId: 'f4', tag: 'Pork',
      title: 'Pan-Fried Pork Chops with Apple',
      teaser: 'Quick-seared chops paired with a sweet-tart pan sauce that comes together in the same skillet.',
      ingredients: ['Pork Chops', 'Salt and pepper', '1 apple, sliced', '1 tbsp butter', 'A splash of vinegar or lemon juice'],
      method: ['Season chops well and sear in a hot pan, 4 minutes per side, until cooked through.', 'Remove and rest.', 'In the same pan, add butter and apple slices, cooking until soft.', 'Deglaze with vinegar, spoon over the chops, and serve.'],
    },
    {
      productId: 'f5', tag: 'Pork',
      title: 'Slow-Grilled Sticky Ribs',
      teaser: 'Low, slow, and basted often — the ribs that make people stop talking mid-conversation.',
      ingredients: ['Pork Ribs', 'Salt', '2 tbsp honey', '2 tbsp soy sauce or tamarind', '1 tsp chili (optional)', 'Garlic'],
      method: ['Season ribs with salt and let sit 30 minutes.', 'Grill over indirect medium-low heat, turning occasionally, 45-60 minutes until tender.', 'Mix honey, soy sauce, garlic and chili into a glaze.', 'Brush over the ribs in the last 10 minutes, letting it caramelize without burning.'],
    },
    {
      productId: 'f6', tag: 'Chicken',
      title: 'Whole Roast Chicken with Lemon and Herbs',
      teaser: 'One bird, one pan, and a kitchen that smells incredible for an hour.',
      ingredients: ['Whole Chicken', '1 lemon, halved', 'A few garlic cloves', 'Rosemary or thyme', 'Salt', 'Oil'],
      method: ['Pat the chicken dry, season generously inside and out with salt.', 'Stuff the cavity with lemon halves, garlic, and herbs.', 'Rub the skin with oil and roast at 200°C for 70-80 minutes, until juices run clear.', 'Rest 10 minutes before carving.'],
    },
    {
      productId: 'f7', tag: 'Chicken',
      title: 'Juicy Grilled Chicken Breast',
      teaser: "The trick to chicken breast that doesn't dry out is simpler than you'd think — and it starts before it hits the heat.",
      ingredients: ['Chicken Breast', 'Salt', 'Oil', 'Lemon juice', 'A pinch of paprika'],
      method: ['Brine the chicken in lightly salted water for 15-20 minutes, then pat dry.', 'Rub with oil, lemon juice, and paprika.', 'Grill over medium heat, 5-6 minutes per side, without pressing down on it.', 'Rest 5 minutes before slicing.'],
    },
    {
      productId: 'f8', tag: 'Fish',
      title: 'Whole Grilled Tilapia, Kenyan Style',
      teaser: 'Scored, stuffed with herbs, and grilled whole — this is how tilapia is meant to be cooked.',
      ingredients: ['Whole Tilapia, scaled and gutted', 'Salt', 'Garlic-ginger paste', 'Coriander', 'Lemon', 'Oil'],
      method: ['Score the fish diagonally on both sides.', 'Rub inside and out with salt, garlic-ginger paste, and a squeeze of lemon; stuff the cavity with coriander.', 'Oil the grill well and cook 6-8 minutes per side over medium heat, until the flesh flakes easily.', 'Serve with ugali and kachumbari.'],
    },
    {
      productId: 'f9', tag: 'Fish',
      title: 'Pan-Fried Nile Perch with Lime',
      teaser: 'A firm, flaky fillet that only needs a hot pan, butter, and a squeeze of lime to shine.',
      ingredients: ['Nile Perch Fillet', 'Salt', 'A light dusting of flour', 'Butter', 'Lime'],
      method: ["Pat the fillet dry, season with salt, and dust lightly with flour.", "Heat butter in a pan until foaming, then lay the fillet in and don't move it for 3-4 minutes.", 'Flip and cook another 2-3 minutes until just opaque.', 'Finish with a squeeze of lime and serve immediately.'],
    },
  ];

  function renderRecipes(){
    const grid = document.getElementById('recipeGrid');
    if(!grid) return;
    grid.innerHTML = recipes.map((r, idx) => `
      <div class="recipe-card">
        <span class="recipe-tag">${r.tag}</span>
        <h3>${r.title}</h3>
        <p class="recipe-teaser">${r.teaser}</p>
        <div class="recipe-full" id="recipeFull-${idx}">
          <p class="recipe-full-label">Ingredients</p>
          <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
          <p class="recipe-full-label">Method</p>
          <ol>${r.method.map(m=>`<li>${m}</li>`).join('')}</ol>
        </div>
        <button class="recipe-readmore" onclick="toggleRecipe(${idx})" id="recipeBtn-${idx}">Read More ↓</button>
      </div>
    `).join('');
  }

  function toggleRecipe(idx){
    const full = document.getElementById(`recipeFull-${idx}`);
    const btn = document.getElementById(`recipeBtn-${idx}`);
    const isOpen = full.style.display === 'block';
    full.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? 'Read More ↓' : 'Show Less ↑';
  }

  function renderBoxes(){
    const grid = document.getElementById('boxGrid');
    if(!grid) return;
    grid.innerHTML = curatedBoxes.map((box, idx) => {
      const lines = box.items.map(bi => {
        const item = findItem(bi.id);
        return item ? {item, qty: bi.qty} : null;
      }).filter(Boolean);
      const total = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
      const listHTML = lines.map(l => `<li>${l.item.name} x${l.qty}</li>`).join('');
      return `
        <div class="box-card">
          <h3>${box.name}</h3>
          <div class="box-price">KSh ${total}</div>
          <ul class="box-list">${listHTML}</ul>
          <p style="font-size:12px;color:#C9B8A9;margin:-6px 0 14px;">${box.desc}</p>
          <button class="box-add-btn" onclick="addBoxToCart(${idx})">Add Box to Cart</button>
        </div>`;
    }).join('');
  }

  function addBoxToCart(idx){
    const box = curatedBoxes[idx];
    box.items.forEach(bi => {
      const item = findItem(bi.id);
      if(!item) return;
      const existingQty = cart[bi.id] ? cart[bi.id].qty : 0;
      cart[bi.id] = {item, qty: existingQty + bi.qty, source: 'box'};
    });
    updateCartUI();
    refreshProductGrids();
    showToast(`${box.name} added to cart`);
    openCart();
  }

  function renderSeasonalBanner(){
    const cfg = CONFIG.SEASONAL_BANNER;
    const el = document.getElementById('seasonalBanner');
    if(!el || !cfg || !cfg.enabled) return; // stays hidden — this is the default, honest state
    el.innerHTML = `<span>${cfg.text}</span><button class="sb-cta" onclick="goSection('${cfg.ctaLink}')">${cfg.ctaText}</button>`;
    el.style.display = 'flex';
  }

  renderBranchTabs();
  renderFresh();
  renderReady();
  renderGroceries();
  renderPlanDuration();
  renderPlannerItems();
  renderPlanSummary();
  renderGallery();
  renderBoxes();
  renderRecipes();
  renderSeasonalBanner();
  applyLanguage(currentLang);
  document.getElementById('footerLogo').src = document.getElementById('navLogo').src;
  updateCartUI(); // ensures cart-dependent UI (e.g. the Reorder button) is correct on first load
  loadProducts(); // fetches products.json and re-renders above with real data, if available
  injectAccountUI(); // optional customer login/order-history — no-ops until API_BASE_URL is set
  injectFloatingBuyNow();
  injectFloatingSocial();
  window.addEventListener('scroll', updateFloatingVisibility, {passive:true});
  window.addEventListener('resize', updateFloatingVisibility, {passive:true});
  updateFloatingVisibility();

  // Scroll reveal
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  }

  // PWA: register service worker. Requires HTTPS (or localhost) — silently does
  // nothing on file:// or plain http, so this is safe to ship before hosting.
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('./sw.js').catch(()=>{
        // Expected on file:// / http — no PWA install prompt until hosted on HTTPS.
      });
    });
  }
