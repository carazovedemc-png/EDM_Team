// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация приложения
tg.expand();
tg.enableClosingConfirmation();

// Элементы DOM
const userInfoElement = document.getElementById('user-info');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
const catalogGrid = document.getElementById('catalog-grid');
const portfolioGrid = document.getElementById('portfolio-grid');
const reviewsContainer = document.getElementById('reviews-container');
const goToCatalogButton = document.getElementById('go-to-catalog');
const contactNowButton = document.getElementById('contact-now');

// Текущий выбранный сервис для заказа
let selectedService = null;

// Инициализация пользователя
function initUser() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Пользователь';
        
        userInfoElement.innerHTML = `
            <div class="user-avatar">
                ${firstName.charAt(0) || 'П'}
            </div>
            <div class="user-name">
                ${fullName}
            </div>
        `;
    } else {
        userInfoElement.innerHTML = `
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-name">
                Гость
            </div>
        `;
    }
}

// Навигация
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // Обновляем активные ссылки
        navLinks.forEach(btn => btn.classList.remove('active'));
        link.classList.add('active');
        
        // Показываем выбранную секцию
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
                // Плавный скролл к секции
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
        
        // Загружаем контент при необходимости
        if (sectionId === 'catalog' && catalogGrid.children.length === 0) {
            loadCatalog();
        }
        
        if (sectionId === 'portfolio' && portfolioGrid.children.length === 0) {
            loadPortfolio();
        }
        
        if (sectionId === 'reviews' && reviewsContainer.children.length === 0) {
            loadReviews();
        }
    });
});

// Загрузка каталога
function loadCatalog() {
    catalogGrid.innerHTML = '';
    
    services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.style.opacity = '0';
        serviceCard.style.transform = 'translateY(30px)';
        
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
        
        // Анимация появления с задержкой
        setTimeout(() => {
            serviceCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            serviceCard.style.opacity = '1';
            serviceCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Добавляем обработчики для кнопок заказа
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const serviceId = parseInt(e.target.closest('.order-btn').getAttribute('data-id'));
            const service = services.find(s => s.id === serviceId);
            openOrderModal(service);
        });
    });
}

