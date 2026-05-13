const SITE = window.FirebaseSiteConfig || {};
const db = window.firebaseDb;

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
    catLead: 'Структура старог WordPress сајта је задржана и претворена у прегледнији систем категорија. Свака категорија може да се мења у админ панелу.',
    worksTitle: 'Радови',
    worksLead: 'Јавни део приказује динамичку галерију из Firebase-а, уз претрагу, филтере, категорије, цене и јасне статусе доступности.',
    aboutTitle: 'О уметнику',
    aboutLead: 'Ова секција је заснована на тону и структури старе почетне странице, али је прилагођена модерном приказу и двојезичности.',
    aboutCardTitle: 'Биографија',
    aboutSecondTitle: 'Шта је ново у односу на стари сајт',
    aboutFeat1: 'Бржа галерија са претрагом, сортирањем и бољим мобилним приказом.',
    aboutFeat2: 'Јасни статуси: доступно, резервисано и продато.',
    aboutFeat3: 'Један админ панел за додавање, измену, брисање, bulk промене, извоз, текстове и категорије.',
    contactTitle: 'Контакт и упит за куповину',
    contactCard1Title: 'Подаци',
    contactEmailLabel: 'Електронска пошта',
    contactArtistLabel: 'Уметник',
    contactPrintsLabel: 'Принтови',
    contactCard2Title: 'Брзи упит',
    contactQuickText: 'Клик на дугме аутоматски отвара mail клијент и припрема упит за конкретан рад.',
    contactQuickBtn: 'Пошаљи општи упит',
    contactAdminBtn: 'Админ панел',
    footerText: '© Никола Гаћеша | модернизована галерија инспирисана старим портфолиом',
    modalTechnique: 'Техника:',
    modalDimensions: 'Димензије:',
    modalYear: 'Година:',
    modalPrint: 'Принт:',
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
    emptyState: 'Тренутно нема радова који одговарају изабраним критеријумима. Ако је ово нов сајт, радови се додају у админ панелу.',
    loading: 'Учитавање радова...',
    loadError: 'Дошло је до грешке при учитавању радова.',
    priceLabel: 'Цена на упит',
    legacyLabel: 'Старо име/текст:',
    filterCategory: 'Филтрирај категорију',
    hiddenCategory: 'Сакривена категорија',
    inquirySubject: title => `Упит за рад: ${title}`,
    inquiryBody: title => `Поштовање,\n\nинтересује ме рад „${title}“. Молим Вас за више информација о цени, доступности и опцији принта на платну.\n\nХвала.`
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
    catLead: 'The former WordPress structure is preserved and converted into a cleaner category system. Each category can be managed in the admin panel.',
    worksTitle: 'Works',
    worksLead: 'The public section displays a dynamic Firebase-powered gallery with search, filters, categories, prices and clear availability statuses.',
    aboutTitle: 'About the artist',
    aboutLead: 'This section follows the tone and structure of the older home page, adapted for a cleaner bilingual presentation.',
    aboutCardTitle: 'Biography',
    aboutSecondTitle: 'What is improved',
    aboutFeat1: 'Faster gallery with search, sorting and much better mobile presentation.',
    aboutFeat2: 'Clear statuses: available, reserved and sold.',
    aboutFeat3: 'One admin panel for adding, editing, deleting, bulk updates, exports, texts and categories.',
    contactTitle: 'Contact and purchase inquiry',
    contactCard1Title: 'Details',
    contactEmailLabel: 'Email',
    contactArtistLabel: 'Artist',
    contactPrintsLabel: 'Prints',
    contactCard2Title: 'Quick inquiry',
    contactQuickText: 'The button opens your email client and prepares an inquiry for the selected work.',
    contactQuickBtn: 'Send general inquiry',
    contactAdminBtn: 'Admin panel',
    footerText: '© Nikola Gacesa | modernized gallery inspired by the original portfolio',
    modalTechnique: 'Technique:',
    modalDimensions: 'Dimensions:',
    modalYear: 'Year:',
    modalPrint: 'Print:',
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
    emptyState: 'There are currently no works matching the selected criteria. If this is a new site, artworks are added in the admin panel.',
    loading: 'Loading artworks...',
    loadError: 'There was an error while loading artworks.',
    priceLabel: 'Price on request',
    legacyLabel: 'Old title/text:',
    filterCategory: 'Filter category',
    hiddenCategory: 'Hidden category',
    inquirySubject: title => `Artwork inquiry: ${title}`,
    inquiryBody: title => `Hello,\n\nI am interested in the work “${title}”. Please send me more information about price, availability and the canvas print option.\n\nThank you.`
  }
};

