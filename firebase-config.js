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
  categoryCollectionName: 'categories',
  siteSettingsCollectionName: 'siteSettings',
  siteSettingsDocumentId: 'main',
  categories: [
    {
      key: 'old-works',
      sr: 'Стари радови',
      en: 'Old Works',
      order: 10,
      visible: true,
      descriptionSr: 'Архива старијих циклуса и радова који су чинили окосницу старог портфолија.',
      descriptionEn: 'Archive of older cycles and works that formed the core of the original portfolio.',
      legacyTextSr: 'Море, Пејзаж, Интерњет, Прва победа на Вимблдону, Рудник, Водитељка.',
      legacyTextEn: 'Sea, Landscape, Internet, First Wimbledon Victory, Mine, TV presenter.'
    },
    {
      key: 'new-drawings-paintings',
      sr: 'Нови цртежи и слике',
      en: 'New Drawings & Paintings',
      order: 20,
      visible: true,
      descriptionSr: 'Новији радови, слике и цртежи представљени као савремени наставак опуса.',
      descriptionEn: 'Recent drawings and paintings presented as a contemporary continuation of the opus.',
      legacyTextSr: 'Нова група радова из старог WordPress распореда.',
      legacyTextEn: 'New group of works from the older WordPress layout.'
    },
    {
      key: 'faces',
      sr: 'Лица',
      en: 'Faces',
      order: 30,
      visible: true,
      descriptionSr: 'Портрети и ликови, са нагласком на карактер и израз.',
      descriptionEn: 'Portraits and faces with emphasis on character and expression.',
      legacyTextSr: 'Татјана, Аутопортрет, Тесла, Тед, Ирена, Џереми, Винсент, Џереми Ајронс као Ван Гог.',
      legacyTextEn: 'Tatjana, Self-portrait, Tesla, Ted, Irena, Jeremy, Vincent, Jeremy Irons as Van Gogh.'
    },
    {
      key: 'ink',
      sr: 'Туш',
      en: 'Ink',
      order: 40,
      visible: true,
      descriptionSr: 'Туш, линија и црно-бела дисциплина цртежа.',
      descriptionEn: 'Ink works focused on line, contrast and monochrome discipline.',
      legacyTextSr: 'Дизниленд, Коњ, Ноте, Ноте 2.',
      legacyTextEn: 'Disneyland, Horse, Notes, Notes 2.'
    },
    {
      key: 'ballpoint-pen',
      sr: 'Хемијска оловка',
      en: 'Ballpoint Pen',
      order: 50,
      visible: true,
      descriptionSr: 'Радови у хемијској оловци, прецизни и стрпљиво грађени.',
      descriptionEn: 'Ballpoint pen works built through precision and patience.',
      legacyTextSr: 'Алисон Лохман, Маша Милеуснић, Де Ниро, Макса, Мики, Роберт, Ајронс, Анштајн, Гери Олдман.',
      legacyTextEn: 'Alison Lohman, Maša Mileusnić, De Niro, Maksa, Miki, Robert, Irons, Einstein, Gary Oldman.'
    },
    {
      key: 'graphics',
      sr: 'Графике',
      en: 'Graphics',
      order: 60,
      visible: true,
      descriptionSr: 'Графички радови и отисци, са јасном ауторском естетиком.',
      descriptionEn: 'Graphic works and prints shaped by a distinct authorial aesthetic.',
      legacyTextSr: 'Графике – Graphics art.',
      legacyTextEn: 'Graphics art.'
    },
    {
      key: 'sculptures',
      sr: 'Вајарство',
      en: 'Sculptures',
      order: 70,
      visible: true,
      descriptionSr: 'Вајарски радови и тродимензионалне форме.',
      descriptionEn: 'Sculptural works and three-dimensional forms.',
      legacyTextSr: 'Глава – The head, Танатос – Thanatos.',
      legacyTextEn: 'The head, Thanatos.'
    },
    {
      key: 'photographs',
      sr: 'Фотографије',
      en: 'Photographs',
      order: 80,
      visible: true,
      descriptionSr: 'Фотографије као део ширег визуелног архива.',
      descriptionEn: 'Photographs as part of a broader visual archive.',
      legacyTextSr: 'Невреме, Трг, Јерусалим, Атеље, Храм Блаженог Василија, Дом војске, Топ, Поставка.',
      legacyTextEn: 'Storm, Square, Jerusalem, Studio, St. Basil Cathedral, Army House, Cannon, Exhibition setup.'
    },
    {
      key: 'drawings',
      sr: 'Цртежи',
      en: 'Drawings',
      order: 90,
      visible: true,
      descriptionSr: 'Цртежи као темељ уметничког израза и рукописа.',
      descriptionEn: 'Drawings as the foundation of artistic expression and signature.',
      legacyTextSr: 'Професор Марко, Модел, Печат, Ханибал, Џереми Ајронс као Ван Гог, Де Ниро, Вук Глава, Гитара.',
      legacyTextEn: 'Professor Marko, Model, Seal, Hannibal, Jeremy Irons as Van Gogh, De Niro, Wolf Head, Guitar.'
    },
    {
      key: 'other',
      sr: 'Остало',
      en: 'Other',
      order: 999,
      visible: true,
      descriptionSr: 'Радови који још нису сврстани у једну од главних категорија.',
      descriptionEn: 'Works not yet placed into one of the main categories.',
      legacyTextSr: 'Додатна категорија за нове или неспецификоване радове.',
      legacyTextEn: 'Additional category for new or unspecified works.'
    }
  ],
  defaultSiteContent: {
    artistName: 'Никола Гаћеша',
    nickname: 'Кете',
    email: 'keteart@gmail.com',
    siteLabel: 'nikolagacesa.rs',
    heroLeadSr: 'Моје име је Никола Гаћеша, надимак Кете. Рођен сам 1982. године у Србији. Академски сам сликар, ако је то уопште важно. Овај нови сајт задржава дух старог портфолија, али додаје модерну галерију, категорије, цене, статусе доступности и директан контакт за куповину.',
    heroLeadEn: 'My name is Nikola Gacesa, nickname Kete. I was born in 1982 in Serbia. I am an academic painter, if that matters at all. This new site preserves the spirit of the old portfolio while adding a modern gallery, categories, prices, availability statuses and direct purchase contact.',
    aboutSr: 'Ово је јавни уметнички каталог Николе Гаћеше – Кетеа. Посетилац може да прегледа радове по категоријама, да види да ли је рад доступан, резервисан или продат, и да пошаље упит за оригинал или принт.',
    aboutEn: 'This is the public art catalogue of Nikola Gacesa – Kete. Visitors can browse works by category, see whether a work is available, reserved or sold, and send an inquiry for an original or print.',
    printsSr: 'СВИ РАДОВИ СУ ДОСТУПНИ У ВИДУ ПРИНТА НА ПЛАТНУ. За оригинале, цене, резервације и принтове најбоље је послати директан упит.',
    printsEn: 'ALL WORKS ARE AVAILABLE AS CANVAS PRINTS. For originals, prices, reservations and prints, it is best to send a direct inquiry.',
    contactLeadSr: 'Контакт страница старог сајта је задржана као важан део новог сајта: име уметника, надимак, email, друштвене мреже и напомена о принтовима.',
    contactLeadEn: 'The old contact page is preserved as an important part of the new site: artist name, nickname, email, social links and the canvas print note.',
    socialLinks: ''
  },
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
