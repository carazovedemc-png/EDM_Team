// 👇 Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();
tg.enableClosingConfirmation();
// Скрываем стандартную кнопку Telegram
tg.MainButton.hide();
tg.MainButton.isVisible = false;

// 👇 Элементы DOM
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
const catalogGrid = document.getElementById('catalog-grid');
const portfolioGrid = document.getElementById('portfolio-grid');
const reviewsContainer = document.getElementById('reviews-container');
const goToCatalogButton = document.getElementById('go-to-catalog');
const contactNowButton = document.getElementById('contact-now');

// 👇 Текущий выбранный сервис для заказа
let selectedService = null;
let currentModal = null;

// 👇 Функция для анимации нажатия на кнопки
function addButtonPressAnimation(button) {
    if (!button) return;
    button.addEventListener('mousedown', function() { this.style.transform = 'scale(0.95)'; });
    button.addEventListener('mouseup', function() { this.style.transform = ''; });
    button.addEventListener('mouseleave', function() { this.style.transform = ''; });
    button.addEventListener('touchstart', function() { this.style.transform = 'scale(0.95)'; });
    button.addEventListener('touchend', function() { this.style.transform = ''; });
}

// 👇 Навигация по секциям
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');

        // Обновляем активные ссылки
        navLinks.forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = '';
        });
        link.classList.add('active');

        // Показываем выбранную секцию
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) section.classList.add('active');
        });

        // Загружаем контент при необходимости
        if (sectionId === 'catalog' && catalogGrid.children.length === 0) loadCatalog();
        if (sectionId === 'portfolio' && portfolioGrid.children.length === 0) loadPortfolio();
        if (sectionId === 'reviews' && reviewsContainer.children.length === 0) loadReviews();

        // Плавная прокрутка к началу
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
    });
});

// 👇 Загрузка каталога услуг
function loadCatalog() {
    catalogGrid.innerHTML = '';
    services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.style.opacity = '0';
        serviceCard.style.transform = 'translateY(20px)';

        serviceCard.innerHTML = `
            <div class="service-image">
                <i class="${service.icon}"></i>
            </div>
            <div class="service-content">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-price">
                    <div class="price">${service.price}</div>
                    <button class="btn btn-primary order-btn" data-id="${service.id}">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Заказать</span>
                    </button>
                </div>
            </div>
        `;

        catalogGrid.appendChild(serviceCard);
        setTimeout(() => {
            serviceCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            serviceCard.style.opacity = '1';
            serviceCard.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Обработчики для кнопок заказа в каталоге
    document.querySelectorAll('.order-btn').forEach(button => {
        addButtonPressAnimation(button);
        button.addEventListener('click', (e) => {
            const serviceId = parseInt(e.target.closest('.order-btn').getAttribute('data-id'));
            const service = services.find(s => s.id === serviceId);
            openOrderModal(service);
        });
    });
}

// 👇 ЗАГРУЗКА ПОРТФОЛИО (полностью восстановленная функция с кнопками)
function loadPortfolio() {
    portfolioGrid.innerHTML = '';
    portfolio.forEach((item, index) => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        portfolioCard.style.opacity = '0';
        portfolioCard.style.transform = 'translateY(20px)';

        // Формируем теги
        const tagsHtml = item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('');

        // Формируем блок кнопок
        // Кнопка "Демо" показывается, если есть demoUrl и он не равен "#"
        const demoButtonHtml = item.demoUrl && item.demoUrl !== '#' ?
            `<button class="portfolio-btn portfolio-btn-primary" data-url="${item.demoUrl}">
                <i class="fas fa-play-circle"></i>
                <span>Открыть демо</span>
            </button>` : '';

        // Кнопка "Кейс" всегда есть, но может быть неактивной
        const caseButtonHtml = `<button class="portfolio-btn portfolio-btn-secondary" data-url="${item.caseUrl}">
                <i class="fas fa-file-alt"></i>
                <span>Детали проекта</span>
            </button>`;

        // Определяем содержимое для изображения (с обработкой ошибок)
        let imageContent = '';
        if (item.imageUrl) {
            imageContent = `
                <div class="portfolio-image-container">
                    <img src="${item.imageUrl}"
                         alt="${item.title}"
                         class="portfolio-image"
                         onerror="this.onerror=null; this.style.display='none';
                                  this.parentElement.innerHTML='<i class=\\'${item.icon}\\' class=\\'portfolio-icon-fallback\\'></i>';">
                </div>
            `;
        } else {
            imageContent = `
                <div class="portfolio-image-container">
                    <i class="${item.icon} portfolio-icon-fallback"></i>
                </div>
            `;
        }

        // Собираем всю карточку
        portfolioCard.innerHTML = `
            ${imageContent}
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <div class="portfolio-tags">
                    ${tagsHtml}
                </div>
                <p>${item.description}</p>
                <div class="portfolio-actions">
                    ${demoButtonHtml}
                    ${caseButtonHtml}
                </div>
            </div>
        `;

        portfolioGrid.appendChild(portfolioCard);

        // Анимация появления
        setTimeout(() => {
            portfolioCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            portfolioCard.style.opacity = '1';
            portfolioCard.style.transform = 'translateY(0)';
        }, index * 120);

        // 👇 ОБРАБОТЧИКИ КНОПОК В ПОРТФОЛИО (после добавления карточки в DOM)
        setTimeout(() => {
            const cardButtons = portfolioCard.querySelectorAll('.portfolio-btn');
            cardButtons.forEach(btn => {
                addButtonPressAnimation(btn);
                btn.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    if (url && url !== '#') {
                        window.open(url, '_blank');
                    } else {
                        // Если ссылки нет, можно показать уведомление
                        tg.showAlert('Подробное описание проекта скоро будет добавлено.');
                    }
                });
            });
        }, 100);
    });
}

