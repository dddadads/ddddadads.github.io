// ==================== ДАННЫЕ ====================
let uploads = JSON.parse(localStorage.getItem('pornUploads')) || [];
let users = JSON.parse(localStorage.getItem('pornUsers')) || {};
let currentUser = localStorage.getItem('currentUser') || null;

// ==================== АВТОРИЗАЦИЯ ====================
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    switchTab(1); // открываем вкладку "Вход" по умолчанию
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function switchTab(tab) {
    if (tab === 1) {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('tab-login').classList.remove('active');
        document.getElementById('tab-register').classList.add('active');
    }
}

// Регистрация
function registerUser() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    if (!username || !password) {
        alert("Заполните все поля!");
        return;
    }
    if (password !== password2) {
        alert("Пароли не совпадают!");
        return;
    }
    if (users[username]) {
        alert("Пользователь с таким именем уже существует!");
        return;
    }

    users[username] = {
        password: password,
        registered: new Date().toISOString()
    };

    localStorage.setItem('pornUsers', JSON.stringify(users));
    alert("✅ Регистрация успешна! Теперь войдите.");
    switchTab(1);
}

// Вход
function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert("Введите имя пользователя и пароль!");
        return;
    }

    if (!users[username]) {
        alert("Пользователь не найден!");
        return;
    }

    if (users[username].password !== password) {
        alert("Неверный пароль!");
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', username);
    closeAuthModal();
    updateUserPanel();
    alert(`Добро пожаловать, ${username}!`);
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
        adminLink.style.display = (currentUser === "Kostye119") ? 'inline' : 'none';
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

    if (items.length === 0) {
        container.innerHTML = '<p style="color:#888; grid-column: 1 / -1; text-align:center; padding:40px;">Пока ничего нет</p>';
        return;
    }

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
    renderGrid('trending-grid', uploads.slice(0, 8));
    renderGrid('videos-grid', uploads.filter(i => i.type === 'video'));
    renderGrid('photos-grid', uploads.filter(i => isImage(i)));
    renderGrid('rule34-grid', uploads.filter(i => 
        i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
    ));
    renderGrid('uploads-grid', uploads);
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
