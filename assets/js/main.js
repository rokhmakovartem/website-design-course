document.addEventListener('DOMContentLoaded', init);

async function init() {
    initIcons(); // Спочатку рендеримо іконки
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initDynamicYear();
    initAccordion();
    initModal();
    initFormValidation();
    await initCatalogPage(); // Ініціалізація каталогу курсів
}

// ==========================================
//  Реєстр іконок (Рендеринг SVG)
// ==========================================
const iconRegistry = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`,
    arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-up"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="accordion-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-heart"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`,
    heartFilled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-heart"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-star"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" /></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="state-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>`,
    empty: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="state-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-small"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-small"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>`
};

function initIcons() {
    // Знаходимо всі елементи з атрибутом data-icon і вставляємо відповідний SVG
    document.querySelectorAll('[data-icon]').forEach(el => {
        const iconName = el.getAttribute('data-icon');
        if (iconRegistry[iconName]) {
            el.innerHTML = iconRegistry[iconName];
        }
    });
}

// ==========================================
// Підсвічування активної сторінки
// ==========================================
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const currentUrl = window.location.href;

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==========================================
// Мобільне меню (бургер)
// ==========================================
function initMenuToggle() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (!menuBtn || !navList) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Закриваємо меню при кліку на посилання
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('is-open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ==========================================
// Перемикач світлої/темної теми
// ==========================================
function initThemeToggle() {
    const themeBtn = document.querySelector('.theme-toggle');
    const body = document.body;
    
    if (!themeBtn) return;

    // Відновлюємо тему при завантаженні
    if (localStorage.getItem('siteTheme') === 'dark') {
        body.classList.add('theme-dark');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('theme-dark');
        const isDark = body.classList.contains('theme-dark');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
    });
}

// ==========================================
// Кнопка "Вгору"
// ==========================================
function initBackToTop() {
    const backBtn = document.getElementById('backToTop');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
        // Показуємо кнопку, якщо прокрутили більше 300px
        if (window.scrollY > 300) {
            backBtn.classList.add('is-visible');
        } else {
            backBtn.classList.remove('is-visible');
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// Динамічний рік у footer
// ==========================================
function initDynamicYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==========================================
// Акордеон
// ==========================================
function initAccordion() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const currentItem = this.closest('.accordion-item');
            const currentContent = currentItem.querySelector('.accordion-content');
            const isActive = currentItem.classList.contains('active');

            // Закриваємо всі вкладки
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Відкриваємо поточну, якщо вона була закрита
            if (!isActive) {
                currentItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                currentContent.style.maxHeight = currentContent.scrollHeight + "px";
            }
        });
    });
}

