const ADMIN_SITE = window.FirebaseSiteConfig || {};
const adminDb = window.firebaseDb;
const adminStorage = window.firebaseStorage;
const adminAuth = window.firebaseAuth;

const ADMIN_STATUS_META = {
  available: { label: 'Доступно', cls: 'available' },
  reserved: { label: 'Резервисано', cls: 'reserved' },
  sold: { label: 'Продато', cls: 'sold' }
};

const adminState = {
  user: null,
  artworks: [],
  filtered: [],
  categories: normalizeAdminCategories(ADMIN_SITE.categories || []),
  selectedIds: new Set(),
  editingId: null,
  editingCategoryId: null,
  currentImageUrl: '',
  currentImagePath: '',
  selectedFile: null,
  search: '',
  status: 'all',
  category: 'all',
  sort: 'date-desc',
  siteContent: { ...(ADMIN_SITE.defaultSiteContent || {}) }
};

const adminEls = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheAdminElements();
  bindAdminEvents();
  populateAdminCategories();
  fillContentForm(adminState.siteContent);
  renderCategoryList();
  if (adminAuth) {
    adminAuth.onAuthStateChanged(async user => {
      adminState.user = user;
      updateAuthUi();
      if (user) {
        await loadAdminInitialData();
      }
    });
  } else {
    setAuthMessage('Firebase Auth није доступан. Проверити firebase-config.js и Firebase Auth укључење.', 'error');
  }
});

function cacheAdminElements() {
  const ids = [
    'loginEmail','loginPassword','loginBtn','logoutBtn','authMessage','adminSection','categorySection','contentSection',
    'adminGallery','adminSearch','adminStatusFilter','adminCategoryFilter','adminSort','selectionInfo','bulkStatus','applyBulkBtn',
    'exportJsonBtn','exportCsvBtn','listMessage','dropzone','fileInput','previewMedia','fileMeta','artTitle','artTitleEn','artPrice',
    'artYear','artCategory','artStatus','artTechnique','artTechniqueEn','artDimensions','artDescription','artDescriptionEn',
    'saveBtn','resetBtn','cancelEditBtn','formTitle','formMessage','countTotal','countAvailable','countReserved','countSold',
    'categoryFormTitle','categoryKey','categoryOrder','categorySr','categoryEn','categoryDescriptionSr','categoryDescriptionEn',
    'categoryLegacySr','categoryLegacyEn','categoryVisible','saveCategoryBtn','resetCategoryBtn','seedCategoriesBtn','cancelCategoryEditBtn',
    'categoryMessage','categoryList','contentArtistName','contentNickname','contentEmail','contentSiteLabel','contentHeroSr','contentHeroEn',
    'contentAboutSr','contentAboutEn','contentPrintsSr','contentPrintsEn','contentContactLeadSr','contentContactLeadEn',
    'contentSocialLinks','saveContentBtn','reloadContentBtn','contentMessage'
  ];
  ids.forEach(id => adminEls[id] = document.getElementById(id));
}

function bindAdminEvents() {
  adminEls.loginBtn?.addEventListener('click', loginAdmin);
  adminEls.logoutBtn?.addEventListener('click', logoutAdmin);

  adminEls.adminSearch?.addEventListener('input', event => {
    adminState.search = event.target.value.trim().toLowerCase();
    applyAdminFilters();
  });
  adminEls.adminStatusFilter?.addEventListener('change', event => {
    adminState.status = event.target.value;
    applyAdminFilters();
  });
  adminEls.adminCategoryFilter?.addEventListener('change', event => {
    adminState.category = event.target.value;
    applyAdminFilters();
  });
  adminEls.adminSort?.addEventListener('change', event => {
    adminState.sort = event.target.value;
    applyAdminFilters();
  });

  adminEls.saveBtn?.addEventListener('click', saveArtwork);
  adminEls.resetBtn?.addEventListener('click', resetForm);
  adminEls.cancelEditBtn?.addEventListener('click', cancelEdit);
  adminEls.applyBulkBtn?.addEventListener('click', applyBulkStatus);
  adminEls.exportJsonBtn?.addEventListener('click', exportJson);
  adminEls.exportCsvBtn?.addEventListener('click', exportCsv);

  adminEls.dropzone?.addEventListener('click', () => adminEls.fileInput.click());
  adminEls.fileInput?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  });

  ['dragenter','dragover'].forEach(evt => {
    adminEls.dropzone?.addEventListener(evt, event => {
      event.preventDefault();
      adminEls.dropzone.classList.add('dragover');
    });
  });
  ['dragleave','drop'].forEach(evt => {
    adminEls.dropzone?.addEventListener(evt, event => {
      event.preventDefault();
      adminEls.dropzone.classList.remove('dragover');
    });
  });
  adminEls.dropzone?.addEventListener('drop', event => {
    const file = event.dataTransfer?.files?.[0];
    if (file) setSelectedFile(file);
  });

  adminEls.saveCategoryBtn?.addEventListener('click', saveCategory);
  adminEls.resetCategoryBtn?.addEventListener('click', resetCategoryForm);
  adminEls.cancelCategoryEditBtn?.addEventListener('click', resetCategoryForm);
  adminEls.seedCategoriesBtn?.addEventListener('click', seedDefaultCategories);
  adminEls.saveContentBtn?.addEventListener('click', saveSiteContent);
  adminEls.reloadContentBtn?.addEventListener('click', loadSiteContent);
}

