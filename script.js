let uploads = JSON.parse(localStorage.getItem('pornUploads')) || [];

// Показать нужную секцию
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + '-section').classList.remove('hidden');
}

// Переход на страницу загрузки
function goToUpload() {
    window.location.href = 'upload.html';
}

// Отрисовка карточек
function renderGrid(containerId, items, isVideo = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <a href="video-player.html?id=${item.id}" style="text-decoration: none; color: inherit;">
                ${isVideo ? 
                    `<video src="${item.url}" muted loop></video>` : 
                    `<img src="${item.url}" alt="${item.title}">`
                }
                <div class="info">
                    <h3>${item.title}</h3>
                    <div class="tags">${item.tags ? item.tags.join(' • ') : ''}</div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

// Загрузка данных при открытии страницы
function loadData() {
    // Пока показываем только пользовательские загрузки
    renderGrid('trending', uploads.slice(0, 6), true);
    renderGrid('videos-grid', uploads.filter(i => i.type === 'video'), true);
    renderGrid('photos-grid', uploads.filter(i => i.type === 'image'));
    renderGrid('rule34-grid', uploads.filter(i => i.tags && i.tags.some(t => 
        t.toLowerCase().includes('hentai') || t.toLowerCase().includes('rule34') || t.toLowerCase().includes('anime')
    )));
    renderGrid('uploads-grid', uploads);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Поиск
    document.getElementById('search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = uploads.filter(item => 
            item.title.toLowerCase().includes(term) || 
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
        );
        renderGrid('videos-grid', filtered.filter(i => i.type === 'video'), true);
        renderGrid('photos-grid', filtered.filter(i => i.type === 'image'));
    });
});