// ==========================================
// Модальне вікно (Лайтбокс для зображень)
// ==========================================
function initModal() {
    const modal = document.getElementById('imageModal');
    const triggers = document.querySelectorAll('.modal-trigger');
    
    if (!modal || triggers.length === 0) return;

    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    // Знаходимо всі елементи, клік по яким має закрити модалку (оверлей та кнопка)
    const closeElements = modal.querySelectorAll('[data-close="true"]');

    // Функція відкриття модального вікна
    function openModal(src, alt) {
        modalImage.src = src;
        modalCaption.textContent = alt;
        
        // Вираховуємо ширину смуги прокрутки (щоб уникнути стрибків верстки)
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        // Додаємо відступ справа для body, який дорівнює ширині скролбару, що зникне
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add('no-scroll');
        
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    // Функція закриття модального вікна
    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        
        // Повертаємо прокрутку і прибираємо компенсацію відступу
        // Чекаємо завершення CSS-анімації (0.3s) перед тим, як повернути скрол
        setTimeout(() => {
            document.body.classList.remove('no-scroll');
            document.body.style.paddingRight = '';
            // Очищуємо джерело картинки, щоб не було блимання при наступному відкритті
            modalImage.src = ''; 
        }, 300);
    }

    // Вішаємо події на всі картинки-тригери
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // Беремо src та alt прямо з картинки, по якій клікнули
            openModal(this.src, this.alt);
        });
    });

    // Вішаємо події на елементи закриття (фон та хрестик)
    closeElements.forEach(el => {
        el.addEventListener('click', closeModal);
    });

    // Додатковий бонус: закриття модалки по кнопці ESC на клавіатурі
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// ==========================================
// Валідація форми та лічильник символів
// ==========================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('message');
    const rulesCheckbox = document.getElementById('rules');
    const charCounter = document.getElementById('charCounter');
    
    const maxChars = 500; // Ліміт символів

    // --- Логіка лічильника символів для textarea ---
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCounter.textContent = `${currentLength} / ${maxChars}`;

            // Змінюємо колір лічильника
            if (currentLength >= maxChars) {
                charCounter.className = 'char-counter limit-reached';
            } else if (currentLength >= maxChars * 0.8) {
                // Коли введено 80% тексту - попереджуємо жовтим
                charCounter.className = 'char-counter limit-near';
            } else {
                charCounter.className = 'char-counter';
            }
        });
    }

    // --- Логіка перевірки при відправці форми ---
    form.addEventListener('submit', function(event) {
        let isFormValid = true;

        // Допоміжна функція для показу/сховання помилок
        function validateField(inputElement, errorId, condition, errorMessage) {
            const errorSpan = document.getElementById(errorId);
            if (!condition) {
                inputElement.classList.add('input-error');
                if (errorSpan) errorSpan.textContent = errorMessage;
                isFormValid = false;
            } else {
                inputElement.classList.remove('input-error');
                if (errorSpan) errorSpan.textContent = '';
            }
        }

        // 1. Перевірка імені (мінімум 2 символи, без пробілів на початку/в кінці)
        const nameValue = nameInput.value.trim();
        validateField(
            nameInput, 
            'error-userName', 
            nameValue.length >= 2, 
            'Ім\'я має містити щонайменше 2 символи.'
        );

        // 2. Перевірка Email (за допомогою регулярного виразу)
        const emailValue = emailInput.value.trim();
        // Регулярний вираз перевіряє наявність @ та крапки
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        validateField(
            emailInput, 
            'error-userEmail', 
            emailRegex.test(emailValue), 
            'Введіть коректну email адресу (наприклад: name@mail.com).'
        );

        // 3. Перевірка повідомлення (не порожнє)
        const messageValue = messageInput.value.trim();
        validateField(
            messageInput, 
            'error-message', 
            messageValue.length > 0, 
            'Повідомлення не може бути порожнім.'
        );

        // 4. Перевірка чекбоксу (має бути відмічений)
        validateField(
            rulesCheckbox,
            'error-rules',
            rulesCheckbox.checked,
            'Необхідна згода на обробку персональних даних.'
        );

        // Якщо форма НЕ валідна - зупиняємо її відправку!
        if (!isFormValid) {
            event.preventDefault(); 
        }
    });

    // --- UX Покращення: прибираємо помилку, коли користувач починає вводити текст ---
    const allInputs = [nameInput, emailInput, messageInput];
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const errorSpan = document.getElementById('error-' + this.id);
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    rulesCheckbox.addEventListener('change', function() {
        const errorSpan = document.getElementById('error-rules');
        if (this.checked && errorSpan) {
            errorSpan.textContent = '';
        }
    });
}

