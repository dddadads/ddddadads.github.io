// ==================== ДАННЫЕ ====================
let uploads = JSON.parse(localStorage.getItem('pornUploads')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// ==================== АВТОРИЗАЦИЯ ====================
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
    updateUserPanel();
}

function logout() {
    if (confirm("Выйти из аккаунта?")) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserPanel();
    }
}

function updateUserPanel() {
    const display = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');

    if (currentUser) {
        display.textContent = currentUser;
        logoutBtn.classList.remove('hidden');
        
        // Показываем админку только для Kostye119
        if (currentUser === "Kostye119") {
            adminLink.style.display = 'inline';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        display.textContent = "Гость";
        logoutBtn.classList.add('hidden');
        adminLink.style.display = 'none';
    }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + '-section').classList.remove('hidden');
}

// Точное определение фото/видео
function isImage(item) {
    if (!item || !item.url) return false;
    if (item.type === 'image') return true;
    if (item.url.startsWith('data:image')) return true;
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item.url)) return true;
    return false;
}

function renderGrid(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <a href="video-player.html?id=${item.id}">
                ${isImage(item) ? 
                    `<img src="${item.url}" alt="${item.title}">` : 
                    `<video src="${item.url}" muted loop></video>`
                }
                <div class="info">
                    <h3>${item.title}</h3>
                    <div class="tags">${item.tags ? item.tags.join(' • ') : ''}</div>
                    <div class="likes" onclick="likeItem(${item.id}); event.preventDefault();">❤️ ${item.likes || 0}</div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

function likeItem(id) {
    const item = uploads.find(i => i.id === id);
    if (item) {
        item.likes = (item.likes || 0) + 1;
        localStorage.setItem('pornUploads', JSON.stringify(uploads));
        location.reload();
    }
}

function loadData() {
    const allUploads = uploads;

    renderGrid('trending-grid', allUploads.slice(0, 8));
    renderGrid('videos-grid', allUploads.filter(i => i.type === 'video'));
    renderGrid('photos-grid', allUploads.filter(i => isImage(i)));
    renderGrid('rule34-grid', allUploads.filter(i => 
        i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
    ));
    renderGrid('uploads-grid', allUploads);
    renderGrid('channels-grid', []); // пока пусто, можно потом добавить
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', () => {
    updateUserPanel();
    loadData();

    // Поиск
    document.getElementById('search').addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        if (!term) return loadData();

        const filtered = uploads.filter(item =>
            item.title.toLowerCase().includes(term) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
        );

        renderGrid('videos-grid', filtered.filter(i => i.type === 'video'));
        renderGrid('photos-grid', filtered.filter(i => isImage(i)));
        renderGrid('rule34-grid', filtered.filter(i => 
            i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
        ));
    });
});