// 👇 Загрузка отзывов
function loadReviews() {
    reviewsContainer.innerHTML = '';
    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.opacity = '0';
        reviewCard.style.transform = 'translateY(20px)';

        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }

        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${review.initial}</div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="review-stars">${stars}</div>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <p class="review-text">"${review.text}"</p>
        `;

        reviewsContainer.appendChild(reviewCard);
        setTimeout(() => {
            reviewCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 👇 Создание и открытие модального окна заказа
function createModalHTML(service) {
    return `
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">Оформление заказа</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-summary">
                    <div class="order-item">
                        <span>Услуга:</span>
                        <strong id="service-name">${service.title}</strong>
                    </div>
                    <div class="order-item">
                        <span>Стоимость:</span>
                        <strong class="price" id="service-price">${service.price}</strong>
                    </div>
                    <div class="order-item">
                        <span>Срок разработки:</span>
                        <strong id="service-time">${service.time}</strong>
                    </div>
                </div>
                <div class="order-features">
                    <h4>Что включено:</h4>
                    <ul class="features-list" id="service-features">
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="order-actions">
                    <button class="btn btn-order" id="confirm-order">
                        <i class="fab fa-telegram"></i>
                        <span>Заказать через Telegram</span>
                    </button>
                    <p class="order-note">После нажатия откроется чат с разработчиком</p>
                </div>
            </div>
        </div>
    `;
}

function openOrderModal(service) {
    selectedService = service;
    if (currentModal) closeOrderModal();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'order-modal';
    currentModal = modal;
    modal.innerHTML = createModalHTML(service);
    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add('active'), 10);

    const closeButton = modal.querySelector('.modal-close');
    const confirmButton = modal.querySelector('#confirm-order');
    if (closeButton) {
        closeButton.addEventListener('click', closeOrderModal);
        addButtonPressAnimation(closeButton);
    }
    if (confirmButton) {
        addButtonPressAnimation(confirmButton);
        confirmButton.addEventListener('click', function() {
            this.classList.add('loading');
            setTimeout(() => sendOrderToTelegram(), 500);
        });
    }
    modal.addEventListener('click', (e) => { if (e.target === modal) closeOrderModal(); });
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    if (currentModal) {
        currentModal.classList.remove('active');
        setTimeout(() => {
            if (currentModal && currentModal.parentNode) {
                currentModal.parentNode.removeChild(currentModal);
                currentModal = null;
            }
            document.body.style.overflow = 'auto';
            selectedService = null;
        }, 300);
    }
}

// 👇 Отправка заказа в Telegram
function sendOrderToTelegram() {
    if (!selectedService) {
        tg.showAlert('Ошибка: услуга не выбрана');
        return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const user = tg.initDataUnsafe?.user;
    const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Неизвестный пользователь';
    const userId = user?.id || 'Неизвестно';
    const username = user?.username ? ` (@${user.username})` : '';

    const message = `🚀 *НОВЫЙ ЗАКАЗ*

📌 *Услуга:* ${selectedService.title}
💰 *Цена:* ${selectedService.price}
⏰ *Срок разработки:* ${selectedService.time}
📅 *Дата заказа:* ${dateTime}

👤 *Клиент:* ${userName}${username}
🆔 *ID:* ${userId}

✨ *Включено:*
${selectedService.features.map(f => `• ${f}`).join('\n')}

#новыйзаказ #miniapp #telegram`;

    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');

    closeOrderModal();
    tg.showAlert('✅ Заказ отправлен! Откроется чат с разработчиком.');

    if (tg.sendData) {
        const orderData = {
            type: 'new_order', service: selectedService.title,
            price: selectedService.price, time: selectedService.time,
            date: dateTime, userId: userId,
            userName: userName, username: user?.username || ''
        };
        tg.sendData(JSON.stringify(orderData));
    }
}

// 👇 Инициализация приложения при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadCatalog(); // Загружаем каталог по умолчанию

    if (goToCatalogButton) {
        addButtonPressAnimation(goToCatalogButton);
        goToCatalogButton.addEventListener('click', () => {
            const catalogLink = document.querySelector('[data-section="catalog"]');
            if (catalogLink) catalogLink.click();
        });
    }

    if (contactNowButton) {
        addButtonPressAnimation(contactNowButton);
        contactNowButton.addEventListener('click', () => {
            window.open('https://t.me/EDEM_CR', '_blank');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeOrderModal();
    });

    const homeLink = document.querySelector('[data-section="home"]');
    if (homeLink && !homeLink.classList.contains('active')) {
        homeLink.classList.add('active');
    }
    window.scrollTo(0, 0);
});

tg.onEvent('viewportChanged', () => { if (tg.isExpanded) tg.expand(); });
tg.onEvent('close', () => { console.log('Приложение закрывается'); });
tg.ready();

window.addEventListener('error', function(e) {
    console.error('Ошибка:', e.error);
    tg.showAlert('Произошла ошибка. Пожалуйста, обновите страницу.');
});