// ==========================================
// Форма: Валідація, Чернетка (Draft) та FormData
// ==========================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('message');
    const rulesCheckbox = document.getElementById('rules');
    const charCounter = document.getElementById('charCounter');
    
    const successBlock = document.getElementById('successMessageBlock');
    const dataList = document.getElementById('submittedDataList');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    const maxChars = 500;

    // --- 1. ЛОГІКА ЧЕРНЕТКИ (Збереження та Відновлення) ---
    
    // Функція збереження даних у localStorage
    function saveDraft() {
        const formData = new FormData(form);
        // Перетворюємо FormData у звичайний об'єкт
        const draftObject = Object.fromEntries(formData.entries());
        // Зберігаємо у вигляді JSON-рядка
        localStorage.setItem('contactFormDraft', JSON.stringify(draftObject));
    }

    // Функція відновлення даних з localStorage
    function restoreDraft() {
        const savedDraft = localStorage.getItem('contactFormDraft');
        if (savedDraft) {
            const draftObject = JSON.parse(savedDraft);
            
            // Проходимось по всіх збережених ключах
            for (const key in draftObject) {
                const element = form.elements[key];
                if (element) {
                    // Якщо це група радіокнопок
                    if (element instanceof RadioNodeList) {
                        element.value = draftObject[key];
                    } 
                    // Якщо це чекбокс
                    else if (element.type === 'checkbox') {
                        element.checked = true; // Якщо він є в FormData, значить був включений
                    } 
                    // Інші текстові поля та селекти
                    else {
                        element.value = draftObject[key];
                    }
                }
            }
            // Оновлюємо лічильник символів після підстановки тексту
            if (messageInput) messageInput.dispatchEvent(new Event('input'));
        }
    }

    // Зберігаємо чернетку при будь-якому введенні або зміні чекбоксів/селектів
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);
    
    // Відновлюємо чернетку під час завантаження сторінки
    restoreDraft();

    // --- 2. ЛОГІКА ЛІЧИЛЬНИКА СИМВОЛІВ ---
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCounter.textContent = `${currentLength} / ${maxChars}`;

            if (currentLength >= maxChars) {
                charCounter.className = 'char-counter limit-reached';
            } else if (currentLength >= maxChars * 0.8) {
                charCounter.className = 'char-counter limit-near';
            } else {
                charCounter.className = 'char-counter';
            }
        });
    }

    // --- 3. ВАЛІДАЦІЯ ТА ОБРОБКА SUBMIT (Через FormData) ---
    form.addEventListener('submit', function(event) {
        // ЗУПИНЯЄМО стандартну відправку форми (перезавантаження сторінки)
        event.preventDefault(); 
        
        let isFormValid = true;

        function validateField(inputElement, errorId, condition, errorMessage) {
            const errorSpan = document.getElementById(errorId);
            if (!condition) {
                inputElement.classList.add('input-error');
                if (errorSpan) errorSpan.textContent = errorMessage;
                isFormValid = false;
            } else {
                inputElement.classList.remove('input-error');
                if (errorSpan) errorSpan.textContent = '';
            }
        }

        // Перевірки
        validateField(nameInput, 'error-userName', nameInput.value.trim().length >= 2, 'Ім\'я має містити щонайменше 2 символи.');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        validateField(emailInput, 'error-userEmail', emailRegex.test(emailInput.value.trim()), 'Введіть коректну email адресу.');
        validateField(messageInput, 'error-message', messageInput.value.trim().length > 0, 'Повідомлення не може бути порожнім.');
        validateField(rulesCheckbox, 'error-rules', rulesCheckbox.checked, 'Необхідна згода на обробку персональних даних.');

        // Якщо форма валідна - обробляємо дані
        if (isFormValid) {
            // Збираємо ВСІ дані з форми через FormData
            const formData = new FormData(form);
            
            // Очищаємо попередній список (на випадок повторної відправки)
            dataList.innerHTML = '';
            
            // Виводимо всі зібрані дані на екран
            for (let [key, value] of formData.entries()) {
                const li = document.createElement('li');
                // Робимо ключі більш читабельними для користувача (опціонально)
                li.innerHTML = `<strong>${key}:</strong> ${value}`;
                dataList.appendChild(li);
            }

            // Ховаємо форму, показуємо блок успіху
            form.classList.add('is-hidden');
            successBlock.classList.remove('is-hidden');
            
            // ОСНОВНА ВИМОГА: Очищаємо localStorage, бо дані успішно "відправлено"
            localStorage.removeItem('contactFormDraft');
        }
    });

    // --- Допоміжна кнопка: "Написати ще" ---
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            form.reset(); // Очищає всі поля
            // Скидаємо лічильник
            if (charCounter) charCounter.textContent = `0 / ${maxChars}`;
            charCounter.className = 'char-counter';
            
            // Ховаємо блок успіху, показуємо чисту форму
            successBlock.classList.add('is-hidden');
            form.classList.remove('is-hidden');
        });
    }

    // UX Покращення: прибирання помилок при введенні
    const allInputs = [nameInput, emailInput, messageInput];
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const errorSpan = document.getElementById('error-' + this.id);
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    rulesCheckbox.addEventListener('change', function() {
        const errorSpan = document.getElementById('error-rules');
        if (this.checked && errorSpan) errorSpan.textContent = '';
    });
}

// ==========================================
// КАТАЛОГ КУРСІВ (Асинхронна робота з даними)
// ==========================================