const state = {
  lang: localStorage.getItem('kete-lang') || 'sr',
  artworks: [],
  filtered: [],
  categories: normalizeCategories(SITE.categories || []),
  siteContent: { ...(SITE.defaultSiteContent || {}) },
  search: '',
  status: 'all',
  category: 'all',
  sort: 'date-desc',
  quickStatus: 'all'
};

const elements = {};

document.addEventListener('DOMContentLoaded', async () => {
  cacheElements();
  bindEvents();
  applyLanguage();
  applySiteContent();
  renderQuickChips();
  renderCategoryCards();

  await loadRemoteSiteConfiguration();
  applyLanguage();
  applySiteContent();
  renderCategoryCards();
  populateCategoryFilter();
  await loadArtworks();
});

function cacheElements() {
  const ids = [
    'searchInput','statusFilter','categoryFilter','sortFilter','quickStatusChips','gallery','galleryInfo','categoryCards',
    'statTotal','statAvailable','statReserved','statSold','artModal','modalImage','modalCategory','modalStatus','modalTitle',
    'modalPrice','modalTechniqueValue','modalDimensionsValue','modalYearValue','modalDescription','modalInquiryBtn','closeModalBtn',
    'genericInquiryBtn','artistEmailLink','artistNameValue','dynamicHeroLead','dynamicAboutText','dynamicPrintsText','dynamicContactLead',
    'dynamicSocialLinks','modalPrintText','contactPrintsText'
  ];
  ids.forEach(id => elements[id] = document.getElementById(id));
}

function bindEvents() {
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.langBtn;
      localStorage.setItem('kete-lang', state.lang);
      applyLanguage();
      applySiteContent();
      renderCategoryCards();
      populateCategoryFilter();
      renderQuickChips();
      applyFilters();
    });
  });

  elements.searchInput?.addEventListener('input', event => {
    state.search = event.target.value.trim().toLowerCase();
    applyFilters();
  });
  elements.statusFilter?.addEventListener('change', event => {
    state.status = event.target.value;
    state.quickStatus = event.target.value;
    renderQuickChips();
    applyFilters();
  });
  elements.categoryFilter?.addEventListener('change', event => {
    state.category = event.target.value;
    applyFilters();
  });
  elements.sortFilter?.addEventListener('change', event => {
    state.sort = event.target.value;
    applyFilters();
  });
  elements.closeModalBtn?.addEventListener('click', closeModal);
  elements.artModal?.addEventListener('click', event => {
    if (event.target === elements.artModal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
  document.querySelectorAll('.topbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.topbar-nav a').forEach(item => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
}

async function loadRemoteSiteConfiguration() {
  if (!db) return;
  await Promise.all([loadRemoteSiteContent(), loadRemoteCategories()]);
}

async function loadRemoteSiteContent() {
  try {
    const doc = await db.collection(SITE.siteSettingsCollectionName || 'siteSettings').doc(SITE.siteSettingsDocumentId || 'main').get();
    if (doc.exists) {
      state.siteContent = { ...state.siteContent, ...cleanObject(doc.data() || {}) };
    }
  } catch (error) {
    console.warn('Site settings loading warning:', error.message);
  }
}

async function loadRemoteCategories() {
  try {
    const snapshot = await db.collection(SITE.categoryCollectionName || 'categories').get();
    const remote = snapshot.docs.map(doc => normalizeCategory({ id: doc.id, ...(doc.data() || {}) })).filter(Boolean);
    if (remote.length) state.categories = normalizeCategories(remote);
  } catch (error) {
    console.warn('Category loading warning:', error.message);
  }
}

function applyLanguage() {
  document.documentElement.lang = state.lang === 'sr' ? 'sr' : 'en';
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.langBtn === state.lang);
  });
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n;
    const value = t(key);
    if (typeof value === 'string') node.innerHTML = value;
  });
  if (elements.searchInput) elements.searchInput.placeholder = t('searchPlaceholder');
  if (elements.statusFilter) {
    elements.statusFilter.innerHTML = [
      `<option value="all">${t('filterAllStatuses')}</option>`,
      `<option value="available">${t('filterAvailable')}</option>`,
      `<option value="reserved">${t('filterReserved')}</option>`,
      `<option value="sold">${t('filterSold')}</option>`
    ].join('');
    elements.statusFilter.value = state.status;
  }
  if (elements.sortFilter) {
    elements.sortFilter.innerHTML = [
      `<option value="date-desc">${t('sortDateDesc')}</option>`,
      `<option value="date-asc">${t('sortDateAsc')}</option>`,
      `<option value="price-asc">${t('sortPriceAsc')}</option>`,
      `<option value="price-desc">${t('sortPriceDesc')}</option>`,
      `<option value="title-asc">${t('sortTitleAsc')}</option>`
    ].join('');
    elements.sortFilter.value = state.sort;
  }
}

