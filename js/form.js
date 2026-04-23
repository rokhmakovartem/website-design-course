// ==========================================
// ФОРМА СТВОРЕННЯ / РЕДАГУВАННЯ КУРСУ
// ==========================================

document.addEventListener('DOMContentLoaded', initFormPage);

async function initFormPage() {
    const form = document.getElementById('courseForm');
    if (!form) return;

    initIcons();
    initThemeToggle();
    initDynamicYear();

    const params  = new URLSearchParams(window.location.search);
    const editId  = params.get('id') ? parseInt(params.get('id')) : null;
    const isEdit  = editId !== null;

    // Оновлюємо заголовок залежно від режиму (Б4)
    const pageTitle  = document.getElementById('formPageTitle');
    const submitBtn  = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (pageTitle) pageTitle.textContent = isEdit ? 'Редагувати курс' : 'Додати новий курс';
    if (submitBtn) submitBtn.textContent = isEdit ? 'Зберегти зміни' : 'Створити курс';

    // --- Якщо режим редагування — завантажуємо поточні дані ---
    if (isEdit) {
        showFormStatus('loading', 'Завантаження даних...');
        try {
            const course = await getCourseById(editId);
            fillForm(course);
            hideFormStatus();
        } catch (err) {
            showFormStatus('error', `Не вдалося завантажити курс: ${err.message}`);
            if (submitBtn) submitBtn.disabled = true;
            return;
        }
    }

    // --- Обробка відправки форми ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = collectFormData();
        submitBtn.disabled = true;
        submitBtn.textContent = isEdit ? 'Збереження...' : 'Створення...';
        showFormStatus('loading', isEdit ? 'Зберігаємо зміни...' : 'Створюємо курс...');

        try {
            if (isEdit) {
                await updateCourse(editId, data);
                showFormStatus('success', 'Курс успішно оновлено!');
            } else {
                await createCourse(data);
                showFormStatus('success', 'Курс успішно створено!');
                form.reset();
            }

            // Повертаємось до каталогу після паузи
            setTimeout(() => {
                window.location.href = 'courses.html';
            }, 1500);
        } catch (err) {
            showFormStatus('error', `Помилка: ${err.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Зберегти зміни' : 'Створити курс';
        }
    });

    // --- Кнопка "Скасувати" ---
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'courses.html';
        });
    }

    // --- Прибираємо помилки при введенні ---
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => clearFieldError(el));
        el.addEventListener('change', () => clearFieldError(el));
    });
}

// --- Заповнення форми даними для редагування ---
function fillForm(course) {
    const fields = ['title', 'category', 'description', 'fullDescription',
                    'level', 'duration', 'lessons', 'rating', 'price', 'status', 'image'];

    fields.forEach(field => {
        const el = document.getElementById(field);
        if (!el) return;
        el.value = course[field] !== undefined ? course[field] : '';
    });

    const featuredEl = document.getElementById('featured');
    if (featuredEl) featuredEl.checked = Boolean(course.featured);

    // Теми (topics) — виводимо через кому
    const topicsEl = document.getElementById('topics');
    if (topicsEl && Array.isArray(course.topics)) {
        topicsEl.value = course.topics.join(', ');
    }
}

// --- Збір даних із форми ---
function collectFormData() {
    const formEl = document.getElementById('courseForm');
    const fd = new FormData(formEl);
    const data = Object.fromEntries(fd.entries());

    // Числові поля
    data.price   = parseFloat(data.price)   || 0;
    data.lessons = parseInt(data.lessons)   || 0;
    data.rating  = parseFloat(data.rating)  || 0;

    // Чекбокс
    data.featured = formEl.querySelector('#featured').checked;

    // Масив тем
    const topicsRaw = (data.topics || '').trim();
    data.topics = topicsRaw
        ? topicsRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    // Видаляємо службове поле topics (буде замінено масивом)
    delete data.topics; // delete old string
    data.topics = topicsRaw
        ? topicsRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    return data;
}

// --- Валідація форми ---
function validateForm() {
    let valid = true;

    const rules = [
        { id: 'title',       min: 3,  msg: 'Назва має містити щонайменше 3 символи.' },
        { id: 'description', min: 10, msg: 'Опис має містити щонайменше 10 символів.' }
    ];

    rules.forEach(({ id, min, msg }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim() || el.value.trim().length < min) {
            showFieldError(el, msg);
            valid = false;
        }
    });

    const selects = ['category', 'level', 'status'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value) {
            showFieldError(el, 'Будь ласка, оберіть значення.');
            valid = false;
        }
    });

    const price = parseFloat(document.getElementById('price')?.value);
    if (isNaN(price) || price < 0) {
        showFieldError(document.getElementById('price'), 'Ціна не може бути від\'ємною.');
        valid = false;
    }

    const rating = parseFloat(document.getElementById('rating')?.value);
    if (isNaN(rating) || rating < 0 || rating > 5) {
        showFieldError(document.getElementById('rating'), 'Рейтинг має бути від 0 до 5.');
        valid = false;
    }

    return valid;
}

function showFieldError(el, msg) {
    el.classList.add('input-error');
    const errEl = document.getElementById('error-' + el.id);
    if (errEl) errEl.textContent = msg;
}

function clearFieldError(el) {
    el.classList.remove('input-error');
    const errEl = document.getElementById('error-' + el.id);
    if (errEl) errEl.textContent = '';
}

// --- Статус-повідомлення форми ---
function showFormStatus(type, msg) {
    const el = document.getElementById('formStatus');
    if (!el) return;
    el.className = `form-status form-status-${type}`;
    el.textContent = msg;
    el.classList.remove('is-hidden');
}

function hideFormStatus() {
    const el = document.getElementById('formStatus');
    if (el) el.classList.add('is-hidden');
}
