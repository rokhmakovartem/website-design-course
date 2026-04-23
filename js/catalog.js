// ==========================================
// КАТАЛОГ КУРСІВ — API-версія (Практична №11-12)
// Замінює initCatalogPage з main.js на сторінці courses.html
// ==========================================

// Ця функція викликається з main.js замість старої initCatalogPage,
// якщо catalog.js завантажено (перевірка: typeof initCatalogFromAPI === 'function')
async function initCatalogFromAPI() {
    const container = document.getElementById('catalogContainer');
    if (!container) return; // Не на сторінці каталогу — виходимо

    // Ініціалізуємо модальне вікно підтвердження
    initConfirmModal();

    // --- Стан каталогу ---
    const state = {
        page: 1,
        limit: 6,
        q: '',
        category: 'all',
        sort: 'featured',
        order: 'desc',
        total: 0
    };

    // --- Б1: Відновлення стану фільтрів з URL ---
    function readStateFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('q'))        state.q        = params.get('q');
        if (params.has('category')) state.category  = params.get('category');
        if (params.has('sort'))     state.sort      = params.get('sort');
        if (params.has('order'))    state.order     = params.get('order');
        if (params.has('page'))     state.page      = parseInt(params.get('page')) || 1;
    }

    // --- Б1: Запис стану фільтрів у URL ---
    function saveStateToURL() {
        const params = new URLSearchParams();
        if (state.q)              params.set('q', state.q);
        if (state.category !== 'all') params.set('category', state.category);
        if (state.sort !== 'featured') params.set('sort', state.sort);
        if (state.order !== 'desc')    params.set('order', state.order);
        if (state.page > 1)       params.set('page', String(state.page));

        const query = params.toString();
        const newURL = query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;
        window.history.replaceState(null, '', newURL);
    }

    // --- Синхронізація UI-контролів зі станом ---
    function syncControlsWithState() {
        const searchInput  = document.getElementById('searchInput');
        const sortSelect   = document.getElementById('sortSelect');
        const filterBtns   = document.querySelectorAll('.filter-btn');

        if (searchInput) searchInput.value = state.q;

        if (sortSelect) {
            const sortValue = state.order === 'asc'
                ? `${state.sort}-asc`
                : `${state.sort}-desc`;
            sortSelect.value = sortValue;
        }

        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.category);
        });
    }

    // --- Завантаження курсів через GET ---
    async function loadCourses() {
        showCatalogUIState('loading');
        try {
            const params = {
                q: state.q,
                category: state.category,
                _sort: state.sort,
                _order: state.order,
                _page: state.page,
                _limit: state.limit
            };

            const { data, total } = await getCourses(params);
            state.total = total;

            if (data.length === 0) {
                showCatalogUIState('empty');
                renderPagination();
                return;
            }

            showCatalogUIState('success');
            renderCourseGrid(data);
            renderPagination();
        } catch (err) {
            console.error('Помилка завантаження курсів:', err);
            showCatalogUIState('error', err.message);
        }
    }

    // --- Рендеринг сітки карток ---
    function renderCourseGrid(courses) {
        const favorites = readFavorites();
        container.innerHTML = courses.map(c => buildCourseCard(c, favorites)).join('');
        initIcons();
        attachCardListeners();
    }

    // --- Побудова HTML картки курсу ---
    function buildCourseCard(course, favorites) {
        const isFav = favorites.includes(course.id);
        const levelLabel = { beginner: 'Початковий', intermediate: 'Середній', advanced: 'Просунутий' };
        const catLabel   = { html: 'HTML', css: 'CSS', javascript: 'JavaScript', tools: 'Інструменти' };
        const statusBadge = course.status === 'draft'
            ? `<span class="course-status-badge draft">Чернетка</span>`
            : '';

        return `
        <article class="course-card ${course.featured ? 'featured' : ''}" data-course-id="${course.id}">
            ${statusBadge}
            <div class="course-card-header">
                <img src="${course.image}" alt="${course.title}" loading="lazy">
                <h3 class="course-card-title">${course.title}</h3>
                <span class="course-category">${catLabel[course.category] || course.category}</span>
            </div>

            <div class="course-card-body">
                <p class="course-card-description">${course.description}</p>
                <div class="course-card-meta">
                    <span class="course-rating">
                        <span data-icon="star"></span>${course.rating}
                    </span>
                    <span><span data-icon="clock"></span>${course.duration}</span>
                    <span><span data-icon="book"></span>${course.lessons} уроків</span>
                    <span class="course-level ${course.level}">${levelLabel[course.level] || course.level}</span>
                </div>
            </div>

            <div class="course-card-footer">
                <span class="course-price ${course.price === 0 ? 'free' : ''}">
                    ${course.price === 0 ? 'Безкоштовно' : course.price + ' ₴'}
                </span>
                <div class="course-card-actions">
                    <button class="btn-icon favorite-btn ${isFav ? 'is-favorite' : ''}"
                            data-course-id="${course.id}"
                            aria-label="${isFav ? 'Видалити з обраного' : 'Додати в обране'}">
                        <span data-icon="${isFav ? 'heartFilled' : 'heart'}"></span>
                    </button>
                    <button class="btn-primary details-btn" data-course-id="${course.id}">Детальніше</button>
                    <a href="admin.html?id=${course.id}" class="btn-secondary btn-edit" aria-label="Редагувати курс">Редагувати</a>
                    <button class="btn-danger delete-btn" data-course-id="${course.id}" aria-label="Видалити курс">
                        <span data-icon="trash"></span>
                    </button>
                </div>
            </div>
        </article>`;
    }

    // --- Обробники подій карток ---
    function attachCardListeners() {
        // "Детальніше" → модальне вікно деталей
        container.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openCourseDetailsModal(parseInt(btn.dataset.courseId));
            });
        });

        // Обране
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleFavorite(parseInt(btn.dataset.courseId), btn);
            });
        });

        // Видалити
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.courseId);
                const card = container.querySelector(`[data-course-id="${id}"]`);
                const title = card ? card.querySelector('.course-card-title').textContent : 'цей курс';

                openConfirmModal(
                    `Ви впевнені, що хочете видалити курс «${title}»? Цю дію неможливо скасувати.`,
                    async () => {
                        btn.disabled = true;
                        btn.textContent = '...';
                        try {
                            await deleteCourse(id);
                            showToast('Курс успішно видалено', 'success');
                            state.page = 1;
                            await loadCourses();
                        } catch (err) {
                            showToast('Помилка при видаленні: ' + err.message, 'error');
                            btn.disabled = false;
                            btn.innerHTML = iconRegistry['trash'] || 'X';
                        }
                    }
                );
            });
        });
    }

    // --- Модальне вікно деталей курсу ---
    function openCourseDetailsModal(courseId) {
        // Шукаємо серед поточно відображених карток
        const titleEl = container.querySelector(`[data-course-id="${courseId}"] .course-card-title`);
        const title = titleEl ? titleEl.textContent : '';

        // Переходимо на сторінку деталей (Б2)
        window.location.href = `course-details.html?id=${courseId}`;
    }

    // --- Пагінація ---
    function renderPagination() {
        const pagerEl = document.getElementById('paginationContainer');
        if (!pagerEl) return;

        const totalPages = Math.ceil(state.total / state.limit);

        if (totalPages <= 1) {
            pagerEl.classList.add('is-hidden');
            pagerEl.innerHTML = '';
            return;
        }

        pagerEl.classList.remove('is-hidden');

        let html = `<div class="pagination">`;

        // Кнопка "Назад"
        html += `<button class="page-btn" data-page="${state.page - 1}" ${state.page <= 1 ? 'disabled' : ''}>
            &#8592; Назад
        </button>`;

        // Номери сторінок
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === state.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        // Кнопка "Далі"
        html += `<button class="page-btn" data-page="${state.page + 1}" ${state.page >= totalPages ? 'disabled' : ''}>
            Далі &#8594;
        </button>`;

        html += `</div>
        <p class="pagination-info">Сторінка ${state.page} з ${totalPages} (всього ${state.total} курсів)</p>`;

        pagerEl.innerHTML = html;

        pagerEl.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                state.page = parseInt(btn.dataset.page);
                saveStateToURL();
                loadCourses();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // --- Ініціалізація елементів керування ---
    function initControls() {
        const searchInput = document.getElementById('searchInput');
        const sortSelect  = document.getElementById('sortSelect');
        const filterBtns  = document.querySelectorAll('.filter-btn');
        const retryBtn    = document.getElementById('retryBtn');
        const resetBtn    = document.getElementById('resetFiltersBtn');
        const addBtn      = document.getElementById('addCourseBtn');

        // Пошук з debounce
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function () {
                state.q    = this.value;
                state.page = 1;
                saveStateToURL();
                loadCourses();
            }, 300));
        }

        // Фільтри за категорією
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.category = btn.dataset.category;
                state.page     = 1;
                saveStateToURL();
                loadCourses();
            });
        });

        // Сортування
        if (sortSelect) {
            // Оновлюємо опції для роботи з API-параметрами
            sortSelect.innerHTML = `
                <option value="featured-desc">За замовчуванням</option>
                <option value="title-asc">За назвою (А-Я)</option>
                <option value="title-desc">За назвою (Я-А)</option>
                <option value="rating-desc">За рейтингом</option>
                <option value="price-asc">Спочатку безкоштовні</option>
                <option value="price-desc">Спочатку платні</option>
            `;

            sortSelect.addEventListener('change', () => {
                const [field, ord] = sortSelect.value.split('-');
                state.sort  = field;
                state.order = ord;
                state.page  = 1;
                saveStateToURL();
                loadCourses();
            });
        }

        // Кнопка "Спробувати знову"
        if (retryBtn) {
            retryBtn.addEventListener('click', () => loadCourses());
        }

        // Кнопка "Скинути фільтри"
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                state.q        = '';
                state.category = 'all';
                state.sort     = 'featured';
                state.order    = 'desc';
                state.page     = 1;
                syncControlsWithState();
                saveStateToURL();
                loadCourses();
            });
        }

        // Кнопка "Додати курс"
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    }

    // --- Обране (localStorage) ---
    const FAVORITES_KEY = 'courseFavorites';

    function readFavorites() {
        try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
        catch { return []; }
    }

    function toggleFavorite(courseId, btnEl) {
        const favorites = readFavorites();
        const idx = favorites.indexOf(courseId);
        if (idx === -1) favorites.push(courseId);
        else favorites.splice(idx, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

        const isFav = idx === -1;
        btnEl.classList.toggle('is-favorite', isFav);
        btnEl.setAttribute('aria-label', isFav ? 'Видалити з обраного' : 'Додати в обране');
        const iconEl = btnEl.querySelector('[data-icon]');
        if (iconEl) {
            iconEl.setAttribute('data-icon', isFav ? 'heartFilled' : 'heart');
            iconEl.innerHTML = iconRegistry[isFav ? 'heartFilled' : 'heart'] || '';
        }
    }

    // --- Debounce ---
    function debounce(fn, ms) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    // --- Запуск ---
    readStateFromURL();
    syncControlsWithState();
    initControls();
    await loadCourses();
}