async function loadAdminInitialData() {
  await loadCategories();
  await loadSiteContent();
  await loadAdminArtworks();
}

async function loginAdmin() {
  const email = adminEls.loginEmail.value.trim();
  const password = adminEls.loginPassword.value;
  if (!email || !password) {
    setAuthMessage('Унеси email и лозинку.', 'warning');
    return;
  }
  try {
    await adminAuth.signInWithEmailAndPassword(email, password);
    setAuthMessage(`Успешна пријава: ${email}`, 'success');
  } catch (error) {
    setAuthMessage(`Грешка при пријави: ${translateFirebaseError(error)}`, 'error');
  }
}

async function logoutAdmin() {
  if (!adminAuth) return;
  try {
    await adminAuth.signOut();
    setAuthMessage('Успешно си одјављен.', 'success');
  } catch (error) {
    setAuthMessage(`Грешка при одјави: ${translateFirebaseError(error)}`, 'error');
  }
}

function updateAuthUi() {
  const loggedIn = Boolean(adminState.user);
  [adminEls.adminSection, adminEls.categorySection, adminEls.contentSection].forEach(section => section?.classList.toggle('hidden', !loggedIn));
  if (loggedIn) {
    setAuthMessage(`Пријављен: ${adminState.user.email}`, 'success');
  } else {
    setAuthMessage('Ниси пријављен.', 'warning');
    adminEls.adminGallery.innerHTML = '';
    adminEls.listMessage.textContent = 'Пријави се да видиш радове.';
  }
}

function setAuthMessage(text, type = '') {
  adminEls.authMessage.textContent = text;
  adminEls.authMessage.className = `notice ${type}`.trim();
}

function setFormMessage(text, type = '') {
  adminEls.formMessage.textContent = text;
  adminEls.formMessage.className = `notice ${type}`.trim();
}

function setListMessage(text, type = '') {
  adminEls.listMessage.textContent = text;
  adminEls.listMessage.className = `notice ${type}`.trim();
}

function setCategoryMessage(text, type = '') {
  adminEls.categoryMessage.textContent = text;
  adminEls.categoryMessage.className = `notice ${type}`.trim();
}

function setContentMessage(text, type = '') {
  adminEls.contentMessage.textContent = text;
  adminEls.contentMessage.className = `notice ${type}`.trim();
}

async function loadCategories() {
  if (!adminDb || !adminState.user) return;
  try {
    const snapshot = await adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').get();
    const remote = snapshot.docs.map(doc => normalizeAdminCategory({ id: doc.id, ...(doc.data() || {}) })).filter(Boolean);
    if (remote.length) adminState.categories = normalizeAdminCategories(remote);
    populateAdminCategories();
    renderCategoryList();
    setCategoryMessage(remote.length ? `Учитао сам ${remote.length} галерија из Firebase-а.` : 'Користе се основне галерије из фајла. Можеш кликнути „Упиши основне галерије“ да их упишеш у Firebase.', remote.length ? 'success' : 'warning');
  } catch (error) {
    setCategoryMessage(`Грешка при учитавању галерија: ${translateFirebaseError(error)}`, 'error');
  }
}

function populateAdminCategories() {
  const visible = adminState.categories.filter(item => item.visible !== false);
  const options = visible.map(item => `<option value="${escapeAdminHtml(item.key)}">${escapeAdminHtml(item.sr)} / ${escapeAdminHtml(item.en)}</option>`).join('');
  if (adminEls.artCategory) adminEls.artCategory.innerHTML = options;
  if (adminEls.adminCategoryFilter) adminEls.adminCategoryFilter.innerHTML = `<option value="all">Све категорије</option>${options}`;
}

