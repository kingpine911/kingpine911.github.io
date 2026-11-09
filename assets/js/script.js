/* ==========================================================
   JAVASCRIPT — interactions du site, script unique pour toutes les pages.
   Chaque bloc vérifie que ses éléments existent : une page n'utilise
   que les blocs dont elle contient le balisage.
   1. Barre de navigation au défilement        (toutes les pages)
   2. Menu mobile                              (toutes les pages)
   3. Apparitions au défilement                (toutes les pages)
   4. Bulles du hero                           (accueil)
   5. Profondimètre, signature du site         (toutes les pages)
   6. Compteurs animés                         (accueil, le centre)
   7. Carrousel de témoignages                 (accueil)
   7 bis. Bouton WhatsApp flottant effacé sur le contact et le devis
   8. Touche Échap (menu mobile)
   9. Formulaire de contact, envoi via WhatsApp ou la messagerie  (accueil, contact)
   10. Repli en cas d'image indisponible
   11. Diaporama du hero                       (accueil)
   12. Compte à rebours de la promo en cours   (accueil, croisières)
   13. Bulle « démonstration » et cartes d'activités cliquables
   14. Carte illustrée des lieux               (accueil)
   15. Assistant de devis en trois étapes      (accueil, contact)
   16. Onglets                                 (croisières)
   17. Photos des hôtels                       (séjours)
   18. Calendrier des saisons, mois en cours   (infos pratiques)
   ========================================================== */

// Textes générés par le script, dans la langue de la page
const EN = document.documentElement.lang === 'en';
const TXT = EN ? {
  dp: ': ',
  jours: n => ` · ${n} day${n > 1 ? 's' : ''} left`,
  demo: { tarifs: ['Prices coming soon', 'This mock-up is a demo: the full price list will be added on the final website.'],
          rubrique: ['Page in progress', 'This mock-up is a demo: this page will be built for the final website.'],
          planning: ['Travel agents only', 'On the official website, the tour operator schedule is password-protected. This demo does not include it.'] },
  fermer: 'Close',
  flex: 'Flexible dates',
  bonjour: "Hello Oceane's Dream,",
  intro: "I'm planning a trip to Nosy Be and would like a quote.",
  champs: { envie: 'Wish', formule: 'Cruise', niveau: 'Diving level', nb: 'Travellers', periode: 'Period', duree: 'Length of stay', interet: 'Interested in' },
  merci: 'Thank you, speak soon!',
  sujetDevis: 'Quote request',
  sujetContact: 'Information request',
} : {
  dp: ' : ',
  jours: n => ` · J-${n}`,
  demo: { tarifs: ['Tarifs en préparation', 'Cette maquette est une démonstration : la grille de tarifs sera intégrée sur le site final.'],
          rubrique: ['Rubrique en préparation', 'Cette maquette est une démonstration : cette page sera construite sur le site final.'],
          planning: ['Espace réservé aux agences', 'Sur le site officiel, le planning des tour-opérateurs est protégé par un mot de passe. Cette démonstration ne le reprend pas.'] },
  fermer: 'Fermer',
  flex: 'Dates flexibles',
  bonjour: "Bonjour Oceane's Dream,",
  intro: 'Je prépare un voyage à Nosy Be et souhaiterais un devis.',
  champs: { envie: 'Envie', formule: 'Croisière', niveau: 'Niveau de plongée', nb: 'Voyageurs', periode: 'Période', duree: 'Durée', interet: 'Intérêt' },
  merci: 'Merci et à bientôt,',
  sujetDevis: 'Demande de devis',
  sujetContact: "Demande d'information",
};
const WHATSAPP = 'https://wa.me/261320712782';
const EMAIL = 'resa@oceanesdream.com';
const lienWhatsApp = (texte) => WHATSAPP + '?text=' + encodeURIComponent(texte);
const lienMail = (sujet, texte) => 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(texte);

