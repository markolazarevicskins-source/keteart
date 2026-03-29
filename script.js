const SITE = window.FirebaseSiteConfig;
const db = window.firebaseDb;

const CATEGORY_LOOKUP = new Map((SITE?.categories || []).map(item => [item.key, item]));
const STATUS_META = {
  available: { sr: 'Доступно', en: 'Available', cls: 'available' },
  reserved: { sr: 'Резервисано', en: 'Reserved', cls: 'reserved' },
  sold: { sr: 'Продато', en: 'Sold', cls: 'sold' }
};

const translations = {
  sr: {
    brandTitle: 'Никола Гаћеша',
    brandSubtitle: 'уметничка галерија | Kete Art',
    navHome: 'Почетна',
    navWorks: 'Радови',
    navCategories: 'Категорије',
    navAbout: 'О уметнику',
    navContact: 'Контакт',
    eyebrow: 'портфолио + продаја + архивa радова',
    heroTitle: 'Никола Гаћеша<br>Кете',
    heroLead: 'Академски сликар из Србије. Сајт спаја атмосферу старог портфолија са модерном галеријом, прегледом радова, категоријама и директним упитом за куповину.',
    heroPrimary: 'Погледај радове',
    heroSecondary: 'Контакт / куповина',
    heroPanelTitle: 'Основа старог сајта — сада у модернијем облику',
    heroPoint1Title: 'Биографија',
    heroPoint1Text: 'Кратак ауторски увод и представљање уметника.',
    heroPoint2Title: 'Радови по категоријама',
    heroPoint2Text: 'Стари радови, нови цртежи и слике, лица, туш, хемијска оловка, графике, вајарство, фотографије и цртежи.',
    heroPoint3Title: 'Контакт и принтови',
    heroPoint3Text: 'Упит за оригинал и напомена да су радови доступни и као принтови на платну.',
    statsTitle: 'Брз преглед галерије',
    statsLead: 'Бројеви се учитавају директно из Firebase колекције, тако да јавни део и админ увек гледају исте податке.',
    statTotal: 'Укупно радова',
    statAvailable: 'Доступно',
    statReserved: 'Резервисано',
    statSold: 'Продато',
    catTitle: 'Категорије из старог сајта',
    catLead: 'Структура старог WordPress сајта је задржана и претворена у прегледнији систем категорија. Сваки нови рад из админа може одмах да се веже за одговарајућу категорију.',
    worksTitle: 'Радови',
    worksLead: 'Јавни део сад приказује динамичку галерију из Firebase-а, уз претрагу, филтере, категорије и јасне статусе доступности.',
    aboutTitle: 'О уметнику',
    aboutLead: 'Ова секција је заснована на тону и структури старе почетне странице, али је прилагођена модерном приказу и двојезичности.',
    aboutCardTitle: 'Биографија',
    aboutBio1: 'Моје име је Никола Гаћеша, надимак Кете. Рођен сам 1982. године у Србији.',
    aboutBio2: 'Академски сам сликар и имам више самосталних и групних изложби.',
    aboutBio3: 'Овде је спојен класичан портфолио и функционалан јавни каталог за преглед, упит и продају.',
    aboutSecondTitle: 'Шта је ново у односу на стари сајт',
    aboutFeat1: 'Бржа галерија са претрагом, сортирањем и бољим мобилним приказом.',
    aboutFeat2: 'Јасни статуси: доступно, резервисано и продато.',
    aboutFeat3: 'Један админ панел за додавање, измену, брисање, bulk промене и извоз података.',
    contactTitle: 'Контакт и упит за куповину',
    contactLead: 'Стара контакт страница је била задржана као важан део сајта. Овде је претворена у јаснији, продајно употребљив блок.',
    contactCard1Title: 'Подаци',
    contactEmailLabel: 'Електронска пошта',
    contactArtistLabel: 'Уметник',
    contactPrintsLabel: 'Принтови',
    contactPrintsText: 'Сви радови могу бити понуђени и као принт на платну.',
    contactCard2Title: 'Брзи упит',
    contactQuickText: 'Клик на дугме аутоматски отвара mail клијент и припрема упит за конкретан рад.',
    contactQuickBtn: 'Пошаљи општи упит',
    contactAdminBtn: 'Админ панел',
    footerText: '© Никола Гаћеша | модернизована галерија инспирисана старим портфолиом',
    modalTechnique: 'Техника:',
    modalDimensions: 'Димензије:',
    modalYear: 'Година:',
    modalPrint: 'Принт:',
    modalPrintValue: 'Доступан и као принт на платну',
    modalInquiry: 'Пошаљи упит за овај рад',
    modalContact: 'Контакт',
    searchPlaceholder: 'Претражи по називу, техници, опису...',
    filterAllStatuses: 'Сви статуси',
    filterAvailable: 'Доступно',
    filterReserved: 'Резервисано',
    filterSold: 'Продато',
    filterAllCategories: 'Све категорије',
    sortDateDesc: 'Најновије прво',
    sortDateAsc: 'Најстарије прво',
    sortPriceAsc: 'Цена: мања → већа',
    sortPriceDesc: 'Цена: већа → мања',
    sortTitleAsc: 'Назив A → Ш',
    chipAll: 'Све',
    galleryCount: count => `Приказано радова: ${count}`,
    galleryCountFiltered: (count, total) => `Приказано ${count} од ${total} радова`,
    emptyState: 'Тренутно нема радова који одговарају изабраним критеријумима.',
    loading: 'Учитавање радова...',
    loadError: 'Дошло је до грешке при учитавању радова.',
    priceLabel: 'Цена на упит',
    inquirySubject: title => `Упит за рад: ${title}`,
    inquiryBody: title => `Поштовање,%0D%0A%0D%0Aинтересује ме рад „${title}“. Молим Вас за више информација.%0D%0A%0D%0AHвала.`
  },
  en: {
    brandTitle: 'Nikola Gacesa',
    brandSubtitle: 'art gallery | Kete Art',
    navHome: 'Home',
    navWorks: 'Works',
    navCategories: 'Categories',
    navAbout: 'About',
    navContact: 'Contact',
    eyebrow: 'portfolio + sales + archive',
    heroTitle: 'Nikola Gacesa<br>Kete',
    heroLead: 'An academic painter from Serbia. This site preserves the spirit of the older portfolio while adding a modern gallery, categories and direct purchase inquiry.',
    heroPrimary: 'View works',
    heroSecondary: 'Contact / purchase',
    heroPanelTitle: 'The old site structure — redesigned for today',
    heroPoint1Title: 'Biography',
    heroPoint1Text: 'A clear artist introduction and personal presentation.',
    heroPoint2Title: 'Works by category',
    heroPoint2Text: 'Old works, new drawings and paintings, faces, ink, ballpoint pen, graphics, sculptures, photographs and drawings.',
    heroPoint3Title: 'Contact and prints',
    heroPoint3Text: 'Inquiry for originals plus the note that works are also available as canvas prints.',
    statsTitle: 'Quick gallery overview',
    statsLead: 'Numbers load directly from the Firebase collection, so the public gallery and admin always reflect the same data.',
    statTotal: 'Total works',
    statAvailable: 'Available',
    statReserved: 'Reserved',
    statSold: 'Sold',
    catTitle: 'Categories carried over from the old site',
    catLead: 'The former WordPress structure is preserved and translated into a cleaner category system. Every new artwork added in the admin can be assigned immediately.',
    worksTitle: 'Works',
    worksLead: 'The public section now displays a dynamic Firebase-powered gallery with search, filters, categories and clear availability statuses.',
    aboutTitle: 'About the artist',
    aboutLead: 'This section follows the tone and structure of the older home page, adapted for a cleaner bilingual presentation.',
    aboutCardTitle: 'Biography',
    aboutBio1: 'My name is Nikola Gacesa, nickname Kete. I was born in 1982 in Serbia.',
    aboutBio2: 'I am an academic painter with several solo and group exhibitions.',
    aboutBio3: 'This site combines a classic portfolio feeling with a practical public catalogue for browsing, inquiry and sales.',
    aboutSecondTitle: 'What is improved',
    aboutFeat1: 'Faster gallery with search, sorting and much better mobile presentation.',
    aboutFeat2: 'Clear statuses: available, reserved and sold.',
    aboutFeat3: 'One admin panel for adding, editing, deleting, bulk updates and exporting data.',
    contactTitle: 'Contact and purchase inquiry',
    contactLead: 'The older contact page was kept as an essential site element. It is now presented in a cleaner, more practical format.',
    contactCard1Title: 'Details',
    contactEmailLabel: 'Email',
    contactArtistLabel: 'Artist',
    contactPrintsLabel: 'Prints',
    contactPrintsText: 'All works can also be offered as canvas prints.',
    contactCard2Title: 'Quick inquiry',
    contactQuickText: 'The button opens your email client and prepares an inquiry for the selected work.',
    contactQuickBtn: 'Send general inquiry',
    contactAdminBtn: 'Admin panel',
    footerText: '© Nikola Gacesa | modernized gallery inspired by the original portfolio',
    modalTechnique: 'Technique:',
    modalDimensions: 'Dimensions:',
    modalYear: 'Year:',
    modalPrint: 'Print:',
    modalPrintValue: 'Also available as a canvas print',
    modalInquiry: 'Send inquiry for this work',
    modalContact: 'Contact',
    searchPlaceholder: 'Search by title, technique, description...',
    filterAllStatuses: 'All statuses',
    filterAvailable: 'Available',
    filterReserved: 'Reserved',
    filterSold: 'Sold',
    filterAllCategories: 'All categories',
    sortDateDesc: 'Newest first',
    sortDateAsc: 'Oldest first',
    sortPriceAsc: 'Price: low → high',
    sortPriceDesc: 'Price: high → low',
    sortTitleAsc: 'Title A → Z',
    chipAll: 'All',
    galleryCount: count => `Showing works: ${count}`,
    galleryCountFiltered: (count, total) => `Showing ${count} of ${total} works`,
    emptyState: 'There are no works matching the selected criteria right now.',
    loading: 'Loading works...',
    loadError: 'An error occurred while loading the artworks.',
    priceLabel: 'Price on request',
    inquirySubject: title => `Inquiry for artwork: ${title}`,
    inquiryBody: title => `Hello,%0D%0A%0D%0AI am interested in the artwork "${title}". Please send me more information.%0D%0A%0D%0AThank you.`
  }
};

