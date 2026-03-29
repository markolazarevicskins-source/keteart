const ADMIN_SITE = window.FirebaseSiteConfig;
const adminDb = window.firebaseDb;
const adminStorage = window.firebaseStorage;
const adminAuth = window.firebaseAuth;

const adminState = {
  user: null,
  artworks: [],
  filtered: [],
  selectedIds: new Set(),
  editingId: null,
  currentImageUrl: '',
  currentImagePath: '',
  selectedFile: null,
  search: '',
  status: 'all',
  category: 'all',
  sort: 'date-desc'
};

const adminEls = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheAdminElements();
  populateAdminCategories();
  bindAdminEvents();
  if (adminAuth) {
    adminAuth.onAuthStateChanged(user => {
      adminState.user = user;
      updateAuthUi();
      if (user) loadAdminArtworks();
    });
  } else {
    setAuthMessage('Firebase auth није доступан.', 'error');
  }
});

function cacheAdminElements() {
  const ids = [
    'loginEmail','loginPassword','loginBtn','logoutBtn','authMessage','adminSection','adminGallery','adminSearch',
    'adminStatusFilter','adminCategoryFilter','adminSort','selectionInfo','bulkStatus','applyBulkBtn','exportJsonBtn',
    'exportCsvBtn','listMessage','dropzone','fileInput','previewMedia','fileMeta','artTitle','artTitleEn','artPrice',
    'artYear','artCategory','artStatus','artTechnique','artTechniqueEn','artDimensions','artDescription','artDescriptionEn',
    'saveBtn','resetBtn','cancelEditBtn','formTitle','formMessage','countTotal','countAvailable','countReserved','countSold'
  ];
  ids.forEach(id => adminEls[id] = document.getElementById(id));
}

function bindAdminEvents() {
  adminEls.loginBtn.addEventListener('click', loginAdmin);
  adminEls.logoutBtn.addEventListener('click', logoutAdmin);

  adminEls.adminSearch.addEventListener('input', event => {
    adminState.search = event.target.value.trim().toLowerCase();
    applyAdminFilters();
  });
  adminEls.adminStatusFilter.addEventListener('change', event => {
    adminState.status = event.target.value;
    applyAdminFilters();
  });
  adminEls.adminCategoryFilter.addEventListener('change', event => {
    adminState.category = event.target.value;
    applyAdminFilters();
  });
  adminEls.adminSort.addEventListener('change', event => {
    adminState.sort = event.target.value;
    applyAdminFilters();
  });

  adminEls.saveBtn.addEventListener('click', saveArtwork);
  adminEls.resetBtn.addEventListener('click', resetForm);
  adminEls.cancelEditBtn.addEventListener('click', cancelEdit);
  adminEls.applyBulkBtn.addEventListener('click', applyBulkStatus);
  adminEls.exportJsonBtn.addEventListener('click', exportJson);
  adminEls.exportCsvBtn.addEventListener('click', exportCsv);

  adminEls.dropzone.addEventListener('click', () => adminEls.fileInput.click());
  adminEls.fileInput.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  });

  ['dragenter','dragover'].forEach(evt => {
    adminEls.dropzone.addEventListener(evt, event => {
      event.preventDefault();
      adminEls.dropzone.classList.add('dragover');
    });
  });
  ['dragleave','drop'].forEach(evt => {
    adminEls.dropzone.addEventListener(evt, event => {
      event.preventDefault();
      adminEls.dropzone.classList.remove('dragover');
    });
  });
  adminEls.dropzone.addEventListener('drop', event => {
    const file = event.dataTransfer?.files?.[0];
    if (file) setSelectedFile(file);
  });
}

function populateAdminCategories() {
  const options = ADMIN_SITE.categories.map(item => `<option value="${item.key}">${item.sr} / ${item.en}</option>`).join('');
  adminEls.artCategory.innerHTML = options;
  adminEls.adminCategoryFilter.innerHTML = `<option value="all">Све категорије</option>${options}`;
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
    setAuthMessage(`Грешка при пријави: ${error.message}`, 'error');
  }
}

async function logoutAdmin() {
  if (!adminAuth) return;
  try {
    await adminAuth.signOut();
    setAuthMessage('Успешно си одјављен.', 'success');
  } catch (error) {
    setAuthMessage(`Грешка при одјави: ${error.message}`, 'error');
  }
}

function updateAuthUi() {
  const loggedIn = Boolean(adminState.user);
  adminEls.adminSection.classList.toggle('hidden', !loggedIn);
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

function setSelectedFile(file) {
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
    const snapshot = await adminDb.collection(ADMIN_SITE.collectionName).orderBy('createdAt', 'desc').get();
    adminState.artworks = snapshot.docs.map(doc => normalizeAdminArtwork(doc));
    updateAdminStats();
    applyAdminFilters();
    setListMessage(`Учитао сам ${adminState.artworks.length} радова.`, 'success');
  } catch (error) {
    console.error(error);
    setListMessage(`Грешка при учитавању: ${error.message}`, 'error');
  }
}

function normalizeAdminArtwork(doc) {
  const data = doc.data() || {};
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
    category: ADMIN_SITE.categories.some(item => item.key === data.category) ? data.category : 'other',
    imageUrl: data.imageUrl || '',
    imagePath: data.imagePath || '',
    createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0
  };
}

