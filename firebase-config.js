window.FirebaseSiteConfig = {
  firebaseConfig: {
    apiKey: "AIzaSyChwoEz9uKhj8FIONC_ms1syqGx_bQkc0A",
    authDomain: "nikola-gacesa-gallery.firebaseapp.com",
    projectId: "nikola-gacesa-gallery",
    storageBucket: "nikola-gacesa-gallery.firebasestorage.app",
    messagingSenderId: "813005317066",
    appId: "1:813005317066:web:41c202273b851e42b16533",
    measurementId: "G-9EZ8P096PK"
  },
  collectionName: 'artworks',
  categories: [
    { key: 'old-works', sr: 'Стари радови', en: 'Old Works' },
    { key: 'new-drawings-paintings', sr: 'Нови цртежи и слике', en: 'New Drawings & Paintings' },
    { key: 'faces', sr: 'Лица', en: 'Faces' },
    { key: 'ink', sr: 'Туш', en: 'Ink' },
    { key: 'ballpoint-pen', sr: 'Хемијска оловка', en: 'Ballpoint Pen' },
    { key: 'graphics', sr: 'Графике', en: 'Graphics' },
    { key: 'sculptures', sr: 'Вајарство', en: 'Sculptures' },
    { key: 'photographs', sr: 'Фотографије', en: 'Photographs' },
    { key: 'drawings', sr: 'Цртежи', en: 'Drawings' },
    { key: 'other', sr: 'Остало', en: 'Other' }
  ],
  contact: {
    artistName: 'Никола Гаћеша',
    nickname: 'Кете',
    email: 'keteart@gmail.com',
    siteLabel: 'nikolagacesa.rs'
  }
};

(function initFirebaseApp() {
  if (!window.firebase || !window.FirebaseSiteConfig) return;
  if (!firebase.apps.length) {
    firebase.initializeApp(window.FirebaseSiteConfig.firebaseConfig);
  }
  window.firebaseDb = firebase.firestore();
  window.firebaseStorage = firebase.storage();
  window.firebaseAuth = firebase.auth ? firebase.auth() : null;
})();