// Listes « Période » : les douze prochains mois, dans la langue de la page
document.querySelectorAll('select[data-mois]').forEach(sel => {
  const d = new Date(); d.setDate(1);
  for (let i = 0; i < 12; i++){
    const m = d.toLocaleDateString(document.documentElement.lang, { month:'long', year:'numeric' });
    sel.add(new Option(m.charAt(0).toUpperCase() + m.slice(1), m));
    d.setMonth(d.getMonth() + 1);
  }
});

// --- 1. Barre de navigation : devient opaque après le hero ---
const nav = document.getElementById('nav');
const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScrollNav, { passive:true });
onScrollNav();

// --- 2. Menu mobile ---
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const toggleMenu = (open) => {
  burger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// --- 3. Apparitions au défilement ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 4. Bulles du hero ---
const bubbles = document.getElementById('bubbles');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && bubbles){
  for (let i = 0; i < 16; i++){
    const b = document.createElement('span');
    const size = 6 + Math.random() * 22;
    b.className = 'bubble';
    b.style.width = b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.animationDuration = (9 + Math.random() * 12) + 's';
    b.style.animationDelay = (Math.random() * 10) + 's';
    bubbles.appendChild(b);
  }
}

// --- 5. Profondimètre : la profondeur affichée suit le défilement (0 m → -40 m) ---
const gauge = document.getElementById('depthGauge');
const depthFill = document.getElementById('depthFill');
const depthValue = document.getElementById('depthValue');
const darkSections = () => Array.from(document.querySelectorAll('.dark, .hero, .page-hero'));
const updateDepth = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  const depth = Math.round(p * 40);
  depthFill.style.height = (p * 100) + '%';
  depthValue.textContent = '-' + depth + ' m';
  gauge.classList.toggle('on', window.scrollY > 120);
  const midY = window.innerHeight / 2;
  let onDark = false;
  darkSections().forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top < midY && r.bottom > midY) onDark = true;
  });
  gauge.classList.toggle('light', !onDark);
};
window.addEventListener('scroll', updateDepth, { passive:true });
window.addEventListener('resize', updateDepth);
updateDepth();

// --- 6. Compteurs animés des chiffres clés ---
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    // Les années s'affichent sans séparateur de milliers
    const fmt = (n) => target >= 1000 && target < 3000 ? String(n) : new Intl.NumberFormat(document.documentElement.lang).format(n);
    const dur = 1600;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    reduceMotion ? (el.textContent = prefix + fmt(target) + suffix) : requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// --- 7. Carrousel de témoignages ---
const slides = Array.from(document.querySelectorAll('.slide'));
const navWrap = document.getElementById('carouselNav');
let current = 0, autoTimer;
if (navWrap) slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'dot-nav' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Témoignage ' + (i + 1));
  d.addEventListener('click', () => goTo(i, true));
  navWrap.appendChild(d);
});
const dots = navWrap ? Array.from(navWrap.children) : [];
function goTo(i, manual){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  if (manual) restartAuto();
}
function restartAuto(){
  clearInterval(autoTimer);
  if (!reduceMotion) autoTimer = setInterval(() => goTo(current + 1), 7000);
}
if (navWrap){
  document.getElementById('prevSlide').addEventListener('click', () => goTo(current - 1, true));
  document.getElementById('nextSlide').addEventListener('click', () => goTo(current + 1, true));
  restartAuto();
}

// --- 7 bis. Bouton WhatsApp flottant : effacé sur la section contact ---
{
  const fab = document.querySelector('.fab');
  const zones = ['contact', 'devis'].map(id => document.getElementById(id)).filter(Boolean);
  if (fab && zones.length && 'IntersectionObserver' in window){
    const visibles = new Set();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target));
      fab.classList.toggle('fab-hidden', visibles.size > 0);
    }, { threshold: 0.14 });
    zones.forEach(z => obs.observe(z));
  }
}

// --- 8. Touche Échap : fermeture du menu mobile ---
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

