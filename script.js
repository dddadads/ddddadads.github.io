let uploads = JSON.parse(localStorage.getItem('pornUploads')) || [];
let currentUser = localStorage.getItem('currentUser') || null;
let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];

// Фейковый стартовый контент
if (uploads.length === 0) {
    uploads = [
        {id: 1001, title: "Cute Hentai Tease", type: "image", url: "https://picsum.photos/id/1015/800/600", tags: ["hentai", "rule34"], likes: 342, comments: []},
        {id: 1002, title: "Hot Animation Scene", type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", tags: ["hentai", "animation"], likes: 215, comments: []},
        {id: 1003, title: "Furry Rule34 Art", type: "image", url: "https://picsum.photos/id/237/800/600", tags: ["rule34", "furry"], likes: 487, comments: []}
    ];
    localStorage.setItem('pornUploads', JSON.stringify(uploads));
}

function saveData() {
    localStorage.setItem('pornUploads', JSON.stringify(uploads));
}

// ====================== Авторизация ======================
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function handleAuth() {
    let username = document.getElementById('username-input').value.trim();
    if (!username) return alert("Введите имя пользователя!");

    currentUser = username;
    localStorage.setItem('currentUser', username);
    closeAuthModal();
    updateUI();
}

function logout() {
    if (confirm("Выйти из аккаунта?")) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUI();
    }
}

function updateUI() {
    const display = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        display.innerHTML = `👤 <b>${currentUser}</b>`;
        logoutBtn.classList.remove('hidden');
        
        // Показываем админ-панель только для Kostye119
        if (currentUser === "Kostye119") {
            document.getElementById('admin-section').classList.remove('hidden');
        }
    } else {
        display.textContent = "Гость";
        logoutBtn.classList.add('hidden');
        document.getElementById('admin-section').classList.add('hidden');
    }
}

// ====================== Основные функции ======================
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + '-section').classList.remove('hidden');
}

function isImageFile(item) {
    return item.type === 'image' || 
           (item.url && (item.url.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(item.url)));
}

function renderGrid(containerId, filteredItems) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    filteredItems.forEach(item => {
        const isImg = isImageFile(item);

        const cardHTML = `
            <div class="card">
                <a href="video-player.html?id=${item.id}">
                    ${isImg ? 
                        `<img src="${item.url}" alt="${item.title}">` : 
                        `<video src="${item.url}" muted loop></video>`
                    }
                    <div class="info">
                        <h3>${item.title}</h3>
                        <div class="tags">${item.tags ? item.tags.join(" • ") : ""}</div>
                        <div class="likes" onclick="likeItem(${item.id}); event.preventDefault();">❤️ ${item.likes || 0}</div>
                    </div>
                </a>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function likeItem(id) {
    const item = uploads.find(i => i.id === id);
    if (item) {
        item.likes = (item.likes || 0) + 1;
        saveData();
        location.reload();
    }
}

function loadAllData() {
    renderGrid('trending-grid', uploads.slice(0, 8));
    renderGrid('videos-grid', uploads.filter(i => i.type === 'video'));
    renderGrid('photos-grid', uploads.filter(i => isImageFile(i)));
    renderGrid('rule34-grid', uploads.filter(i => 
        i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
    ));
    renderGrid('uploads-grid', uploads);
}

// ====================== Админ ======================
function clearAllData() {
    if (confirm("ВНИМАНИЕ! Очистить ВСЕ данные сайта?")) {
        localStorage.clear();
        location.reload();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadAllData();

    // Поиск
    document.getElementById('search').addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        if (!term) return loadAllData();

        const filtered = uploads.filter(item =>
            item.title.toLowerCase().includes(term) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
        );

        renderGrid('videos-grid', filtered.filter(i => i.type === 'video'));
        renderGrid('photos-grid', filtered.filter(i => isImageFile(i)));
        renderGrid('rule34-grid', filtered.filter(i => 
            i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
        ));
    });
});