function applySiteContent() {
  const content = state.siteContent || {};
  const artistName = content.artistName || SITE.contact?.artistName || 'Никола Гаћеша';
  const nickname = content.nickname || SITE.contact?.nickname || 'Кете';
  const email = content.email || SITE.contact?.email || 'keteart@gmail.com';
  const heroLead = pickLang(content.heroLeadSr, content.heroLeadEn);
  const about = pickLang(content.aboutSr, content.aboutEn);
  const prints = pickLang(content.printsSr, content.printsEn);
  const contactLead = pickLang(content.contactLeadSr, content.contactLeadEn);

  if (elements.dynamicHeroLead) elements.dynamicHeroLead.textContent = heroLead;
  if (elements.dynamicAboutText) elements.dynamicAboutText.textContent = about;
  if (elements.dynamicPrintsText) elements.dynamicPrintsText.textContent = prints;
  if (elements.contactPrintsText) elements.contactPrintsText.textContent = prints;
  if (elements.modalPrintText) elements.modalPrintText.textContent = prints;
  if (elements.dynamicContactLead) elements.dynamicContactLead.textContent = contactLead;
  if (elements.artistNameValue) elements.artistNameValue.textContent = `${artistName} — ${nickname}`;
  if (elements.artistEmailLink) {
    elements.artistEmailLink.href = `mailto:${email}`;
    elements.artistEmailLink.textContent = email;
  }
  if (elements.genericInquiryBtn) {
    elements.genericInquiryBtn.href = buildGeneralInquiryHref();
  }
  renderSocialLinks(content.socialLinks || '');
}

function renderSocialLinks(rawLinks) {
  if (!elements.dynamicSocialLinks) return;
  const links = String(rawLinks || '').split('\n').map(item => item.trim()).filter(Boolean);
  if (!links.length) {
    elements.dynamicSocialLinks.innerHTML = '';
    return;
  }
  elements.dynamicSocialLinks.innerHTML = links.map(link => {
    const safe = escapeHtml(link);
    const href = /^https?:\/\//i.test(link) ? link : `https://${link}`;
    return `<a class="tag" href="${escapeHtml(href)}" target="_blank" rel="noopener">${safe}</a>`;
  }).join('');
}

async function loadArtworks() {
  if (!db) {
    renderError('Firebase није учитан. Проверити firebase-config.js и интернет конекцију.');
    return;
  }
  elements.gallery.innerHTML = `<div class="empty-state">${t('loading')}</div>`;
  try {
    const snapshot = await db.collection(SITE.collectionName || 'artworks').get();
    state.artworks = snapshot.docs.map(doc => normalizeArtwork(doc)).sort((a, b) => b.createdAtMs - a.createdAtMs);
    updateStats();
    populateCategoryFilter();
    applyFilters();
  } catch (error) {
    console.error(error);
    renderError(`${t('loadError')} ${error.message}`);
  }
}

function normalizeArtwork(doc) {
  const data = doc.data() || {};
  const categoryKeys = new Set(state.categories.map(item => item.key));
  return {
    id: doc.id,
    title: data.title || 'Без назива',
    titleEn: data.titleEn || data.title || 'Untitled',
    price: Number.isFinite(Number(data.price)) ? Number(data.price) : null,
    status: ['available','reserved','sold'].includes(data.status) ? data.status : 'available',
    technique: data.technique || '',
    techniqueEn: data.techniqueEn || data.technique || '',
    dimensions: data.dimensions || '',
    year: data.year || '',
    description: data.description || '',
    descriptionEn: data.descriptionEn || data.description || '',
    category: categoryKeys.has(data.category) ? data.category : 'other',
    imageUrl: data.imageUrl || '',
    imagePath: data.imagePath || '',
    createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
    updatedAtMs: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0
  };
}

function normalizeCategories(list) {
  const seen = new Set();
  const normalized = (list || []).map(item => normalizeCategory(item)).filter(Boolean).filter(item => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
  if (!normalized.some(item => item.key === 'other')) {
    normalized.push(normalizeCategory({ key: 'other', sr: 'Остало', en: 'Other', order: 999, visible: true }));
  }
  return normalized.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || a.sr.localeCompare(b.sr, 'sr'));
}