const state = {
  lang: 'sr',
  artworks: [],
  filtered: [],
  search: '',
  status: 'all',
  category: 'all',
  sort: 'date-desc',
  quickStatus: 'all'
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  renderCategoryCards();
  bindEvents();
  applyLanguage();
  renderQuickChips();
  loadArtworks();
});

function cacheElements() {
  elements.searchInput = document.getElementById('searchInput');
  elements.statusFilter = document.getElementById('statusFilter');
  elements.categoryFilter = document.getElementById('categoryFilter');
  elements.sortFilter = document.getElementById('sortFilter');
  elements.gallery = document.getElementById('gallery');
  elements.galleryInfo = document.getElementById('galleryInfo');
  elements.quickStatusChips = document.getElementById('quickStatusChips');
  elements.categoryCards = document.getElementById('categoryCards');
  elements.modal = document.getElementById('artModal');
  elements.modalImage = document.getElementById('modalImage');
  elements.modalCategory = document.getElementById('modalCategory');
  elements.modalStatus = document.getElementById('modalStatus');
  elements.modalTitle = document.getElementById('modalTitle');
  elements.modalPrice = document.getElementById('modalPrice');
  elements.modalTechniqueValue = document.getElementById('modalTechniqueValue');
  elements.modalDimensionsValue = document.getElementById('modalDimensionsValue');
  elements.modalYearValue = document.getElementById('modalYearValue');
  elements.modalDescription = document.getElementById('modalDescription');
  elements.modalInquiryBtn = document.getElementById('modalInquiryBtn');
  elements.closeModalBtn = document.getElementById('closeModalBtn');
  elements.statTotal = document.getElementById('statTotal');
  elements.statAvailable = document.getElementById('statAvailable');
  elements.statReserved = document.getElementById('statReserved');
  elements.statSold = document.getElementById('statSold');
  elements.artistEmailLink = document.getElementById('artistEmailLink');
  elements.artistNameValue = document.getElementById('artistNameValue');
  elements.genericInquiryBtn = document.getElementById('genericInquiryBtn');
}