// Загрузка портфолио
function loadPortfolio() {
    portfolioGrid.innerHTML = '';
    
    portfolio.forEach((item, index) => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        portfolioCard.style.opacity = '0';
        portfolioCard.style.transform = 'translateY(30px)';
        
        portfolioCard.innerHTML = `
            <div class="portfolio-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <p><strong>Тип:</strong> ${item.type}</p>
                <p>${item.description}</p>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioCard);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            portfolioCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            portfolioCard.style.opacity = '1';
            portfolioCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Загрузка отзывов
function loadReviews() {
    reviewsContainer.innerHTML = '';
    
    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.opacity = '0';
        reviewCard.style.transform = 'translateY(30px)';
        
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
        
        // Анимация появления с задержкой
        setTimeout(() => {
            reviewCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Создание и открытие модального окна
function openOrderModal(service) {
    selectedService = service;
    
    // Удаляем старое модальное окно, если есть
    const oldModal = document.getElementById('order-modal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Создаем новое модальное окно
    const modal = document.createElement('div');
    modal.id = 'order-modal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.background = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '2000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.backdropFilter = 'blur(10px)';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    modal.innerHTML = `
        <div class="modal-container" style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(25px);
            border-radius: 24px;
            max-width: 420px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(40px) scale(0.95);
            transition: all 0.4s ease;
        ">
            <div class="modal-header" style="
                padding: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
            ">
                <h3 class="modal-title" style="
                    font-size: 24px;
                    font-weight: 700;
                    background: linear-gradient(45deg, #ff6b6b, #4facfe, #a18cd1, #43e97b, #ff6b6b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 400% 400%;
                    animation: gradientFlow 8s ease infinite;
                ">Оформление заказа</h3>
                <button class="modal-close" style="
                    background: none;
                    border: none;
                    font-size: 32px;
                    color: #666;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                ">&times;</button>
            </div>
            
            <div class="modal-body" style="padding: 0;">
                <div class="order-summary" style="
                    background: rgba(255, 255, 255, 0.15);
                    padding: 24px;
                    margin: 24px;
                    border-radius: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">
                    <div class="order-item" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 14px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    ">
                        <span style="color: #666; font-size: 16px;">Услуга:</span>
                        <strong id="service-name" style="color: #2d3436; font-size: 18px; text-align: right; max-width: 60%;">${service.title}</strong>
                    </div>
                    <div class="order-item" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 14px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    ">
                        <span style="color: #666; font-size: 16px;">Стоимость:</span>
                        <strong class="price" id="service-price" style="color: #ff4757; font-size: 24px; font-weight: 800;">${service.price}</strong>
                    </div>
                    <div class="order-item" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 14px 0;
                    ">
                        <span style="color: #666; font-size: 16px;">Срок разработки:</span>
                        <strong id="service-time" style="color: #2d3436; font-size: 18px; font-weight: 600;">${service.time}</strong>
                    </div>
                </div>
                
                <div class="order-features" style="padding: 0 24px;">
                    <h4 style="
                        font-size: 18px;
                        margin-bottom: 16px;
                        color: #2d3436;
                        padding-left: 8px;
                    ">Что включено:</h4>
                    <ul class="features-list" id="service-features" style="
                        list-style: none;
                        margin-bottom: 24px;
                        padding-left: 8px;
                    "></ul>
                </div>
                
                <div class="order-actions" style="padding: 24px; padding-top: 0;">
                    <button class="btn btn-order" id="confirm-order" style="
                        width: 100%;
                        background: linear-gradient(45deg, #0088cc, #00aaff, #0088cc);
                        background-size: 200% 200%;
                        animation: gradientFlow 4s ease infinite;
                        color: white;
                        padding: 20px;
                        font-size: 18px;
                        font-weight: 600;
                        border-radius: 30px;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(0, 136, 204, 0.3);
                    ">
                        <i class="fab fa-telegram"></i>
                        <span>Заказать через Telegram</span>
                    </button>
                    <p class="order-note" style="
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                        margin-top: 16px;
                        padding: 0 10px;
                    ">После нажатия откроется чат с разработчиком</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Заполняем список features
    const featuresList = modal.querySelector('#service-features');
    service.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.padding = '10px 0';
        li.style.paddingLeft = '28px';
        li.style.position = 'relative';
        li.style.color = '#555';
        li.style.fontSize = '15px';
        li.style.lineHeight = '1.5';
        
        li.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        const checkmark = document.createElement('span');
        checkmark.textContent = '✦';
        checkmark.style.position = 'absolute';
        checkmark.style.left = '0';
        checkmark.style.color = '#ff4757';
        checkmark.style.fontWeight = 'bold';
        checkmark.style.fontSize = '16px';
        
        li.appendChild(checkmark);
        featuresList.appendChild(li);
    });
    
    // Анимация появления
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContainer = modal.querySelector('.modal-container');
        modalContainer.style.opacity = '1';
        modalContainer.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    // Добавляем обработчики событий
    modal.querySelector('.modal-close').addEventListener('click', closeOrderModal);
    modal.querySelector('#confirm-order').addEventListener('click', sendOrderToTelegram);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrderModal();
        }
    });
    
    // Блокируем скролл на основной странице
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        const modalContainer = modal.querySelector('.modal-container');
        modalContainer.style.opacity = '0';
        modalContainer.style.transform = 'translateY(40px) scale(0.95)';
        
        modal.style.opacity = '0';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = 'auto';
            selectedService = null;
        }, 400);
    }
}

// Отправка заказа в Telegram
function sendOrderToTelegram() {
    if (!selectedService) return;
    
    const now = new Date();
    const dateTime = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем ссылку для открытия Telegram
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    
    // Открываем ссылку в новом окне
    window.open(telegramUrl, '_blank');
    
    // Закрываем модальное окно
    closeOrderModal();
    
    // Показываем подтверждение
    tg.showAlert('✅ Заказ отправлен! Откроется чат с разработчиком.', () => {
        // Callback после закрытия алерта
    });
    
    // Отправляем данные в бота, если поддерживается
    if (tg.sendData) {
        const orderData = {
            type: 'new_order',
            service: selectedService.title,
            price: selectedService.price,
            time: selectedService.time,
            date: dateTime,
            userId: userId,
            userName: userName,
            username: user?.username || ''
        };
        
        tg.sendData(JSON.stringify(orderData));
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация пользователя
    initUser();
    
    // Загружаем каталог по умолчанию
    loadCatalog();
    
    // Обработчик кнопки "Смотреть каталог"
    goToCatalogButton.addEventListener('click', () => {
        document.querySelector('[data-section="catalog"]').click();
    });
    
    // Обработчик кнопки "Написать в Telegram"
    contactNowButton.addEventListener('click', () => {
        window.open('https://t.me/EDEM_CR', '_blank');
    });
    
    // Закрытие модального окна по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrderModal();
        }
    });
    
    // Плавный скролл при загрузке страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Обработка изменения размера окна
tg.onEvent('viewportChanged', () => {
    if (tg.isExpanded) {
        tg.expand();
    }
});

// Добавляем стили для анимаций
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(animationStyles);
