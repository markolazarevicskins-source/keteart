// Подаци о уметничким делима
let artworks = [
    {
        id: 1,
        title: "Морски пејзаж",
        image: "🌊",
        price: 500,
        status: "available",
        technique: "Уље на платну",
        dimensions: "80x100cm",
        year: 2023,
        description: "Прелеп приказ заласка сунца над морем"
    },
    {
        id: 2,
        title: "Портрет жене",
        image: "👩",
        price: 750,
        status: "reserved",
        technique: "Акрил на платну",
        dimensions: "60x80cm",
        year: 2024,
        description: "Модеран портрет у пастелним тоновима"
    },
    {
        id: 3,
        title: "Апстракција",
        image: "🎨",
        price: 300,
        status: "sold",
        technique: "Комбинована техника",
        dimensions: "50x50cm",
        year: 2023,
        description: "Апстрактна композиција"
    },
    {
        id: 4,
        title: "Цвеће у вази",
        image: "🌻",
        price: 200,
        status: "available",
        technique: "Акварел",
        dimensions: "40x50cm",
        year: 2024,
        description: "Букет сунцокрета"
    },
    {
        id: 5,
        title: "Стари град",
        image: "🏛",
        price: 450,
        status: "available",
        technique: "Уље на платну",
        dimensions: "70x90cm",
        year: 2023,
        description: "Мотиви старог града"
    }
];

// Функција за приказ галерије
function displayGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    artworks.forEach(art => {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.onclick = () => showArtDetails(art.id);
        
        let statusClass = '';
        let statusText = '';
        
        switch(art.status) {
            case 'available':
                statusClass = 'status-available';
                statusText = '🟢 ДОСТУПНО';
                break;
            case 'reserved':
                statusClass = 'status-reserved';
                statusText = '🟡 РЕЗЕРВИСАНО';
                break;
            case 'sold':
                statusClass = 'status-sold';
                statusText = '🔴 ПРОДАТО';
                break;
        }

        card.innerHTML = `
            <div class="art-image">${art.image}</div>
            <div class="art-info">
                <h3 class="art-title">${art.title}</h3>
                <div class="art-price">€${art.price}</div>
                <div class="art-status ${statusClass}">${statusText}</div>
                <div class="art-details">
                    <p>📐 ${art.dimensions}</p>
                    <p>🖌 ${art.technique}</p>
                    <p>📅 ${art.year}.</p>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// Филтрирање
function filterArt(status) {
    if (status === 'sve') {
        displayGallery();
        return;
    }
    
    const filtered = artworks.filter(art => art.status === status);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    filtered.forEach(art => {
        // Сличан код као у displayGallery
        const card = document.createElement('div');
        card.className = 'art-card';
        card.innerHTML = `<div class="art-image">${art.image}</div>
            <div class="art-info">
                <h3>${art.title}</h3>
                <p>€${art.price}</p>
            </div>`;
        gallery.appendChild(card);
    });
}

// Сортирање по цени
function sortByPrice() {
    artworks.sort((a, b) => a.price - b.price);
    displayGallery();
}

// Сортирање по датуму
function sortByDate() {
    artworks.sort((a, b) => b.year - a.year);
    displayGallery();
}

// Приказ детаља
function showArtDetails(id) {
    const art = artworks.find(a => a.id === id);
    if (art) {
        alert(`
            🎨 ${art.title}
            📝 ${art.description}
            💰 Цена: €${art.price}
            📐 Димензије: ${art.dimensions}
            🖌 Техника: ${art.technique}
            📅 Година: ${art.year}
            🏷 Статус: ${art.status}
        `);
    }
}

// Функције за администратора
function addArtwork() {
    const title = prompt('Унесите назив дела:');
    if (!title) return;
    
    const price = prompt('Унесите цену у €:');
    if (!price) return;
    
    const newArt = {
        id: artworks.length + 1,
        title: title,
        image: "🎨",
        price: parseFloat(price),
        status: "available",
        technique: "Непознато",
        dimensions: "Непознато",
        year: new Date().getFullYear(),
        description: "Ново дело"
    };
    
    artworks.push(newArt);
    displayGallery();
    alert('✅ Дело успешно додато!');
}

// Иницијализација
window.onload = function() {
    displayGallery();
};