// Глобальний стан каталогу
const catalogState = {
    allCourses: [],       // Всі завантажені курси
    filteredCourses: [],  // Відфільтровані курси
    displayedCount: 0,    // Кількість відображених курсів
    itemsPerPage: 6,      // Кількість курсів на сторінку
    currentCategory: 'all',
    currentSearch: '',
    currentSort: 'default'
};

// Ключ для localStorage (обране)
const FAVORITES_KEY = 'courseFavorites';

// ==========================================
// Завантаження даних через fetch()
// ==========================================
async function loadCourses() {
    // Визначаємо шлях до JSON залежно від поточної сторінки
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const jsonPath = isInPagesFolder ? '../data/courses.json' : './data/courses.json';

    const response = await fetch(jsonPath);
    if (!response.ok) {
        throw new Error(`HTTP помилка: ${response.status}`);
    }
    return response.json();
}

// ==========================================
// Ініціалізація сторінки каталогу
// ==========================================
async function initCatalogPage() {
    const catalogContainer = document.querySelector('[data-catalog]');
    if (!catalogContainer) return; // Виходимо, якщо не на сторінці каталогу

    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const emptyState = document.getElementById('emptyState');
    const retryBtn = document.getElementById('retryBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Функція завантаження
    async function loadData() {
        try {
            showState('loading');
            catalogState.allCourses = await loadCourses();
            catalogState.filteredCourses = [...catalogState.allCourses];
            catalogState.displayedCount = 0;

            showState('success');
            renderCatalog();
            initCatalogControls();
        } catch (error) {
            console.error('Помилка завантаження курсів:', error);
            showState('error', error.message);
        }
    }

    // Функція відображення станів
    function showState(state, errorMessage = '') {
        loadingState.classList.add('is-hidden');
        errorState.classList.add('is-hidden');
        emptyState.classList.add('is-hidden');
        catalogContainer.classList.add('is-hidden');
        document.getElementById('loadMoreContainer').classList.add('is-hidden');

        switch(state) {
            case 'loading':
                loadingState.classList.remove('is-hidden');
                break;
            case 'error':
                errorState.classList.remove('is-hidden');
                document.getElementById('errorMessage').textContent =
                    errorMessage || 'Не вдалося завантажити дані курсів.';
                break;
            case 'empty':
                emptyState.classList.remove('is-hidden');
                break;
            case 'success':
                catalogContainer.classList.remove('is-hidden');
                break;
        }
    }

    // Експортуємо showState для використання в інших функціях
    window.showCatalogState = showState;

    // Кнопка "Спробувати знову"
    if (retryBtn) {
        retryBtn.addEventListener('click', loadData);
    }

    // Кнопка "Скинути фільтри"
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            resetFilters();
            showState('success');
            renderCatalog();
        });
    }

    // Запускаємо завантаження
    await loadData();
}

// ==========================================
// Рендеринг карток курсів
// ==========================================
function renderCatalog() {
    const container = document.getElementById('catalogContainer');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const remainingCount = document.getElementById('remainingCount');

    if (!container) return;

    // Застосовуємо фільтри та сортування
    applyFiltersAndSort();

    // Якщо немає результатів
    if (catalogState.filteredCourses.length === 0) {
        window.showCatalogState('empty');
        return;
    }

    // Визначаємо, скільки курсів показувати
    const coursesToShow = catalogState.filteredCourses.slice(0, catalogState.displayedCount + catalogState.itemsPerPage);
    catalogState.displayedCount = coursesToShow.length;

    // Отримуємо список обраного
    const favorites = readFavorites();

    // Генеруємо HTML карток
    container.innerHTML = coursesToShow.map(course => createCourseCard(course, favorites)).join('');

    // Рендеримо іконки в нових картках
    initIcons();

    // Оновлюємо кнопку "Показати ще"
    const remaining = catalogState.filteredCourses.length - catalogState.displayedCount;
    if (remaining > 0) {
        loadMoreContainer.classList.remove('is-hidden');
        remainingCount.textContent = `(${remaining})`;
    } else {
        loadMoreContainer.classList.add('is-hidden');
    }

    // Додаємо обробники подій для карток
    attachCardEventListeners();
}