// --- 9. Formulaire de contact : le message pré-rempli s'ouvre dans WhatsApp ou la messagerie du visiteur ---
{
  const champ = (id) => document.getElementById(id);
  const envoyer = (canal) => {
    const nom = champ('f-nom'), email = champ('f-email');
    // Le nom est toujours demandé ; l'e-mail seulement pour un envoi par e-mail
    const requis = canal === 'mail' ? [nom, email] : [nom];
    let ok = true;
    [nom, email].forEach(f => f.style.borderColor = '');
    requis.forEach(f => { if (!f.value.trim()){ f.style.borderColor = 'var(--soleil)'; ok = false; } });
    if (email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){
      email.style.borderColor = 'var(--soleil)'; ok = false;
    }
    if (!ok){ requis.find(f => f.style.borderColor)?.focus(); return; }
    const activite = champ('f-activite').value;
    const lignes = [TXT.bonjour, '', champ('f-msg').value.trim(), '',
      `• ${TXT.champs.interet}${TXT.dp}${activite}`, `• ${TXT.champs.periode}${TXT.dp}${champ('f-date').value || TXT.flex}`,
      '', nom.value.trim(), email.value.trim()].filter((l, i, t) => l !== '' || t[i - 1] !== '');
    const texte = lignes.join('\n').trim();
    if (canal === 'mail') location.href = lienMail(TXT.sujetContact + ' · ' + activite, texte);
    else window.open(lienWhatsApp(texte), '_blank', 'noopener');
    champ('formFields').style.display = 'none';
    champ('formSuccess').classList.add('show');
  };
  if (champ('sendWa')){
    champ('sendWa').addEventListener('click', () => envoyer('wa'));
    champ('sendMail').addEventListener('click', () => envoyer('mail'));
    champ('formAgain').addEventListener('click', () => {
      champ('formSuccess').classList.remove('show');
      champ('formFields').style.display = '';
      champ('f-msg').value = '';
    });
  }
}

// --- 10. Repli si une image en ligne est indisponible (dégradé océan) ---
document.querySelectorAll('img[src^="https://images.unsplash"]').forEach(img => {
  img.addEventListener('error', () => {
    const ph = document.createElement('div');
    ph.style.cssText = 'position:absolute;inset:0;background:linear-gradient(150deg,#0c3b63,#1177b8 60%,#3ec3ee);';
    img.replaceWith(ph);
  });
});