function bindEvents() {
  elements.searchInput.addEventListener('input', event => {
    state.search = event.target.value.trim().toLowerCase();
    applyFilters();
  });

  elements.statusFilter.addEventListener('change', event => {
    state.status = event.target.value;
    state.quickStatus = event.target.value === 'all' ? 'all' : event.target.value;
    renderQuickChips();
    applyFilters();
  });

  elements.categoryFilter.addEventListener('change', event => {
    state.category = event.target.value;
    applyFilters();
  });

  elements.sortFilter.addEventListener('change', event => {
    state.sort = event.target.value;
    applyFilters();
  });

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.langBtn;
      document.querySelectorAll('[data-lang-btn]').forEach(el => el.classList.toggle('is-active', el === btn));
      applyLanguage();
      renderCategoryCards();
      populateCategoryFilter();
      renderQuickChips();
      renderGallery();
    });
  });

  document.querySelectorAll('.topbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.topbar-nav a').forEach(el => el.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  elements.closeModalBtn.addEventListener('click', closeModal);
  elements.modal.addEventListener('click', event => {
    if (event.target === elements.modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  elements.artistEmailLink.href = `mailto:${SITE.contact.email}`;
  elements.artistEmailLink.textContent = SITE.contact.email;
  elements.artistNameValue.textContent = `${SITE.contact.artistName} — ${SITE.contact.nickname}`;
  elements.genericInquiryBtn.href = `mailto:${SITE.contact.email}?subject=${encodeURIComponent('Inquiry / Upit')}`;
}

function t(key, ...args) {
  const pack = translations[state.lang] || translations.sr;
  const value = pack[key];
  return typeof value === 'function' ? value(...args) : value ?? key;
}

function applyLanguage() {
  document.documentElement.lang = state.lang === 'sr' ? 'sr' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.innerHTML = t(node.dataset.i18n);
  });

  elements.searchInput.placeholder = t('searchPlaceholder');
  rewriteStaticSelectOptions();
  updateGalleryInfo();
}

function rewriteStaticSelectOptions() {
  elements.statusFilter.innerHTML = [
    `<option value="all">${t('filterAllStatuses')}</option>`,
    `<option value="available">${t('filterAvailable')}</option>`,
    `<option value="reserved">${t('filterReserved')}</option>`,
    `<option value="sold">${t('filterSold')}</option>`
  ].join('');
  elements.statusFilter.value = state.status;

  elements.sortFilter.innerHTML = [
    `<option value="date-desc">${t('sortDateDesc')}</option>`,
    `<option value="date-asc">${t('sortDateAsc')}</option>`,
    `<option value="price-asc">${t('sortPriceAsc')}</option>`,
    `<option value="price-desc">${t('sortPriceDesc')}</option>`,
    `<option value="title-asc">${t('sortTitleAsc')}</option>`
  ].join('');
  elements.sortFilter.value = state.sort;
}

async function loadArtworks() {
  if (!db) {
    renderError('Firebase is not initialized.');
    return;
  }

  elements.gallery.innerHTML = `<div class="empty-state">${t('loading')}</div>`;

  try {
    const snapshot = await db.collection(SITE.collectionName).orderBy('createdAt', 'desc').get();
    state.artworks = snapshot.docs.map(doc => normalizeArtwork(doc));
    populateCategoryFilter();
    updateStats();
    applyFilters();
  } catch (error) {
    console.error(error);
    renderError(t('loadError'));
  }
}

function normalizeArtwork(doc) {
  const data = doc.data() || {};
  const category = normalizeCategory(data.category);
  const createdAtMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : 0;
  return {
    id: doc.id,
    title: data.title || 'Без назива',
    titleEn: data.titleEn || data.title || 'Untitled',
    description: data.description || '',
    descriptionEn: data.descriptionEn || data.description || '',
    technique: data.technique || 'Непознато',
    techniqueEn: data.techniqueEn || data.technique || 'Unknown',
    dimensions: data.dimensions || 'Непознато',
    year: data.year || '',
    price: Number.isFinite(Number(data.price)) ? Number(data.price) : null,
    status: STATUS_META[data.status] ? data.status : 'available',
    category,
    imageUrl: data.imageUrl || '',
    createdAtMs,
    imagePath: data.imagePath || ''
  };
}

function normalizeCategory(value) {
  if (!value || !CATEGORY_LOOKUP.has(value)) return 'other';
  return value;
}

function getCategoryLabel(key) {
  const item = CATEGORY_LOOKUP.get(key) || CATEGORY_LOOKUP.get('other');
  return state.lang === 'sr' ? item.sr : item.en;
}

function getStatusLabel(status) {
  return STATUS_META[status]?.[state.lang] || STATUS_META.available[state.lang];
}

function getPriceLabel(price) {
  return price === null ? t('priceLabel') : `€${price.toLocaleString(state.lang === 'sr' ? 'sr-RS' : 'en-US')}`;
}

function renderCategoryCards() {
  if (!elements.categoryCards) return;
  const descriptions = {
    'old-works': {
      sr: 'Архива старијих циклуса и радова који су чинили окосницу старог портфолија.',
      en: 'An archive of older cycles and artworks that formed the core of the original portfolio.'
    },
    'new-drawings-paintings': {
      sr: 'Новији радови, слике и цртежи представљени као савремени наставак опуса.',
      en: 'More recent drawings and paintings presented as a contemporary continuation of the opus.'
    },
    faces: {
      sr: 'Портрети и ликови, са нагласком на карактер и израз.',
      en: 'Portraits and faces with emphasis on character and expression.'
    },
    ink: {
      sr: 'Туш, линија и црно-бела дисциплина цртежа.',
      en: 'Ink works focused on line, contrast and monochrome discipline.'
    },
    'ballpoint-pen': {
      sr: 'Радови у хемијској оловци, прецизни и стрпљиво грађени.',
      en: 'Ballpoint pen works built through precision and patience.'
    },
    graphics: {
      sr: 'Графички радови и отисци, са јасном ауторском естетиком.',
      en: 'Graphic works and prints shaped by a distinct authorial aesthetic.'
    },
    sculptures: {
      sr: 'Вајарски радови и тродимензионалне форме.',
      en: 'Sculptural works and three-dimensional forms.'
    },
    photographs: {
      sr: 'Фотографије као део ширег визуелног архива.',
      en: 'Photographs as part of a broader visual archive.'
    },
    drawings: {
      sr: 'Цртежи као темељ уметничког израза и рукописа.',
      en: 'Drawings as the foundation of artistic expression and signature.'
    },
    other: {
      sr: 'Радови који још нису сврстани у једну од главних старих категорија.',
      en: 'Works not yet placed into one of the main legacy categories.'
    }
  };

  elements.categoryCards.innerHTML = SITE.categories.map(item => {
    const desc = descriptions[item.key]?.[state.lang] || '';
    return `
      <article class="category-card">
        <h3>${state.lang === 'sr' ? item.sr : item.en}</h3>
        <p>${desc}</p>
        <button class="tag" type="button" data-category-chip="${item.key}">${state.lang === 'sr' ? 'Филтрирај категорију' : 'Filter category'}</button>
      </article>
    `;
  }).join('');

  elements.categoryCards.querySelectorAll('[data-category-chip]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.categoryChip;
      populateCategoryFilter();
      applyFilters();
      document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function populateCategoryFilter() {
  const usedCategories = new Set(state.artworks.map(item => item.category));
  const list = SITE.categories.filter(item => item.key === 'other' || usedCategories.has(item.key));
  const options = [`<option value="all">${t('filterAllCategories')}</option>`].concat(
    list.map(item => `<option value="${item.key}">${state.lang === 'sr' ? item.sr : item.en}</option>`)
  );
  elements.categoryFilter.innerHTML = options.join('');
  elements.categoryFilter.value = state.category;
}

function renderQuickChips() {
  const chips = [
    { value: 'all', label: t('chipAll') },
    { value: 'available', label: t('filterAvailable') },
    { value: 'reserved', label: t('filterReserved') },
    { value: 'sold', label: t('filterSold') }
  ];

  elements.quickStatusChips.innerHTML = chips.map(chip => `
    <button type="button" class="filter-chip ${state.quickStatus === chip.value ? 'is-active' : ''}" data-quick-status="${chip.value}">${chip.label}</button>
  `).join('');

  elements.quickStatusChips.querySelectorAll('[data-quick-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.quickStatus = btn.dataset.quickStatus;
      state.status = state.quickStatus;
      elements.statusFilter.value = state.status;
      renderQuickChips();
      applyFilters();
    });
  });
}