function renderCategoryList() {
  if (!adminEls.categoryList) return;
  if (!adminState.categories.length) {
    adminEls.categoryList.innerHTML = '<div class="empty-state">Нема галерија.</div>';
    return;
  }
  adminEls.categoryList.innerHTML = adminState.categories.map(item => `
    <article class="category-admin-item">
      <div>
        <div class="art-meta">
          <span class="badge category">${escapeAdminHtml(item.key)}</span>
          <span class="badge ${item.visible ? 'available' : 'sold'}">${item.visible ? 'Видљиво' : 'Сакривено'}</span>
          <span class="badge category">Ред: ${escapeAdminHtml(String(item.order))}</span>
        </div>
        <h3>${escapeAdminHtml(item.sr)} / ${escapeAdminHtml(item.en)}</h3>
        <p class="muted small">${escapeAdminHtml(item.descriptionSr || 'Без описа.')}</p>
        ${item.legacyTextSr ? `<p class="muted small"><strong>Стари текст:</strong> ${escapeAdminHtml(item.legacyTextSr)}</p>` : ''}
      </div>
      <div class="card-actions">
        <button type="button" class="btn secondary" data-edit-category="${escapeAdminHtml(item.key)}">Измени</button>
        <button type="button" class="btn secondary" data-toggle-category="${escapeAdminHtml(item.key)}">${item.visible ? 'Сакриј' : 'Прикажи'}</button>
        <button type="button" class="btn danger" data-delete-category="${escapeAdminHtml(item.key)}">Обриши</button>
      </div>
    </article>
  `).join('');

  adminEls.categoryList.querySelectorAll('[data-edit-category]').forEach(btn => btn.addEventListener('click', () => startCategoryEdit(btn.dataset.editCategory)));
  adminEls.categoryList.querySelectorAll('[data-toggle-category]').forEach(btn => btn.addEventListener('click', () => toggleCategoryVisibility(btn.dataset.toggleCategory)));
  adminEls.categoryList.querySelectorAll('[data-delete-category]').forEach(btn => btn.addEventListener('click', () => deleteCategory(btn.dataset.deleteCategory)));
}

async function saveCategory() {
  if (!adminState.user) return setCategoryMessage('Прво се пријави.', 'warning');
  const payload = collectCategoryForm();
  if (!payload.sr) return setCategoryMessage('Назив на српском је обавезан.', 'warning');
  if (!payload.key) payload.key = slugifyAdmin(payload.sr || payload.en);
  const duplicate = adminState.categories.find(item => item.key === payload.key && item.key !== adminState.editingCategoryId);
  if (duplicate) return setCategoryMessage('Већ постоји галерија са тим кључем.', 'warning');

  try {
    const docId = payload.key;
    await adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').doc(docId).set(payload, { merge: true });
    if (adminState.editingCategoryId && adminState.editingCategoryId !== payload.key) {
      await adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').doc(adminState.editingCategoryId).delete();
    }
    resetCategoryForm();
    await loadCategories();
    await loadAdminArtworks();
    setCategoryMessage('Галерија је сачувана.', 'success');
  } catch (error) {
    setCategoryMessage(`Грешка при чувању галерије: ${translateFirebaseError(error)}`, 'error');
  }
}