// --- 11. Diaporama du hero : fondu automatique, points cliquables, pause au survol de la souris ---
{
  const heroEl = document.querySelector('.hero');
  const heroSlides = Array.from(document.querySelectorAll('#heroSlides .hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('#heroDots button'));
  let heroIndex = 0, heroTimer = null;
  const showSlide = (i) => {
    const next = (i + heroSlides.length) % heroSlides.length;
    if (next === heroIndex) return;
    const prev = heroSlides[heroIndex];
    prev.classList.replace('active', 'leaving');
    setTimeout(() => prev.classList.remove('leaving'), 1800);
    heroSlides[next].classList.add('active');
    heroDots.forEach((d, k) => d.setAttribute('aria-current', k === next));
    heroIndex = next;
  };
  const stopSlides = () => { clearInterval(heroTimer); heroTimer = null; };
  const startSlides = () => { stopSlides(); heroTimer = setInterval(() => showSlide(heroIndex + 1), 6000); };
  if (heroEl && heroSlides.length > 1){
    heroDots.forEach((d, k) => d.addEventListener('click', () => { showSlide(k); startSlides(); }));
    heroEl.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') stopSlides(); });
    heroEl.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') startSlides(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stopSlides() : startSlides());
    startSlides();
  }
}

// --- 12. Compte à rebours de la promo en cours : croisière plongée Mitsio du 12 au 17 décembre 2026 ---
// Départ le 12 décembre 2026 à 0 h, heure de Nosy Be (UTC+3). Passé cette date, les mentions de la promo
// laissent place au texte « prochains départs sur demande ».
// Pour tester un autre jour : ajouter ?date=2026-12-20 à l'adresse de la page.
{
  const DEPART = Date.UTC(2026, 11, 11, 21, 0, 0);
  const simule = new URLSearchParams(location.search).get('date');
  const decalage = simule && !isNaN(Date.parse(simule)) ? Date.parse(simule) - Date.now() : 0;
  const cases = {};
  document.querySelectorAll('[data-cd]').forEach(b => cases[b.dataset.cd] = b);
  const pastilles = document.querySelectorAll('[data-jours]');
  const deux = (n) => String(n).padStart(2, '0');
  let minuteur;
  const maj = () => {
    const reste = DEPART - (Date.now() + decalage);
    if (reste <= 0){
      document.documentElement.classList.add('promo-finie');
      clearInterval(minuteur);
      return;
    }
    const s = Math.floor(reste / 1000);
    if (cases.j){
      cases.j.textContent = Math.floor(s / 86400);
      cases.h.textContent = deux(Math.floor(s / 3600) % 24);
      cases.m.textContent = deux(Math.floor(s / 60) % 60);
      cases.s.textContent = deux(s % 60);
    }
    const jours = Math.ceil(reste / 86400000);
    pastilles.forEach(p => p.textContent = TXT.jours(jours));
  };
  maj();
  minuteur = setInterval(maj, 1000);
}

// --- 13. Bulle « démonstration » et cartes d'activités cliquables ---
{
  let bulle, fermeture;
  const cacher = () => { if (bulle){ bulle.classList.remove('show'); clearTimeout(fermeture); } };
  const montrer = (cible, type) => {
    if (!bulle){
      bulle = document.createElement('div');
      bulle.className = 'demo-bubble';
      bulle.setAttribute('role', 'status');
      bulle.innerHTML = '<span class="e" aria-hidden="true">🐋</span><div><strong class="titre"></strong><span class="texte"></span></div><button type="button">×</button>';
      bulle.querySelector('button').setAttribute('aria-label', TXT.fermer);
      bulle.querySelector('button').addEventListener('click', cacher);
      document.body.appendChild(bulle);
    }
    const [titre, texte] = TXT.demo[type] || TXT.demo.rubrique;
    bulle.querySelector('.titre').textContent = titre;
    bulle.querySelector('.texte').textContent = texte;
    bulle.classList.remove('show', 'dessous');
    // Placement : au-dessus du lien, ou dessous s'il est trop près de la barre de navigation
    const r = cible.getBoundingClientRect();
    const w = bulle.offsetWidth, h = bulle.offsetHeight;
    const largeur = document.documentElement.clientWidth;
    const centre = r.left + r.width / 2;
    const gauche = Math.max(16, Math.min(centre - w / 2, largeur - 16 - w));
    const dessous = r.top - h - 14 < 90;
    bulle.classList.toggle('dessous', dessous);
    bulle.style.left = (gauche + window.scrollX) + 'px';
    bulle.style.top = (window.scrollY + (dessous ? r.bottom + 14 : r.top - h - 14)) + 'px';
    bulle.style.setProperty('--tx', Math.max(20, Math.min(w - 20, centre - gauche)) + 'px');
    requestAnimationFrame(() => bulle.classList.add('show'));
    clearTimeout(fermeture);
    fermeture = setTimeout(cacher, 5000);
  };
  document.addEventListener('click', (e) => {
    const lien = e.target.closest('a[data-demo]');
    if (lien){ e.preventDefault(); montrer(lien, lien.dataset.demo); return; }
    if (bulle && !e.target.closest('.demo-bubble, .card')) cacher();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cacher(); });
  window.addEventListener('resize', cacher);

  // Cartes d'activités : chacune mène à sa page (data-go) ou, à défaut de page, ouvre la bulle (data-demo)
  document.querySelectorAll('.card[role="link"]').forEach(carte => {
    const ouvrir = () => {
      if (carte.dataset.demo) return montrer(carte.querySelector('.card-link') || carte, carte.dataset.demo);
      const vers = carte.dataset.go;
      if (!vers.startsWith('#')){ location.href = vers; return; }
      const cible = document.querySelector(vers);
      if (cible) cible.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    carte.addEventListener('click', ouvrir);
    carte.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ouvrir(); } });
  });
}