function normalizeCategory(item) {
  if (!item) return null;
  const key = slugify(item.key || item.id || item.sr || item.en || 'other');
  if (!key) return null;
  return {
    id: item.id || key,
    key,
    sr: item.sr || item.nameSr || item.titleSr || key,
    en: item.en || item.nameEn || item.titleEn || item.sr || key,
    descriptionSr: item.descriptionSr || item.description || '',
    descriptionEn: item.descriptionEn || item.descriptionSr || item.description || '',
    legacyTextSr: item.legacyTextSr || '',
    legacyTextEn: item.legacyTextEn || item.legacyTextSr || '',
    order: Number.isFinite(Number(item.order)) ? Number(item.order) : 999,
    visible: item.visible !== false
  };
}

function slugify(value) {
  const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','ђ':'dj','е':'e','ж':'z','з':'z','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ћ':'c','у':'u','ф':'f','х':'h','ц':'c','ч':'c','џ':'dz','ш':'s' };
  return String(value || '').trim().toLowerCase().split('').map(ch => map[ch] || ch).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'other';
}

function t(key, ...args) {
  const table = translations[state.lang] || translations.sr;
  const value = table[key] ?? translations.sr[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

function pickLang(srValue, enValue) {
  return state.lang === 'sr' ? (srValue || enValue || '') : (enValue || srValue || '');
}

function cleanObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== null));
}

function getStatusLabel(status) {
  return STATUS_META[status]?.[state.lang] || STATUS_META.available[state.lang];
}

function getCategoryItem(key) {
  return state.categories.find(item => item.key === key) || state.categories.find(item => item.key === 'other') || { key: 'other', sr: 'Остало', en: 'Other' };
}

function getCategoryLabel(key) {
  const item = getCategoryItem(key);
  return state.lang === 'sr' ? item.sr : item.en;
}

function getPriceLabel(price) {
  return price === null ? t('priceLabel') : `€${price.toLocaleString(state.lang === 'sr' ? 'sr-RS' : 'en-US')}`;
}