// ==========================================
// Створення HTML-картки курсу
// ==========================================
function createCourseCard(course, favorites) {
    const isFavorite = favorites.includes(course.id);
    const levelLabels = {
        beginner: 'Початковий',
        intermediate: 'Середній',
        advanced: 'Просунутий'
    };
    const categoryLabels = {
        html: 'HTML',
        css: 'CSS',
        javascript: 'JavaScript',
        tools: 'Інструменти'
    };

    return `
        <article class="course-card ${course.featured ? 'featured' : ''}" data-course-id="${course.id}">
            <div class="course-card-header">
                <img src="${course.image}" alt="${course.title}" loading="lazy">
                <h3 class="course-card-title">${course.title}</h3>
                <span class="course-category">${categoryLabels[course.category] || course.category}</span>
            </div>

            <div class="course-card-body">
                <p class="course-card-description">${course.description}</p>

                <div class="course-card-meta">
                    <span class="course-rating">
                        <span data-icon="star"></span>
                        ${course.rating}
                    </span>
                    <span>
                        <span data-icon="clock"></span>
                        ${course.duration}
                    </span>
                    <span>
                        <span data-icon="book"></span>
                        ${course.lessons} уроків
                    </span>
                    <span class="course-level ${course.level}">${levelLabels[course.level]}</span>
                </div>
            </div>

            <div class="course-card-footer">
                <span class="course-price ${course.price === 0 ? 'free' : ''}">
                    ${course.price === 0 ? 'Безкоштовно' : course.price + ' ₴'}
                </span>

                <div class="course-card-actions">
                    <button class="btn-icon favorite-btn ${isFavorite ? 'is-favorite' : ''}"
                            data-course-id="${course.id}"
                            aria-label="${isFavorite ? 'Видалити з обраного' : 'Додати в обране'}">
                        <span data-icon="${isFavorite ? 'heartFilled' : 'heart'}"></span>
                    </button>
                    <button class="btn-primary details-btn" data-course-id="${course.id}">
                        Детальніше
                    </button>
                </div>
            </div>
        </article>
    `;
}

// ==========================================
// Обробники подій для карток
// ==========================================
function attachCardEventListeners() {
    // Кнопки "Детальніше"
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = parseInt(this.dataset.courseId);
            openCourseModal(courseId);
        });
    });

    // Кнопки "Обране"
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = parseInt(this.dataset.courseId);
            toggleFavorite(courseId, this);
        });
    });

    // Кнопка "Показати ще"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        // Видаляємо попередні обробники, щоб уникнути дублювання
        loadMoreBtn.replaceWith(loadMoreBtn.cloneNode(true));
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            renderCatalog();
        });
    }
}

// ==========================================
// Фільтрація та сортування
// ==========================================
function applyFiltersAndSort() {
    let result = [...catalogState.allCourses];

    // Фільтрація за категорією
    if (catalogState.currentCategory !== 'all') {
        result = result.filter(course => course.category === catalogState.currentCategory);
    }

    // Пошук
    if (catalogState.currentSearch.trim()) {
        const searchLower = catalogState.currentSearch.toLowerCase();
        result = result.filter(course =>
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower)
        );
    }

    // Сортування
    result = sortCourses(result, catalogState.currentSort);

    catalogState.filteredCourses = result;
}

function sortCourses(courses, sortBy) {
    const sorted = [...courses];

    switch(sortBy) {
        case 'title-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title, 'uk'));
            break;
        case 'rating-desc':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        default:
            // За замовчуванням: featured курси першими
            sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return sorted;
}

// ==========================================
// Ініціалізація елементів керування каталогом
// ==========================================
function initCatalogControls() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');

    // Пошук в реальному часі
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            catalogState.currentSearch = this.value;
            catalogState.displayedCount = 0;
            renderCatalog();
        }, 300));
    }

    // Фільтрація за категоріями
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            catalogState.currentCategory = this.dataset.category;
            catalogState.displayedCount = 0;
            renderCatalog();
        });
    });

    // Сортування
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            catalogState.currentSort = this.value;
            catalogState.displayedCount = 0;
            renderCatalog();
        });
    }
}

// ==========================================
// Скидання фільтрів
// ==========================================
function resetFilters() {
    catalogState.currentCategory = 'all';
    catalogState.currentSearch = '';
    catalogState.currentSort = 'default';
    catalogState.displayedCount = 0;

    // Оновлюємо UI
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
}