// --- 14. Carte illustrée : un lieu choisi sur la carte ou dans la liste affiche sa fiche ---
{
  const section = document.getElementById('carte');
  if (section){
    const choisir = (n) => {
      section.querySelectorAll('.pin').forEach(p => p.classList.toggle('on', p.dataset.lieu === n));
      section.querySelectorAll('.map-places button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lieu === n));
      section.querySelectorAll('.map-info article').forEach(a => a.classList.toggle('on', a.dataset.lieu === n));
    };
    section.querySelectorAll('.pin, .map-places button').forEach(el => {
      el.addEventListener('click', () => choisir(el.dataset.lieu));
      el.addEventListener('mouseenter', () => { if (el.classList.contains('pin')) choisir(el.dataset.lieu); });
    });
    section.querySelectorAll('.pin').forEach(p => p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choisir(p.dataset.lieu); }
    }));
    choisir('1');
  }
}

// --- 15. Assistant de devis : trois étapes, puis message prêt pour WhatsApp ou l'e-mail ---
{
  const quote = document.getElementById('quote');
  if (quote){
    const etat = { envie:'', envieLbl:'', formule:'', niveau:'', duree:'', nb:2 };
    const etapes = Array.from(quote.querySelectorAll('.q-step'));
    const puces = Array.from(quote.querySelectorAll('.quote-steps li'));
    const blocFormule = document.getElementById('qFormule');
    const choixNiveau = quote.querySelector('[data-champ="niveau"]');
    const periode = document.getElementById('qPeriode');
    const prenom = document.getElementById('qPrenom');

    const message = () => {
      const c = TXT.champs;
      const l = [TXT.bonjour, TXT.intro, ''];
      if (etat.envieLbl) l.push(`• ${c.envie}${TXT.dp}${etat.envieLbl}`);
      if (etat.envie === 'croisiere' && etat.formule) l.push(`• ${c.formule}${TXT.dp}${etat.formule}`);
      if (etat.niveau && !choixNiveau.hidden) l.push(`• ${c.niveau}${TXT.dp}${etat.niveau}`);
      l.push(`• ${c.nb}${TXT.dp}${etat.nb}`);
      l.push(`• ${c.periode}${TXT.dp}${periode.value || TXT.flex}`);
      if (etat.duree) l.push(`• ${c.duree}${TXT.dp}${etat.duree}`);
      l.push('', TXT.merci);
      if (prenom.value.trim()) l.push(prenom.value.trim());
      return l.join('\n');
    };
    const majRecap = () => {
      const texte = message();
      document.getElementById('qRecap').textContent = texte;
      document.getElementById('qWa').href = lienWhatsApp(texte);
      document.getElementById('qMail').href = lienMail(TXT.sujetDevis + (etat.envieLbl ? ' · ' + etat.envieLbl : ''), texte);
    };
    const aller = (n) => {
      etapes.forEach((e, i) => e.classList.toggle('on', i === n - 1));
      puces.forEach((p, i) => { p.classList.toggle('on', i === n - 1); p.classList.toggle('fait', i < n - 1); });
      if (n === 3) majRecap();
      // Sur mobile, remonter en haut de l'assistant si l'étape commence hors de l'écran
      const haut = quote.getBoundingClientRect().top;
      if (haut < 0) quote.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    const choisirEnvie = (cle) => {
      const bouton = quote.querySelector(`.q-opt[data-envie="${cle}"]`);
      if (!bouton) return;
      quote.querySelectorAll('.q-opt').forEach(b => b.setAttribute('aria-pressed', b === bouton));
      etat.envie = cle;
      etat.envieLbl = bouton.querySelector('.lbl').textContent;
      blocFormule.hidden = cle !== 'croisiere';
      // Le niveau de plongée n'a pas de sens pour une excursion ou le circuit à terre
      const sansNiveau = cle === 'excursion' || cle === 'diego';
      choixNiveau.hidden = sansNiveau;
      choixNiveau.previousElementSibling.hidden = sansNiveau;
      aller(2);
    };
    quote.querySelectorAll('.q-opt').forEach(b => b.addEventListener('click', () => choisirEnvie(b.dataset.envie)));
    quote.querySelectorAll('[data-aller]').forEach(b => b.addEventListener('click', () => aller(+b.dataset.aller)));
    quote.querySelectorAll('.q-chips').forEach(groupe => groupe.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const deja = b.getAttribute('aria-pressed') === 'true';
      groupe.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', String(!deja));
      etat[groupe.dataset.champ] = deja ? '' : b.textContent;
      majRecap();
    }));
    quote.querySelectorAll('[data-nb]').forEach(b => b.addEventListener('click', () => {
      etat.nb = Math.max(1, Math.min(30, etat.nb + Number(b.dataset.nb)));
      document.getElementById('qNb').textContent = etat.nb;
      majRecap();
    }));
    [periode, prenom].forEach(f => f.addEventListener('input', majRecap));
    blocFormule.hidden = true;

    // Les boutons « Demander » de la page ouvrent l'assistant avec l'envie déjà choisie
    document.querySelectorAll('a[data-devis]').forEach(a => a.addEventListener('click', () => choisirEnvie(a.dataset.devis)));
    // Depuis une autre page, l'envie arrive dans l'adresse : contact.html?envie=croisiere#devis
    const envie = new URLSearchParams(location.search).get('envie');
    if (envie) choisirEnvie(envie);
  }
}