function collectCategoryForm() {
  return {
    key: slugifyAdmin(adminEls.categoryKey.value.trim()),
    sr: adminEls.categorySr.value.trim(),
    en: adminEls.categoryEn.value.trim() || adminEls.categorySr.value.trim(),
    descriptionSr: adminEls.categoryDescriptionSr.value.trim(),
    descriptionEn: adminEls.categoryDescriptionEn.value.trim() || adminEls.categoryDescriptionSr.value.trim(),
    legacyTextSr: adminEls.categoryLegacySr.value.trim(),
    legacyTextEn: adminEls.categoryLegacyEn.value.trim() || adminEls.categoryLegacySr.value.trim(),
    order: adminEls.categoryOrder.value ? Number(adminEls.categoryOrder.value) : 999,
    visible: adminEls.categoryVisible.checked,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
}

function startCategoryEdit(key) {
  const item = adminState.categories.find(cat => cat.key === key);
  if (!item) return;
  adminState.editingCategoryId = item.key;
  adminEls.categoryFormTitle.textContent = '✏️ Измена галерије';
  adminEls.cancelCategoryEditBtn.classList.remove('hidden');
  adminEls.categoryKey.value = item.key;
  adminEls.categoryOrder.value = item.order;
  adminEls.categorySr.value = item.sr;
  adminEls.categoryEn.value = item.en;
  adminEls.categoryDescriptionSr.value = item.descriptionSr || '';
  adminEls.categoryDescriptionEn.value = item.descriptionEn || '';
  adminEls.categoryLegacySr.value = item.legacyTextSr || '';
  adminEls.categoryLegacyEn.value = item.legacyTextEn || '';
  adminEls.categoryVisible.checked = item.visible !== false;
  setCategoryMessage(`Измена галерије: ${item.sr}`, 'warning');
  adminEls.categorySection.scrollIntoView({ behavior: 'smooth' });
}

function resetCategoryForm() {
  adminState.editingCategoryId = null;
  adminEls.categoryFormTitle.textContent = '➕ Додај галерију';
  adminEls.cancelCategoryEditBtn.classList.add('hidden');
  ['categoryKey','categoryOrder','categorySr','categoryEn','categoryDescriptionSr','categoryDescriptionEn','categoryLegacySr','categoryLegacyEn'].forEach(id => adminEls[id].value = '');
  adminEls.categoryVisible.checked = true;
  setCategoryMessage('Спремно за измену галерија.');
}

async function toggleCategoryVisibility(key) {
  const item = adminState.categories.find(cat => cat.key === key);
  if (!item) return;
  try {
    await adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').doc(key).set({ ...item, visible: !item.visible, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    await loadCategories();
    setCategoryMessage(`Галерија је ${item.visible ? 'сакривена' : 'приказана'}.`, 'success');
  } catch (error) {
    setCategoryMessage(`Грешка при промени видљивости: ${translateFirebaseError(error)}`, 'error');
  }
}

async function deleteCategory(key) {
  if (key === 'other') return setCategoryMessage('Категорија „Остало“ се не брише јер служи као резервна категорија.', 'warning');
  const used = adminState.artworks.some(item => item.category === key);
  const msg = used
    ? 'Ова галерија има радове. Ако је обришеш, ти радови ће прећи у „Остало“. Да ли настављаш?'
    : 'Да ли сигурно бришеш ову галерију?';
  if (!confirm(msg)) return;
  try {
    if (used) {
      const affected = adminState.artworks.filter(item => item.category === key);
      await Promise.all(affected.map(item => adminDb.collection(ADMIN_SITE.collectionName || 'artworks').doc(item.id).update({ category: 'other', updatedAt: firebase.firestore.FieldValue.serverTimestamp() })));
    }
    await adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').doc(key).delete();
    resetCategoryForm();
    await loadCategories();
    await loadAdminArtworks();
    setCategoryMessage('Галерија је обрисана.', 'success');
  } catch (error) {
    setCategoryMessage(`Грешка при брисању галерије: ${translateFirebaseError(error)}`, 'error');
  }
}

async function seedDefaultCategories() {
  if (!adminState.user) return setCategoryMessage('Прво се пријави.', 'warning');
  if (!confirm('Ово ће уписати основне галерије у Firebase и може преписати њихове тренутне вредности. Наставити?')) return;
  try {
    const defaults = normalizeAdminCategories(ADMIN_SITE.categories || []);
    await Promise.all(defaults.map(item => adminDb.collection(ADMIN_SITE.categoryCollectionName || 'categories').doc(item.key).set({ ...item, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })));
    await loadCategories();
    setCategoryMessage('Основне галерије су уписане у Firebase.', 'success');
  } catch (error) {
    setCategoryMessage(`Грешка при упису основних галерија: ${translateFirebaseError(error)}`, 'error');
  }
}

async function loadSiteContent() {
  if (!adminDb || !adminState.user) return;
  try {
    const doc = await adminDb.collection(ADMIN_SITE.siteSettingsCollectionName || 'siteSettings').doc(ADMIN_SITE.siteSettingsDocumentId || 'main').get();
    adminState.siteContent = { ...(ADMIN_SITE.defaultSiteContent || {}), ...(doc.exists ? doc.data() : {}) };
    fillContentForm(adminState.siteContent);
    setContentMessage(doc.exists ? 'Јавни текст је учитан из Firebase-а.' : 'Користи се основни јавни текст из фајла. Кликни „Сачувај јавни текст“ да га упишеш у Firebase.', doc.exists ? 'success' : 'warning');
  } catch (error) {
    setContentMessage(`Грешка при учитавању јавног текста: ${translateFirebaseError(error)}`, 'error');
  }
}

function fillContentForm(content) {
  if (!adminEls.contentArtistName) return;
  adminEls.contentArtistName.value = content.artistName || '';
  adminEls.contentNickname.value = content.nickname || '';
  adminEls.contentEmail.value = content.email || '';
  adminEls.contentSiteLabel.value = content.siteLabel || '';
  adminEls.contentHeroSr.value = content.heroLeadSr || '';
  adminEls.contentHeroEn.value = content.heroLeadEn || '';
  adminEls.contentAboutSr.value = content.aboutSr || '';
  adminEls.contentAboutEn.value = content.aboutEn || '';
  adminEls.contentPrintsSr.value = content.printsSr || '';
  adminEls.contentPrintsEn.value = content.printsEn || '';
  adminEls.contentContactLeadSr.value = content.contactLeadSr || '';
  adminEls.contentContactLeadEn.value = content.contactLeadEn || '';
  adminEls.contentSocialLinks.value = content.socialLinks || '';
}

async function saveSiteContent() {
  if (!adminState.user) return setContentMessage('Прво се пријави.', 'warning');
  const payload = {
    artistName: adminEls.contentArtistName.value.trim(),
    nickname: adminEls.contentNickname.value.trim(),
    email: adminEls.contentEmail.value.trim(),
    siteLabel: adminEls.contentSiteLabel.value.trim(),
    heroLeadSr: adminEls.contentHeroSr.value.trim(),
    heroLeadEn: adminEls.contentHeroEn.value.trim(),
    aboutSr: adminEls.contentAboutSr.value.trim(),
    aboutEn: adminEls.contentAboutEn.value.trim(),
    printsSr: adminEls.contentPrintsSr.value.trim(),
    printsEn: adminEls.contentPrintsEn.value.trim(),
    contactLeadSr: adminEls.contentContactLeadSr.value.trim(),
    contactLeadEn: adminEls.contentContactLeadEn.value.trim(),
    socialLinks: adminEls.contentSocialLinks.value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!payload.email) return setContentMessage('Email је обавезан јер се користи за упите.', 'warning');
  try {
    await adminDb.collection(ADMIN_SITE.siteSettingsCollectionName || 'siteSettings').doc(ADMIN_SITE.siteSettingsDocumentId || 'main').set(payload, { merge: true });
    adminState.siteContent = { ...adminState.siteContent, ...payload };
    setContentMessage('Јавни текст је сачуван. Освежи јавни сајт да видиш измене.', 'success');
  } catch (error) {
    setContentMessage(`Грешка при чувању јавног текста: ${translateFirebaseError(error)}`, 'error');
  }
}

function setSelectedFile(file) {
  if (!file.type.startsWith('image/')) {
    setFormMessage('Изабери слику у JPG, PNG или WEBP формату.', 'warning');
    return;
  }
  adminState.selectedFile = file;
  adminEls.fileMeta.textContent = `${file.name} • ${Math.round(file.size / 1024)} KB`;
  adminEls.fileMeta.className = 'notice success';
  const reader = new FileReader();
  reader.onload = event => {
    adminEls.previewMedia.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

async function loadAdminArtworks() {
  if (!adminDb || !adminState.user) return;
  setListMessage('Учитавање радова...');
  try {
    const snapshot = await adminDb.collection(ADMIN_SITE.collectionName || 'artworks').get();
    adminState.artworks = snapshot.docs.map(doc => normalizeAdminArtwork(doc));
    updateAdminStats();
    applyAdminFilters();
    setListMessage(`Учитао сам ${adminState.artworks.length} радова.`, 'success');
  } catch (error) {
    console.error(error);
    setListMessage(`Грешка при учитавању: ${translateFirebaseError(error)}`, 'error');
  }
}

function normalizeAdminArtwork(doc) {
  const data = doc.data() || {};
  const categoryKeys = new Set(adminState.categories.map(item => item.key));
  return {
    id: doc.id,
    title: data.title || 'Без назива',
    titleEn: data.titleEn || data.title || '',
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

function applyAdminFilters() {
  let list = [...adminState.artworks];
  if (adminState.status !== 'all') list = list.filter(item => item.status === adminState.status);
  if (adminState.category !== 'all') list = list.filter(item => item.category === adminState.category);
  if (adminState.search) {
    list = list.filter(item => [item.title, item.titleEn, item.description, item.descriptionEn, item.technique, item.techniqueEn, item.dimensions, getAdminCategoryLabel(item.category)].join(' ').toLowerCase().includes(adminState.search));
  }
  list.sort((a, b) => {
    switch (adminState.sort) {
      case 'date-asc': return a.createdAtMs - b.createdAtMs;
      case 'price-asc': return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      case 'price-desc': return (b.price ?? -1) - (a.price ?? -1);
      case 'title-asc': return a.title.localeCompare(b.title, 'sr');
      case 'date-desc':
      default: return b.createdAtMs - a.createdAtMs;
    }
  });
  adminState.filtered = list;
  renderAdminGallery();
}

function renderAdminGallery() {
  if (!adminState.filtered.length) {
    adminEls.adminGallery.innerHTML = '<div class="empty-state">Нема радова за приказ.</div>';
    updateSelectionInfo();
    return;
  }

  adminEls.adminGallery.innerHTML = adminState.filtered.map(item => `
    <article class="admin-art-card">
      <div class="checkbox-wrap"><input type="checkbox" data-select-id="${escapeAdminHtml(item.id)}" ${adminState.selectedIds.has(item.id) ? 'checked' : ''}></div>
      <div class="admin-art-media">${item.imageUrl ? `<img src="${escapeAdminHtml(item.imageUrl)}" alt="${escapeAdminHtml(item.title)}">` : '<div class="empty-media">Без слике</div>'}</div>
      <div class="admin-art-body">
        <div class="art-meta" style="margin-bottom:10px;">
          <span class="badge category">${escapeAdminHtml(getAdminCategoryLabel(item.category))}</span>
          <span class="badge ${escapeAdminHtml(item.status)}">${escapeAdminHtml(getAdminStatusLabel(item.status))}</span>
        </div>
        <h3>${escapeAdminHtml(item.title)}</h3>
        <div class="price">${item.price === null ? 'Цена на упит' : `€${escapeAdminHtml(String(item.price))}`}</div>
        <div class="admin-meta" style="margin-top:10px;">
          <span>${escapeAdminHtml(item.technique || '—')}</span>
          <span>•</span>
          <span>${escapeAdminHtml(item.dimensions || '—')}</span>
          ${item.year ? `<span>•</span><span>${escapeAdminHtml(String(item.year))}</span>` : ''}
        </div>
        <p class="muted small">${escapeAdminHtml(truncateAdmin(item.description || '', 100))}</p>
        <div class="card-actions">
          <button type="button" class="btn secondary" data-edit-id="${escapeAdminHtml(item.id)}">Измени</button>
          <button type="button" class="btn secondary" data-status-id="${escapeAdminHtml(item.id)}" data-next-status="available">Доступно</button>
          <button type="button" class="btn secondary" data-status-id="${escapeAdminHtml(item.id)}" data-next-status="reserved">Резерв.</button>
          <button type="button" class="btn secondary" data-status-id="${escapeAdminHtml(item.id)}" data-next-status="sold">Продато</button>
          <button type="button" class="btn danger" data-delete-id="${escapeAdminHtml(item.id)}">Обриши</button>
        </div>
      </div>
    </article>
  `).join('');

  adminEls.adminGallery.querySelectorAll('[data-select-id]').forEach(box => {
    box.addEventListener('change', () => {
      const id = box.dataset.selectId;
      if (box.checked) adminState.selectedIds.add(id);
      else adminState.selectedIds.delete(id);
      updateSelectionInfo();
    });
  });
  adminEls.adminGallery.querySelectorAll('[data-edit-id]').forEach(btn => btn.addEventListener('click', () => startEdit(btn.dataset.editId)));
  adminEls.adminGallery.querySelectorAll('[data-delete-id]').forEach(btn => btn.addEventListener('click', () => deleteArtwork(btn.dataset.deleteId)));
  adminEls.adminGallery.querySelectorAll('[data-status-id]').forEach(btn => btn.addEventListener('click', () => quickStatus(btn.dataset.statusId, btn.dataset.nextStatus)));
  updateSelectionInfo();
}

function updateSelectionInfo() {
  adminEls.selectionInfo.textContent = `Изабрано: ${adminState.selectedIds.size}`;
}

function updateAdminStats() {
  adminEls.countTotal.textContent = String(adminState.artworks.length);
  adminEls.countAvailable.textContent = String(adminState.artworks.filter(item => item.status === 'available').length);
  adminEls.countReserved.textContent = String(adminState.artworks.filter(item => item.status === 'reserved').length);
  adminEls.countSold.textContent = String(adminState.artworks.filter(item => item.status === 'sold').length);
}

async function saveArtwork() {
  if (!adminState.user) return setFormMessage('Прво се пријави.', 'warning');
  const payload = collectFormData();
  if (!payload.title) return setFormMessage('Назив на српском је обавезан.', 'warning');
  if (!adminState.editingId && !adminState.selectedFile) return setFormMessage('За нови рад мораш изабрати слику.', 'warning');
  setFormMessage(adminState.editingId ? 'Ажурирам рад...' : 'Отпремам и чувам рад...');

  try {
    let imageUrl = adminState.currentImageUrl;
    let imagePath = adminState.currentImagePath;
    if (adminState.selectedFile) {
      const uploadResult = await uploadSelectedImage(adminState.selectedFile);
      imageUrl = uploadResult.imageUrl;
      imagePath = uploadResult.imagePath;
    }
    const docData = { ...payload, imageUrl, imagePath, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    if (adminState.editingId) {
      await adminDb.collection(ADMIN_SITE.collectionName || 'artworks').doc(adminState.editingId).update(docData);
      setFormMessage('Рад је успешно ажуриран.', 'success');
    } else {
      await adminDb.collection(ADMIN_SITE.collectionName || 'artworks').add({ ...docData, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormMessage('Нови рад је успешно сачуван.', 'success');
    }
    resetForm();
    await loadAdminArtworks();
  } catch (error) {
    console.error(error);
    setFormMessage(`Грешка: ${translateFirebaseError(error)}`, 'error');
  }
}

function collectFormData() {
  return {
    title: adminEls.artTitle.value.trim(),
    titleEn: adminEls.artTitleEn.value.trim() || adminEls.artTitle.value.trim(),
    price: adminEls.artPrice.value === '' ? null : Number(adminEls.artPrice.value),
    year: adminEls.artYear.value ? Number(adminEls.artYear.value) : '',
    category: adminEls.artCategory.value || 'other',
    status: adminEls.artStatus.value || 'available',
    technique: adminEls.artTechnique.value.trim(),
    techniqueEn: adminEls.artTechniqueEn.value.trim() || adminEls.artTechnique.value.trim(),
    dimensions: adminEls.artDimensions.value.trim(),
    description: adminEls.artDescription.value.trim(),
    descriptionEn: adminEls.artDescriptionEn.value.trim() || adminEls.artDescription.value.trim()
  };
}

async function uploadSelectedImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const imagePath = `artworks/${Date.now()}_${safeName}`;
  const ref = adminStorage.ref(imagePath);
  const snapshot = await ref.put(file);
  const imageUrl = await snapshot.ref.getDownloadURL();
  return { imageUrl, imagePath };
}

function startEdit(id) {
  const item = adminState.artworks.find(art => art.id === id);
  if (!item) return;
  adminState.editingId = item.id;
  adminState.currentImageUrl = item.imageUrl;
  adminState.currentImagePath = item.imagePath;
  adminState.selectedFile = null;
  adminEls.fileInput.value = '';
  adminEls.formTitle.textContent = '✏️ Измена рада';
  adminEls.cancelEditBtn.classList.remove('hidden');
  adminEls.artTitle.value = item.title;
  adminEls.artTitleEn.value = item.titleEn;
  adminEls.artPrice.value = item.price ?? '';
  adminEls.artYear.value = item.year || '';
  adminEls.artCategory.value = item.category;
  adminEls.artStatus.value = item.status;
  adminEls.artTechnique.value = item.technique;
  adminEls.artTechniqueEn.value = item.techniqueEn;
  adminEls.artDimensions.value = item.dimensions;
  adminEls.artDescription.value = item.description;
  adminEls.artDescriptionEn.value = item.descriptionEn;
  adminEls.previewMedia.innerHTML = item.imageUrl ? `<img src="${escapeAdminHtml(item.imageUrl)}" alt="${escapeAdminHtml(item.title)}">` : '';
  adminEls.fileMeta.textContent = item.imageUrl ? 'Користи се постојећа слика. Изабери нову само ако желиш замену.' : 'Овај рад нема уписану слику.';
  adminEls.fileMeta.className = 'notice';
  setFormMessage(`Измена рада: ${item.title}`, 'warning');
  adminEls.adminSection.scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  resetForm();
  setFormMessage('Измена је отказана.', 'warning');
}

function resetForm() {
  adminState.editingId = null;
  adminState.currentImageUrl = '';
  adminState.currentImagePath = '';
  adminState.selectedFile = null;
  adminEls.formTitle.textContent = '📤 Додај нови рад';
  adminEls.cancelEditBtn.classList.add('hidden');
  adminEls.fileInput.value = '';
  adminEls.previewMedia.innerHTML = '';
  adminEls.fileMeta.textContent = 'Није изабрана нова слика.';
  adminEls.fileMeta.className = 'notice';
  ['artTitle','artTitleEn','artPrice','artYear','artTechnique','artTechniqueEn','artDimensions','artDescription','artDescriptionEn'].forEach(id => adminEls[id].value = '');
  adminEls.artCategory.value = adminState.categories.find(item => item.visible !== false)?.key || 'other';
  adminEls.artStatus.value = 'available';
}

async function quickStatus(id, nextStatus) {
  try {
    await adminDb.collection(ADMIN_SITE.collectionName || 'artworks').doc(id).update({ status: nextStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    await loadAdminArtworks();
    setListMessage(`Статус је промењен у: ${getAdminStatusLabel(nextStatus)}.`, 'success');
  } catch (error) {
    setListMessage(`Грешка при промени статуса: ${translateFirebaseError(error)}`, 'error');
  }
}

async function deleteArtwork(id) {
  const item = adminState.artworks.find(art => art.id === id);
  if (!item) return;
  if (!confirm(`Да ли сигурно желиш да обришеш рад „${item.title}“?`)) return;
  try {
    await adminDb.collection(ADMIN_SITE.collectionName || 'artworks').doc(id).delete();
    if (item.imagePath) {
      try {
        await adminStorage.ref(item.imagePath).delete();
      } catch (storageError) {
        console.warn('Storage delete warning:', storageError.message);
      }
    }
    adminState.selectedIds.delete(id);
    await loadAdminArtworks();
    setListMessage(`Обрисан рад: ${item.title}`, 'success');
  } catch (error) {
    setListMessage(`Грешка при брисању: ${translateFirebaseError(error)}`, 'error');
  }
}

async function applyBulkStatus() {
  if (!adminState.selectedIds.size) return setListMessage('Изабери бар један рад за bulk промену.', 'warning');
  const nextStatus = adminEls.bulkStatus.value;
  const selected = Array.from(adminState.selectedIds);
  try {
    await Promise.all(selected.map(id => adminDb.collection(ADMIN_SITE.collectionName || 'artworks').doc(id).update({ status: nextStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })));
    adminState.selectedIds.clear();
    await loadAdminArtworks();
    setListMessage(`Bulk промена је завршена: ${getAdminStatusLabel(nextStatus)}.`, 'success');
  } catch (error) {
    setListMessage(`Грешка при bulk промени: ${translateFirebaseError(error)}`, 'error');
  }
}

function exportJson() {
  const data = adminState.filtered.map(stripInternalFields);
  downloadBlob(JSON.stringify(data, null, 2), 'nikola-gacesa-artworks.json', 'application/json');
  setListMessage('JSON извоз је припремљен.', 'success');
}

function exportCsv() {
  const rows = adminState.filtered.map(stripInternalFields);
  const headers = ['title','titleEn','price','status','category','technique','techniqueEn','dimensions','year','description','descriptionEn','imageUrl'];
  const csv = [headers.join(',')].concat(rows.map(row => headers.map(header => csvEscape(row[header])).join(','))).join('\n');
  downloadBlob(csv, 'nikola-gacesa-artworks.csv', 'text/csv;charset=utf-8;');
  setListMessage('CSV извоз је припремљен.', 'success');
}

function stripInternalFields(item) {
  return {
    title: item.title,
    titleEn: item.titleEn,
    price: item.price,
    status: item.status,
    category: item.category,
    technique: item.technique,
    techniqueEn: item.techniqueEn,
    dimensions: item.dimensions,
    year: item.year,
    description: item.description,
    descriptionEn: item.descriptionEn,
    imageUrl: item.imageUrl
  };
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function getAdminCategoryLabel(key) {
  const item = adminState.categories.find(cat => cat.key === key);
  return item ? item.sr : 'Остало';
}

function getAdminStatusLabel(status) {
  return ADMIN_STATUS_META[status]?.label || 'Доступно';
}

function normalizeAdminCategories(list) {
  const seen = new Set();
  const normalized = (list || []).map(item => normalizeAdminCategory(item)).filter(Boolean).filter(item => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
  if (!normalized.some(item => item.key === 'other')) normalized.push(normalizeAdminCategory({ key: 'other', sr: 'Остало', en: 'Other', order: 999, visible: true }));
  return normalized.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || a.sr.localeCompare(b.sr, 'sr'));
}

function normalizeAdminCategory(item) {
  if (!item) return null;
  const key = slugifyAdmin(item.key || item.id || item.sr || item.en || 'other');
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

function slugifyAdmin(value) {
  const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','ђ':'dj','е':'e','ж':'z','з':'z','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ћ':'c','у':'u','ф':'f','х':'h','ц':'c','ч':'c','џ':'dz','ш':'s' };
  return String(value || '').trim().toLowerCase().split('').map(ch => map[ch] || ch).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function translateFirebaseError(error) {
  const message = error?.message || String(error);
  if (message.includes('permission-denied')) return 'немаш дозволу у Firebase rules или ниси пријављен правим налогом';
  if (message.includes('auth/invalid-login-credentials')) return 'погрешан email или лозинка';
  if (message.includes('auth/user-not-found')) return 'не постоји корисник са тим email-ом';
  if (message.includes('auth/wrong-password')) return 'погрешна лозинка';
  return message;
}

function truncateAdmin(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

function escapeAdminHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
