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
const orderModal = document.getElementById('order-modal');
const closeModalButton = document.getElementById('close-modal');
const confirmOrderButton = document.getElementById('confirm-order');
const goToCatalogButton = document.getElementById('go-to-catalog');
const contactNowButton = document.getElementById('contact-now');

// Текущий выбранный сервис для заказа
let selectedService = null;

// Инициализация пользователя
function initUser() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        userInfoElement.innerHTML = `
            <div class="user-avatar">
                ${user.first_name?.charAt(0) || 'П'}
            </div>
            <div class="user-name">
                ${user.first_name || 'Пользователь'}
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
    
    // Добавляем стили для user-avatar
    const style = document.createElement('style');
    style.textContent = `
        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            background: var(--gray-light);
            border-radius: 25px;
            font-size: 14px;
        }
        
        .user-avatar {
            width: 35px;
            height: 35px;
            background: var(--secondary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .user-name {
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

// Навигация с плавной прокруткой
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
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Если открыли каталог, загружаем его
        if (sectionId === 'catalog' && catalogGrid.children.length === 0) {
            loadCatalog();
        }
        
        // Если открыли портфолио, загружаем его
        if (sectionId === 'portfolio' && portfolioGrid.children.length === 0) {
            loadPortfolio();
        }
        
        // Если открыли отзывы, загружаем их
        if (sectionId === 'reviews' && reviewsContainer.children.length === 0) {
            loadReviews();
        }
    });
});

// Загрузка каталога с анимациями
function loadCatalog() {
    catalogGrid.innerHTML = '';
    
    services.forEach(service => {
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
        
        // Анимация появления
        setTimeout(() => {
            serviceCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            serviceCard.style.opacity = '1';
            serviceCard.style.transform = 'translateY(0)';
        }, 100);
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
        portfolioCard.style.transform = 'translateY(20px)';
        
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
            portfolioCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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
        
        // Анимация появления с задержкой
        setTimeout(() => {
            reviewCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Открытие модального окна заказа
function openOrderModal(service) {
    selectedService = service;
    
    document.getElementById('service-name').textContent = service.title;
    document.getElementById('service-price').textContent = service.price;
    document.getElementById('service-time').textContent = service.time;
    
    // Очищаем и добавляем фичи
    const featuresList = document.getElementById('service-features');
    featuresList.innerHTML = '';
    service.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Анимация
    orderModal.style.animation = 'fadeIn 0.3s ease';
}

// Закрытие модального окна
function closeOrderModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedService = null;
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
    
    const message = `🚀 *НОВЫЙ ЗАКАЗ*

📌 *Услуга:* ${selectedService.title}
💰 *Цена:* ${selectedService.price}
⏰ *Срок разработки:* ${selectedService.time}
📅 *Дата заказа:* ${dateTime}

👤 *Клиент:* ${userName}
🆔 *ID:* ${userId}

✨ *Включено:*
${selectedService.features.map(f => `• ${f}`).join('\n')}

#новыйзаказ #miniapp #telegram`;

    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем ссылку для открытия Telegram
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    
    // Открываем ссылку
    window.open(telegramUrl, '_blank');
    
    // Закрываем модальное окно
    closeOrderModal();
    
    // Показываем подтверждение
    tg.showAlert('✅ Заказ отправлен! Откроется чат с разработчиком.', () => {
        // Callback после закрытия алерта
    });
    
    // Можно также использовать sendData для отправки данных в бота
    if (tg.sendData) {
        const orderData = {
            service: selectedService.title,
            price: selectedService.price,
            time: selectedService.time,
            date: dateTime,
            userId: userId,
            userName: userName
        };
        
        tg.sendData(JSON.stringify(orderData));
    }
}

// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация пользователя
    initUser();
    
    // Загружаем каталог по умолчанию
    loadCatalog();
    
    // Обработчики для модального окна
    closeModalButton.addEventListener('click', closeOrderModal);
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            closeOrderModal();
        }
    });
    
    // Обработчик кнопки заказа
    confirmOrderButton.addEventListener('click', sendOrderToTelegram);
    
    // Обработчик кнопки "Смотреть каталог"
    goToCatalogButton.addEventListener('click', () => {
        document.querySelector('[data-section="catalog"]').click();
    });
    
    // Обработчик кнопки "Написать в Telegram"
    contactNowButton.addEventListener('click', () => {
        window.open('https://t.me/EDEM_CR', '_blank');
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrderModal();
        }
    });
    
    // Плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Обработка закрытия приложения
tg.onEvent('viewportChanged', () => {
    if (tg.isExpanded) {
        tg.expand();
    }
});

// Инициализация Telegram кнопки
tg.MainButton.setText('Открыть каталог');
tg.MainButton.show();
tg.MainButton.onClick(() => {
    document.querySelector('[data-section="catalog"]').click();
});