// --- 16. Onglets : un bouton par panneau, et une ancre (#mitsio) ouvre directement le bon onglet ---
document.querySelectorAll('[data-onglets]').forEach(groupe => {
  const boutons = Array.from(groupe.querySelectorAll('[role="tab"]'));
  const panneaux = boutons.map(b => document.getElementById(b.getAttribute('aria-controls')));
  const ouvrir = (i, focus) => {
    boutons.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    panneaux.forEach((p, k) => { p.hidden = k !== i; });
    if (focus) boutons[i].focus();
  };
  boutons.forEach((b, i) => {
    b.addEventListener('click', () => ouvrir(i));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        e.preventDefault();
        ouvrir((i + (e.key === 'ArrowRight' ? 1 : boutons.length - 1)) % boutons.length, true);
      }
    });
  });
  const selonAncre = (defiler) => {
    const i = panneaux.findIndex(p => p && '#' + p.id === location.hash);
    if (i < 0) return false;
    ouvrir(i);
    if (defiler) groupe.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    return true;
  };
  if (!selonAncre(true)) ouvrir(0);
  window.addEventListener('hashchange', () => selonAncre(true));
  // Les liens de la page vers un panneau (#radama, #mitsio…) ouvrent l'onglet correspondant
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
    const i = panneaux.findIndex(p => p && '#' + p.id === a.getAttribute('href'));
    if (i < 0) return;
    e.preventDefault();
    history.replaceState(null, '', a.getAttribute('href'));
    ouvrir(i);
    groupe.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
});

// --- 17. Photos des hôtels : les points sous la photo passent de l'une à l'autre ---
document.querySelectorAll('[data-photos]').forEach(bloc => {
  const photos = Array.from(bloc.querySelectorAll('img'));
  const points = Array.from(bloc.querySelectorAll('.photo-dots button'));
  const montrer = (i) => {
    photos.forEach((p, k) => p.classList.toggle('on', k === i));
    points.forEach((p, k) => p.setAttribute('aria-current', k === i));
  };
  points.forEach((p, i) => p.addEventListener('click', () => montrer(i)));
});

// --- 18. Calendrier des saisons : la colonne du mois en cours est entourée ---
{
  const calendrier = document.getElementById('calendrier');
  if (calendrier){
    const mois = new Date().getMonth();   // 0 = janvier
    calendrier.querySelectorAll('.s-row').forEach(ligne => {
      const cases = ligne.querySelectorAll('b, i');
      if (cases[mois]) cases[mois].classList.add('now');
    });
  }
}