// ==========================================
// Обране (Favorites) з localStorage
// ==========================================
function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveFavorites(ids) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function toggleFavorite(courseId, buttonElement) {
    const favorites = readFavorites();
    const index = favorites.indexOf(courseId);

    if (index === -1) {
        favorites.push(courseId);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);

    // Оновлюємо кнопку
    const isFavorite = index === -1;
    buttonElement.classList.toggle('is-favorite', isFavorite);
    buttonElement.setAttribute('aria-label', isFavorite ? 'Видалити з обраного' : 'Додати в обране');

    // Оновлюємо іконку
    const iconSpan = buttonElement.querySelector('[data-icon]');
    if (iconSpan) {
        iconSpan.setAttribute('data-icon', isFavorite ? 'heartFilled' : 'heart');
        iconSpan.innerHTML = iconRegistry[isFavorite ? 'heartFilled' : 'heart'];
    }
}

// ==========================================
// Модальне вікно деталей курсу
// ==========================================
function openCourseModal(courseId) {
    const course = catalogState.allCourses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.getElementById('courseModal');
    const modalBody = document.getElementById('courseModalBody');

    if (!modal || !modalBody) return;

    const levelLabels = {
        beginner: 'Початковий',
        intermediate: 'Середній',
        advanced: 'Просунутий'
    };

    const favorites = readFavorites();
    const isFavorite = favorites.includes(course.id);

    modalBody.innerHTML = `
        <div class="course-modal-header">
            <img src="${course.image}" alt="${course.title}">
            <div>
                <h2>${course.title}</h2>
                <span class="course-level ${course.level}">${levelLabels[course.level]}</span>
            </div>
        </div>

        <div class="course-modal-meta">
            <div>
                <span class="label">Рейтинг</span>
                <span class="value">${course.rating} / 5</span>
            </div>
            <div>
                <span class="label">Тривалість</span>
                <span class="value">${course.duration}</span>
            </div>
            <div>
                <span class="label">Уроків</span>
                <span class="value">${course.lessons}</span>
            </div>
        </div>

        <div class="course-modal-description">
            <p>${course.fullDescription}</p>
        </div>

        <div class="course-modal-topics">
            <h4>Що ви вивчите:</h4>
            <ul>
                ${course.topics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        </div>

        <div class="course-modal-footer">
            <span class="course-modal-price ${course.price === 0 ? 'free' : ''}">
                ${course.price === 0 ? 'Безкоштовно' : course.price + ' ₴'}
            </span>
            <div class="course-card-actions">
                <button class="btn-icon favorite-btn ${isFavorite ? 'is-favorite' : ''}"
                        data-course-id="${course.id}"
                        aria-label="${isFavorite ? 'Видалити з обраного' : 'Додати в обране'}">
                    <span data-icon="${isFavorite ? 'heartFilled' : 'heart'}"></span>
                </button>
                <button class="btn-primary">Розпочати навчання</button>
            </div>
        </div>
    `;

    // Рендеримо іконки
    initIcons();

    // Обробник для кнопки обраного в модалці
    modalBody.querySelector('.favorite-btn').addEventListener('click', function() {
        toggleFavorite(course.id, this);
        // Також оновлюємо кнопку в каталозі
        const cardBtn = document.querySelector(`.course-card[data-course-id="${course.id}"] .favorite-btn`);
        if (cardBtn) {
            const isFav = readFavorites().includes(course.id);
            cardBtn.classList.toggle('is-favorite', isFav);
            const iconSpan = cardBtn.querySelector('[data-icon]');
            if (iconSpan) {
                iconSpan.setAttribute('data-icon', isFav ? 'heartFilled' : 'heart');
                iconSpan.innerHTML = iconRegistry[isFav ? 'heartFilled' : 'heart'];
            }
        }
    });

    // Відкриваємо модальне вікно
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add('no-scroll');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Закриття модалки
    const closeElements = modal.querySelectorAll('[data-close="true"]');
    closeElements.forEach(el => {
        el.addEventListener('click', closeCourseModal);
    });

    document.addEventListener('keydown', handleEscapeKey);
}

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        document.body.style.paddingRight = '';
    }, 300);

    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeCourseModal();
    }
}

// ==========================================
// Допоміжна функція debounce
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}