function applyFilters() {
  const term = state.search;
  let list = [...state.artworks];

  if (state.status !== 'all') {
    list = list.filter(item => item.status === state.status);
  }

  if (state.category !== 'all') {
    list = list.filter(item => item.category === state.category);
  }

  if (term) {
    list = list.filter(item => {
      const haystack = [
        item.title, item.titleEn, item.description, item.descriptionEn,
        item.technique, item.techniqueEn, item.dimensions,
        getCategoryLabel(item.category)
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }

  list.sort(sortArtworks);
  state.filtered = list;
  renderGallery();
}

function sortArtworks(a, b) {
  switch (state.sort) {
    case 'date-asc':
      return a.createdAtMs - b.createdAtMs;
    case 'price-asc':
      return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
    case 'price-desc':
      return (b.price ?? -1) - (a.price ?? -1);
    case 'title-asc':
      return (state.lang === 'sr' ? a.title : a.titleEn).localeCompare(state.lang === 'sr' ? b.title : b.titleEn, state.lang === 'sr' ? 'sr' : 'en');
    case 'date-desc':
    default:
      return b.createdAtMs - a.createdAtMs;
  }
}

function renderGallery() {
  if (!state.filtered.length) {
    elements.gallery.innerHTML = `<div class="empty-state">${t('emptyState')}</div>`;
    updateGalleryInfo();
    return;
  }

  elements.gallery.innerHTML = state.filtered.map(art => {
    const status = STATUS_META[art.status];
    const title = state.lang === 'sr' ? art.title : art.titleEn;
    const technique = state.lang === 'sr' ? art.technique : art.techniqueEn;
    const description = state.lang === 'sr' ? art.description : art.descriptionEn;
    return `
      <article class="art-card" data-art-id="${art.id}">
        <div class="art-media">
          ${art.imageUrl ? `<img src="${escapeHtml(art.imageUrl)}" alt="${escapeHtml(title)}" loading="lazy">` : ''}
        </div>
        <div class="art-body">
          <div class="art-meta" style="margin-bottom:8px;">
            <span class="badge category">${escapeHtml(getCategoryLabel(art.category))}</span>
            <span class="badge ${status.cls}">${escapeHtml(getStatusLabel(art.status))}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <div class="price">${escapeHtml(getPriceLabel(art.price))}</div>
          <div class="art-meta" style="margin:10px 0 12px;">
            <span>${escapeHtml(technique)}</span>
            <span>•</span>
            <span>${escapeHtml(art.dimensions || '')}</span>
            ${art.year ? `<span>•</span><span>${escapeHtml(String(art.year))}</span>` : ''}
          </div>
          <p class="muted small">${escapeHtml(truncate(description || '', 120))}</p>
          <div class="inline-actions" style="margin-top:14px;">
            <button type="button" class="btn" data-open-art="${art.id}">${state.lang === 'sr' ? 'Детаљи' : 'Details'}</button>
            <a class="btn secondary" href="${buildInquiryHref(art)}">${state.lang === 'sr' ? 'Упит' : 'Inquiry'}</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  elements.gallery.querySelectorAll('[data-open-art]').forEach(btn => {
    btn.addEventListener('click', () => {
      const art = state.artworks.find(item => item.id === btn.dataset.openArt);
      if (art) openModal(art);
    });
  });

  updateGalleryInfo();
}

function updateGalleryInfo() {
  if (!elements.galleryInfo) return;
  const total = state.artworks.length;
  const count = state.filtered.length;
  elements.galleryInfo.textContent = total === count ? t('galleryCount', count) : t('galleryCountFiltered', count, total);
}

function updateStats() {
  elements.statTotal.textContent = String(state.artworks.length);
  elements.statAvailable.textContent = String(state.artworks.filter(item => item.status === 'available').length);
  elements.statReserved.textContent = String(state.artworks.filter(item => item.status === 'reserved').length);
  elements.statSold.textContent = String(state.artworks.filter(item => item.status === 'sold').length);
}

function openModal(art) {
  const title = state.lang === 'sr' ? art.title : art.titleEn;
  const desc = state.lang === 'sr' ? art.description : art.descriptionEn;
  const technique = state.lang === 'sr' ? art.technique : art.techniqueEn;
  elements.modalImage.src = art.imageUrl || '';
  elements.modalImage.alt = title;
  elements.modalCategory.textContent = getCategoryLabel(art.category);
  elements.modalStatus.textContent = getStatusLabel(art.status);
  elements.modalStatus.className = `badge ${STATUS_META[art.status].cls}`;
  elements.modalTitle.textContent = title;
  elements.modalPrice.textContent = getPriceLabel(art.price);
  elements.modalTechniqueValue.textContent = technique;
  elements.modalDimensionsValue.textContent = art.dimensions || '—';
  elements.modalYearValue.textContent = art.year || '—';
  elements.modalDescription.textContent = desc || '';
  elements.modalInquiryBtn.href = buildInquiryHref(art);
  elements.modal.classList.add('open');
  elements.modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  elements.modal.classList.remove('open');
  elements.modal.setAttribute('aria-hidden', 'true');
}

function buildInquiryHref(art) {
  const title = state.lang === 'sr' ? art.title : art.titleEn;
  const subject = t('inquirySubject', title);
  const body = t('inquiryBody', title);
  return `mailto:${SITE.contact.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function renderError(message) {
  elements.gallery.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  elements.galleryInfo.textContent = '';
}

function truncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
