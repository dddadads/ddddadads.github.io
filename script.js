let uploads = JSON.parse(localStorage.getItem('pornUploads')) || [];

// Фейковый контент при первом запуске
if (uploads.length === 0) {
    uploads = [
        {
            id: 1001,
            title: "Cute anime girl teasing",
            type: "image",
            url: "https://picsum.photos/id/1015/800/600",
            tags: ["hentai", "anime", "rule34"],
            likes: 245,
            comments: []
        },
        {
            id: 1002,
            title: "Passionate hentai scene",
            type: "video",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            tags: ["hentai", "animation", "18+"],
            likes: 189,
            comments: []
        },
        {
            id: 1003,
            title: "Furry rule34 art",
            type: "image",
            url: "https://picsum.photos/id/237/800/600",
            tags: ["rule34", "furry", "anthro"],
            likes: 312,
            comments: []
        }
    ];
    localStorage.setItem('pornUploads', JSON.stringify(uploads));
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + '-section').classList.remove('hidden');
}

function renderGrid(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <a href="video-player.html?id=${item.id}" style="text-decoration: none; color: inherit;">
                ${item.type === 'video' ? 
                    `<video src="${item.url}" muted loop></video>` : 
                    `<img src="${item.url}" alt="${item.title}">`
                }
                <div class="info">
                    <h3>${item.title}</h3>
                    <div class="tags">${item.tags ? item.tags.join(' • ') : ''}</div>
                    <div class="likes" onclick="likeItem(${item.id}); event.stopImmediatePropagation();">
                        ❤️ ${item.likes || 0}
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

function likeItem(id) {
    let data = JSON.parse(localStorage.getItem('pornUploads')) || [];
    const item = data.find(i => i.id === id);
    if (item) {
        item.likes = (item.likes || 0) + 1;
        localStorage.setItem('pornUploads', JSON.stringify(data));
        location.reload();
    }
}

function loadData() {
    const all = uploads;

    renderGrid('trending', all.slice(0, 6));
    renderGrid('videos-grid', all.filter(i => i.type === 'video'));
    renderGrid('photos-grid', all.filter(i => i.type === 'image'));
    renderGrid('rule34-grid', all.filter(i => 
        i.tags && i.tags.some(t => 
            ["rule34", "hentai", "anime", "furry"].some(k => t.toLowerCase().includes(k))
        )
    ));
    renderGrid('uploads-grid', all);
}

// Поиск
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
            loadData();
            return;
        }

        const filtered = uploads.filter(item => 
            item.title.toLowerCase().includes(term) || 
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
        );

        renderGrid('videos-grid', filtered.filter(i => i.type === 'video'));
        renderGrid('photos-grid', filtered.filter(i => i.type === 'image'));
        renderGrid('rule34-grid', filtered.filter(i => 
            i.tags && i.tags.some(t => ["rule34","hentai","anime","furry"].some(k => t.toLowerCase().includes(k)))
        ));
        renderGrid('uploads-grid', filtered);
    });
});
