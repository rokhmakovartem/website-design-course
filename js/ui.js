// ==========================================
// UI-УТИЛІТИ: toast, confirm modal, states
// ==========================================

// --- Toast-повідомлення ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    container.appendChild(toast);

    // Запускаємо анімацію появи
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('is-visible'));
    });

    // Прибираємо через 3 секунди
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 350);
    }, 3000);
}

// --- Модальне вікно підтвердження (Б5: кастомний confirm) ---
let _pendingConfirmCallback = null;

function openConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) {
        // Fallback на стандартний confirm якщо модал не знайдено
        if (window.confirm(message)) onConfirm();
        return;
    }

    const msgEl = document.getElementById('confirmMessage');
    if (msgEl) msgEl.textContent = message;

    _pendingConfirmCallback = onConfirm;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add('no-scroll');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        document.body.style.paddingRight = '';
    }, 300);

    _pendingConfirmCallback = null;
}

function initConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;

    const cancelBtn = document.getElementById('confirmCancelBtn');
    const okBtn = document.getElementById('confirmOkBtn');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeConfirmModal);
    }

    if (okBtn) {
        okBtn.addEventListener('click', async () => {
            const cb = _pendingConfirmCallback;
            closeConfirmModal();
            if (cb) await cb();
        });
    }

    // Закриття кліком на overlay
    modal.querySelectorAll('[data-close="true"]').forEach(el => {
        el.addEventListener('click', closeConfirmModal);
    });

    // Закриття по ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeConfirmModal();
        }
    });
}

// --- Стани каталогу ---
function showCatalogUIState(state, message = '') {
    const loading = document.getElementById('loadingState');
    const error   = document.getElementById('errorState');
    const empty   = document.getElementById('emptyState');
    const grid    = document.getElementById('catalogContainer');
    const more    = document.getElementById('loadMoreContainer');
    const pager   = document.getElementById('paginationContainer');

    [loading, error, empty, grid, more, pager].forEach(el => {
        if (el) el.classList.add('is-hidden');
    });

    switch (state) {
        case 'loading':
            if (loading) loading.classList.remove('is-hidden');
            break;
        case 'error':
            if (error) error.classList.remove('is-hidden');
            const errMsg = document.getElementById('errorMessage');
            if (errMsg) errMsg.textContent = message || 'Не вдалося завантажити дані.';
            break;
        case 'empty':
            if (empty) empty.classList.remove('is-hidden');
            break;
        case 'success':
            if (grid) grid.classList.remove('is-hidden');
            break;
    }
}
