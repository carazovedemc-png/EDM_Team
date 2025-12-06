// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация приложения
tg.expand();
tg.disableVerticalSwipes();
tg.enableClosingConfirmation();

// Скрываем кнопку MainButton от Telegram
tg.MainButton.hide();
tg.MainButton.isVisible = false;

// Элементы DOM
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
const catalogGrid = document.getElementById('catalog-grid');
const portfolioGrid = document.getElementById('portfolio-grid');
const reviewsContainer = document.getElementById('reviews-container');
const goToCatalogButton = document.getElementById('go-to-catalog');
const contactNowButton = document.getElementById('contact-now');

// Текущий выбранный сервис для заказа
let selectedService = null;
let currentModal = null;

// Функция для добавления анимации нажатия на кнопки
function addButtonPressAnimation(button) {
    if (!button) return;
    
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
    
    // Для touch устройств
    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
        this.style.transform = '';
    });
}

// Функция для анимации переключения секций
function animateSectionSwitch(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.animation = 'none';
            setTimeout(() => {
                section.style.animation = 'sectionSwitch 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }, 10);
        }
    });
}

// Навигация
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
        
        // Анимация переключения секций
        animateSectionSwitch(sectionId);
        
        // Показываем выбранную секцию
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
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
        
        // Прокрутка к началу секции
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    });
});

// Загрузка каталога
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
        
        // Анимация появления с задержкой
        setTimeout(() => {
            serviceCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            serviceCard.style.opacity = '1';
            serviceCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Добавляем обработчики для кнопок заказа
    document.querySelectorAll('.order-btn').forEach(button => {
        addButtonPressAnimation(button);
        
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
            portfolioCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
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
            reviewCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Создание модального окна HTML
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

// Создание и открытие модального окна
function openOrderModal(service) {
    selectedService = service;
    
    // Закрываем предыдущее модальное окно, если есть
    if (currentModal) {
        closeOrderModal();
    }
    
    // Создаем новое модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'order-modal';
    currentModal = modal;
    
    modal.innerHTML = createModalHTML(service);
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Добавляем обработчики событий
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
            setTimeout(() => {
                sendOrderToTelegram();
            }, 500);
        });
    }
    
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

// Отправка заказа в Telegram
function sendOrderToTelegram() {
    if (!selectedService) {
        tg.showAlert('Ошибка: услуга не выбрана');
        return;
    }
    
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

📨 **Услуга:** ${selectedService.title}
🧾 **Цена:** ${selectedService.price}
📆 **Срок разработки:** ${selectedService.time}
🗓️ **Дата заказа:** ${dateTime}

👤 **Клиент:** ${userName}${username}
🆔 **ID:** ${userId}

✨ **Включено:*,
${selectedService.features.map(f => `• ${f}`).join('\n')}
`;

    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем ссылку для открытия Telegram
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    
    // Открываем ссылку в новом окне
    window.open(telegramUrl, '_blank');
    
    // Закрываем модальное окно
    closeOrderModal();
    
    // Показываем подтверждение
    tg.showAlert('**✅ Заказ отправлен!**');
    
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
    // Загружаем каталог по умолчанию
    loadCatalog();
    
    // Обработчик кнопки "Смотреть рекомендации"
    if (goToCatalogButton) {
        addButtonPressAnimation(goToCatalogButton);
        
        goToCatalogButton.addEventListener('click', () => {
            const catalogLink = document.querySelector('[data-section="catalog"]');
            if (catalogLink) {
                catalogLink.click();
            }
        });
    }
    
    // Обработчик кнопки "Написать в Telegram"
    if (contactNowButton) {
        addButtonPressAnimation(contactNowButton);
        
        contactNowButton.addEventListener('click', () => {
            window.open('https://t.me/EDEM_CR', '_blank');
        });
    }
    
    // Закрытие модального окна по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrderModal();
        }
    });
    
    // Добавляем обработчики для навигации при загрузке
    const homeLink = document.querySelector('[data-section="home"]');
    if (homeLink && !homeLink.classList.contains('active')) {
        homeLink.classList.add('active');
    }
    
    // Прокрутка вверх при загрузке
    window.scrollTo(0, 0);
});

// Обработка изменения размера окна
tg.onEvent('viewportChanged', () => {
    if (tg.isExpanded) {
        tg.expand();
    }
});

// Обработчик закрытия приложения
tg.onEvent('close', () => {
    console.log('Приложение закрывается');
});

// Обработчик для предотвращения стандартного поведения Telegram
tg.ready();

// Функция для обработки ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    tg.showAlert('Произошла ошибка. Пожалуйста, обновите страницу.');
});