function renderCategoryCards() {
  if (!elements.categoryCards) return;
  const visible = state.categories.filter(item => item.visible !== false);
  elements.categoryCards.innerHTML = visible.map(item => {
    const title = state.lang === 'sr' ? item.sr : item.en;
    const desc = pickLang(item.descriptionSr, item.descriptionEn);
    const legacy = pickLang(item.legacyTextSr, item.legacyTextEn);
    return `
      <article class="category-card">
        <h3>${escapeHtml(title)}</h3>
        ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
        ${legacy ? `<p class="small muted"><strong>${escapeHtml(t('legacyLabel'))}</strong> ${escapeHtml(legacy)}</p>` : ''}
        <button class="tag" type="button" data-category-chip="${escapeHtml(item.key)}">${escapeHtml(t('filterCategory'))}</button>
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
  if (!elements.categoryFilter) return;
  const usedCategories = new Set(state.artworks.map(item => item.category));
  const list = state.categories.filter(item => item.visible !== false && (usedCategories.has(item.key) || item.key === 'other'));
  const options = [`<option value="all">${t('filterAllCategories')}</option>`].concat(
    list.map(item => `<option value="${escapeHtml(item.key)}">${escapeHtml(state.lang === 'sr' ? item.sr : item.en)}</option>`)
  );
  elements.categoryFilter.innerHTML = options.join('');
  elements.categoryFilter.value = state.category;
}

function renderQuickChips() {
  if (!elements.quickStatusChips) return;
  const chips = [
    { value: 'all', label: t('chipAll') },
    { value: 'available', label: t('filterAvailable') },
    { value: 'reserved', label: t('filterReserved') },
    { value: 'sold', label: t('filterSold') }
  ];

  elements.quickStatusChips.innerHTML = chips.map(chip => `
    <button type="button" class="filter-chip ${state.quickStatus === chip.value ? 'is-active' : ''}" data-quick-status="${chip.value}">${escapeHtml(chip.label)}</button>
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
  let list = [...state.artworks];
  const visibleCategories = new Set(state.categories.filter(item => item.visible !== false).map(item => item.key));

  list = list.filter(item => visibleCategories.has(item.category));

  if (state.status !== 'all') list = list.filter(item => item.status === state.status);
  if (state.category !== 'all') list = list.filter(item => item.category === state.category);

  if (state.search) {
    list = list.filter(item => {
      const haystack = [
        item.title, item.titleEn, item.description, item.descriptionEn,
        item.technique, item.techniqueEn, item.dimensions, getCategoryLabel(item.category)
      ].join(' ').toLowerCase();
      return haystack.includes(state.search);
    });
  }

  list.sort(sortArtworks);
  state.filtered = list;
  renderGallery();
}

function sortArtworks(a, b) {
  switch (state.sort) {
    case 'date-asc': return a.createdAtMs - b.createdAtMs;
    case 'price-asc': return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
    case 'price-desc': return (b.price ?? -1) - (a.price ?? -1);
    case 'title-asc': return (state.lang === 'sr' ? a.title : a.titleEn).localeCompare(state.lang === 'sr' ? b.title : b.titleEn, state.lang === 'sr' ? 'sr' : 'en');
    case 'date-desc':
    default: return b.createdAtMs - a.createdAtMs;
  }
}

function renderGallery() {
  if (!elements.gallery) return;
  if (!state.filtered.length) {
    elements.gallery.innerHTML = `<div class="empty-state">${t('emptyState')}</div>`;
    updateGalleryInfo();
    return;
  }

  elements.gallery.innerHTML = state.filtered.map(art => {
    const status = STATUS_META[art.status] || STATUS_META.available;
    const title = state.lang === 'sr' ? art.title : art.titleEn;
    const technique = state.lang === 'sr' ? art.technique : art.techniqueEn;
    const description = state.lang === 'sr' ? art.description : art.descriptionEn;
    return `
      <article class="art-card" data-art-id="${escapeHtml(art.id)}">
        <div class="art-media">
          ${art.imageUrl ? `<img src="${escapeHtml(art.imageUrl)}" alt="${escapeHtml(title)}" loading="lazy">` : '<div class="empty-media">Без слике</div>'}
        </div>
        <div class="art-body">
          <div class="art-meta" style="margin-bottom:8px;">
            <span class="badge category">${escapeHtml(getCategoryLabel(art.category))}</span>
            <span class="badge ${status.cls}">${escapeHtml(getStatusLabel(art.status))}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <div class="price">${escapeHtml(getPriceLabel(art.price))}</div>
          <div class="art-meta" style="margin:10px 0 12px;">
            <span>${escapeHtml(technique || '—')}</span>
            <span>•</span>
            <span>${escapeHtml(art.dimensions || '—')}</span>
            ${art.year ? `<span>•</span><span>${escapeHtml(String(art.year))}</span>` : ''}
          </div>
          <p class="muted small">${escapeHtml(truncate(description || '', 120))}</p>
          <div class="inline-actions" style="margin-top:14px;">
            <button type="button" class="btn" data-open-art="${escapeHtml(art.id)}">${state.lang === 'sr' ? 'Детаљи' : 'Details'}</button>
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
  if (!elements.statTotal) return;
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
  elements.modalStatus.className = `badge ${(STATUS_META[art.status] || STATUS_META.available).cls}`;
  elements.modalTitle.textContent = title;
  elements.modalPrice.textContent = getPriceLabel(art.price);
  elements.modalTechniqueValue.textContent = technique || '—';
  elements.modalDimensionsValue.textContent = art.dimensions || '—';
  elements.modalYearValue.textContent = art.year || '—';
  elements.modalDescription.textContent = desc || '';
  elements.modalInquiryBtn.href = buildInquiryHref(art);
  elements.artModal.classList.add('open');
  elements.artModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  elements.artModal.classList.remove('open');
  elements.artModal.setAttribute('aria-hidden', 'true');
}

function buildInquiryHref(art) {
  const title = state.lang === 'sr' ? art.title : art.titleEn;
  const email = state.siteContent.email || SITE.contact?.email || 'keteart@gmail.com';
  const subject = t('inquirySubject', title);
  const body = t('inquiryBody', title);
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildGeneralInquiryHref() {
  const email = state.siteContent.email || SITE.contact?.email || 'keteart@gmail.com';
  const subject = state.lang === 'sr' ? 'Општи упит за уметничко дело' : 'General artwork inquiry';
  const body = state.lang === 'sr'
    ? 'Поштовање,\n\nинтересују ме радови Николе Гаћеше. Молим Вас за више информација о доступним радовима, ценама и принтовима на платну.\n\nХвала.'
    : 'Hello,\n\nI am interested in Nikola Gacesa’s artworks. Please send me more information about available works, prices and canvas prints.\n\nThank you.';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderError(message) {
  if (!elements.gallery) return;
  elements.gallery.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  if (elements.galleryInfo) elements.galleryInfo.textContent = '';
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
