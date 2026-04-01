document.addEventListener('DOMContentLoaded', init);

function init() {
    initIcons(); // Спочатку рендеримо іконки
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initDynamicYear();
    initAccordion();
    initModal();
    initFormValidation();
    initFormValidation();
}

// ==========================================
// 1. Реєстр іконок (Рендеринг SVG)
// ==========================================
const iconRegistry = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`,
    arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-up"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="accordion-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
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
// 2. Підсвічування активної сторінки
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
// 3. Мобільне меню (бургер)
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
// 4. Перемикач світлої/темної теми
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
// 5. Кнопка "Вгору"
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
// 6. Динамічний рік у footer
// ==========================================
function initDynamicYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==========================================
// 7. Акордеон
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
// 9. Модальне вікно (Лайтбокс для зображень)
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
// 10. Валідація форми та лічильник символів
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
// 10. Форма: Валідація, Чернетка (Draft) та FormData
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