function applyAdminFilters() {
  let list = [...adminState.artworks];
  if (adminState.status !== 'all') list = list.filter(item => item.status === adminState.status);
  if (adminState.category !== 'all') list = list.filter(item => item.category === adminState.category);
  if (adminState.search) {
    list = list.filter(item => [item.title, item.titleEn, item.description, item.descriptionEn, item.technique, item.techniqueEn, item.dimensions].join(' ').toLowerCase().includes(adminState.search));
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
      <div class="checkbox-wrap"><input type="checkbox" data-select-id="${item.id}" ${adminState.selectedIds.has(item.id) ? 'checked' : ''}></div>
      <div class="admin-art-media">${item.imageUrl ? `<img src="${escapeAdminHtml(item.imageUrl)}" alt="${escapeAdminHtml(item.title)}">` : ''}</div>
      <div class="admin-art-body">
        <div class="art-meta" style="margin-bottom:10px;">
          <span class="badge category">${escapeAdminHtml(getAdminCategoryLabel(item.category))}</span>
          <span class="badge ${item.status}">${escapeAdminHtml(getAdminStatusLabel(item.status))}</span>
        </div>
        <h3>${escapeAdminHtml(item.title)}</h3>
        <div class="price">${item.price === null ? 'Цена на упит' : `€${item.price}`}</div>
        <div class="admin-meta" style="margin-top:10px;">
          <span>${escapeAdminHtml(item.technique || '—')}</span>
          <span>•</span>
          <span>${escapeAdminHtml(item.dimensions || '—')}</span>
          ${item.year ? `<span>•</span><span>${escapeAdminHtml(String(item.year))}</span>` : ''}
        </div>
        <p class="muted small">${escapeAdminHtml(truncateAdmin(item.description || '', 100))}</p>
        <div class="card-actions">
          <button type="button" class="btn secondary" data-edit-id="${item.id}">Измени</button>
          <button type="button" class="btn secondary" data-status-id="${item.id}" data-next-status="available">Доступно</button>
          <button type="button" class="btn secondary" data-status-id="${item.id}" data-next-status="reserved">Резерв.</button>
          <button type="button" class="btn secondary" data-status-id="${item.id}" data-next-status="sold">Продато</button>
          <button type="button" class="btn danger" data-delete-id="${item.id}">Обриши</button>
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
  if (!adminState.user) {
    setFormMessage('Прво се пријави.', 'warning');
    return;
  }

  const payload = collectFormData();
  if (!payload.title) {
    setFormMessage('Назив на српском је обавезан.', 'warning');
    return;
  }

  if (!adminState.editingId && !adminState.selectedFile) {
    setFormMessage('За нови рад мораш изабрати слику.', 'warning');
    return;
  }

  setFormMessage(adminState.editingId ? 'Ажурирам рад...' : 'Отпремам и чувам рад...');

  try {
    let imageUrl = adminState.currentImageUrl;
    let imagePath = adminState.currentImagePath;

    if (adminState.selectedFile) {
      const uploadResult = await uploadSelectedImage(adminState.selectedFile);
      imageUrl = uploadResult.imageUrl;
      imagePath = uploadResult.imagePath;
    }

    const docData = {
      ...payload,
      imageUrl,
      imagePath,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (adminState.editingId) {
      await adminDb.collection(ADMIN_SITE.collectionName).doc(adminState.editingId).update(docData);
      setFormMessage('Рад је успешно ажуриран.', 'success');
    } else {
      await adminDb.collection(ADMIN_SITE.collectionName).add({
        ...docData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      setFormMessage('Нови рад је успешно сачуван.', 'success');
    }

    resetForm();
    await loadAdminArtworks();
  } catch (error) {
    console.error(error);
    setFormMessage(`Грешка: ${error.message}`, 'error');
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

  ['artTitle','artTitleEn','artPrice','artYear','artTechnique','artTechniqueEn','artDimensions','artDescription','artDescriptionEn'].forEach(id => {
    adminEls[id].value = '';
  });
  adminEls.artCategory.value = 'old-works';
  adminEls.artStatus.value = 'available';
}

async function quickStatus(id, nextStatus) {
  try {
    await adminDb.collection(ADMIN_SITE.collectionName).doc(id).update({
      status: nextStatus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await loadAdminArtworks();
    setListMessage(`Статус је промењен у: ${getAdminStatusLabel(nextStatus)}.`, 'success');
  } catch (error) {
    setListMessage(`Грешка при промени статуса: ${error.message}`, 'error');
  }
}

async function deleteArtwork(id) {
  const item = adminState.artworks.find(art => art.id === id);
  if (!item) return;
  const ok = confirm(`Да ли сигурно желиш да обришеш рад „${item.title}“?`);
  if (!ok) return;

  try {
    await adminDb.collection(ADMIN_SITE.collectionName).doc(id).delete();
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
    setListMessage(`Грешка при брисању: ${error.message}`, 'error');
  }
}

async function applyBulkStatus() {
  if (!adminState.selectedIds.size) {
    setListMessage('Изабери бар један рад за bulk промену.', 'warning');
    return;
  }
  const nextStatus = adminEls.bulkStatus.value;
  const selected = Array.from(adminState.selectedIds);
  try {
    await Promise.all(selected.map(id => adminDb.collection(ADMIN_SITE.collectionName).doc(id).update({
      status: nextStatus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })));
    adminState.selectedIds.clear();
    await loadAdminArtworks();
    setListMessage(`Bulk промена је завршена: ${getAdminStatusLabel(nextStatus)}.`, 'success');
  } catch (error) {
    setListMessage(`Грешка при bulk промени: ${error.message}`, 'error');
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
  const item = ADMIN_SITE.categories.find(cat => cat.key === key) || ADMIN_SITE.categories.find(cat => cat.key === 'other');
  return item ? `${item.sr} / ${item.en}` : key;
}

function getAdminStatusLabel(status) {
  return {
    available: 'Доступно',
    reserved: 'Резервисано',
    sold: 'Продато'
  }[status] || 'Доступно';
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
