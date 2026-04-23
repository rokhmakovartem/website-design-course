// ==========================================
// API-ШАР: усі HTTP-запити до json-server
// ==========================================

const API_BASE = 'http://localhost:3000';
const API_URL = `${API_BASE}/courses`;

// --- GET /courses (з підтримкою фільтрів, сортування, пагінації) ---
async function getCourses(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.q && params.q.trim()) {
        searchParams.set('q', params.q.trim());
    }
    if (params.category && params.category !== 'all') {
        searchParams.set('category', params.category);
    }
    if (params._sort) {
        searchParams.set('_sort', params._sort);
    }
    if (params._order) {
        searchParams.set('_order', params._order);
    }
    if (params._page) {
        searchParams.set('_page', String(params._page));
    }
    if (params._limit) {
        searchParams.set('_limit', String(params._limit));
    }

    const query = searchParams.toString();
    const url = query ? `${API_URL}?${query}` : API_URL;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP помилка: ${response.status}`);

    const data = await response.json();
    // json-server повертає X-Total-Count при пагінації
    const total =
        response.headers.get('X-Total-Count') ||
        response.headers.get('x-total-count');

    return {
        data,
        total: total !== null ? parseInt(total) : data.length
    };
}

// --- GET /courses/:id ---
async function getCourseById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Курс не знайдено (${response.status})`);
    return response.json();
}

// --- POST /courses ---
async function createCourse(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Не вдалося створити курс');
    return response.json();
}

// --- PATCH /courses/:id ---
async function updateCourse(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Не вдалося оновити курс');
    return response.json();
}

// --- DELETE /courses/:id ---
async function deleteCourse(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Не вдалося видалити курс');
}
