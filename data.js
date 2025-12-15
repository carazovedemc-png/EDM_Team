// Данные для каталога услуг
const services = [
    {
        id: 1,
        title: "Простое приложение",
        description: "напишите в лс свои пожелания на приложение ",
        price: "от 5,000 ₽",
        time: "8-12 дней",
        features: ["простенький дизайн слабый функционал, но выполним в кротчайшие сроки "]
    },
    {
        id: 2,
        title: "Доставка еды",
        icon: "fas fa-pizza-slice",
        description: "Приложение для заказа и доставки еды с оплатой и трекингом",
        price: "от 15,000 ₽",
        time: "12-16 дней",
        features: ["Каталог товаров", "Онлайн-оплата", "Трекинг доставки", "Push-уведомления", "Отзывы"]
    },
    {
        id: 3,
        title: "Интернет-аптека",
        icon: "fas fa-pills",
        description: "Заказ лекарств с доставкой, поиск аналогов и консультации",
        price: "от 15,000 ₽",
        time: "14-18 дней",
        features: ["Поиск лекарств", "Электронные рецепты", "Доставка", "Консультации", "История заказов"]
    },
    {
        id: 4,
        title: "Mini App для знакомств",
        icon: "fas fa-heart",
        description: "Полноценное приложение для знакомств с чатом, лайками и геолокацией",
        price: "от 15,000 ₽",
        time: "10-14 дней",
        features: ["Система лайков", "Чат с защитой", "Геолокация",]
    },
    {
        id: 5,
        title: "Онлайн-магазин",
        icon: "fas fa-shopping-bag",
        description: "Полноценный магазин с корзиной, оплатой и CRM",
        price: "от 10,000 ₽",
        time: "10-15 дней",
        features: ["Каталог товаров", "Корзина", "Онлайн-оплата", "CRM система", "Аналитика"]
    },
    {
        id: 6,
        title: "Бронирование услуг",
        icon: "fas fa-calendar-check",
        description: "Запись на услуги, онлайн-оплата и управление расписанием",
        price: "от 35,000 ₽",
        time: "7-10 дней",
        features: ["Расписание", "Онлайн-запись", "Уведомления", "Календарь", "Отмена записей"]
    },
    {
        id: 7,
        title: "Образовательная платформа",
        icon: "fas fa-graduation-cap",
        description: "Курсы, тесты, прогресс обучения и сертификаты",
        price: "от 25,000 ₽",
        time: "15-20 дней",
        features: ["Видео-уроки", "Тесты", "Прогресс", "Сертификаты", "Чат с преподавателем"]
    },
    {
        id: 8,
        title: "Новостной портал",
        icon: "fas fa-newspaper",
        description: "Лента новостей, подписки и персональные рекомендации",
        price: "от 10,000 ₽",
        time: "5-8 дней",
        features: ["Лента новостей", "Подписки", "Рекомендации", "Комментарии", "Избранное"]
    }
];

//ДАННЫЕ ДЛЯ ПОРТФОЛИО (полностью восстановленные и расширенные)
const portfolio = [
    {
        id: 1,
        title: "FoodExpress",
        description: "Сервис доставки еды для сети из 15 ресторанов. Реализована интеграция с их кухонным оборудованием для автоматического принятия заказов.",
        type: "Доставка еды",
        tags: ["E-commerce", "Карты", "Оплата онлайн"],
        icon: "fas fa-pizza-slice",
        //ЗАМЕНИТЕ эту тестовую ссылку на реальный скриншот вашего проекта!
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "https://t.me/foodexpress_demo_bot", // Ссылка на демо-бота (если есть)
        caseUrl: "#" // Ссылка на кейс (можно оставить #)
    },
    {
        id: 2,
        title: "MeetUp TG",
        description: "Платформа для знакомств с использованием алгоритмов машинного обучения для подбора пар. Ежемесячно более 10 тыс. активных пользователей.",
        type: "Знакомства",
        tags: ["Социальная сеть", "AI", "Geolocation"],
        icon: "fas fa-heart",
        imageUrl: "https://images.unsplash.com/photo-1529254479751-fbacb4c7a587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 3,
        title: "PharmaGo",
        description: "Онлайн-аптека с возможностью загрузки фото рецепта. Интеграция с базами данных поставщиков для отслеживания наличия.",
        type: "Аптека / Медицина",
        tags: ["Здоровье", "E-commerce", "Распознавание изображений"],
        icon: "fas fa-pills",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 4,
        title: "FitLife Pro",
        description: "Фитнес-приложение с библиотекой из 500+ упражнений. Возможность создания тренировок тренером для клиента удаленно.",
        type: "Фитнес / Спорт",
        tags: ["Здоровье", "Видео", "Подписки"],
        icon: "fas fa-dumbbell",
        imageUrl: "https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 5,
        title: "BookMaster",
        description: "Система онлайн-записи для сети салонов красоты. Уменьшила количество пропущенных записей на 40% за счет напоминаний.",
        type: "Бронирование / Сервисы",
        tags: ["Услуги", "Календарь", "SMS-уведомления"],
        icon: "fas fa-calendar-check",
        imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 6,
        title: "EduMini Platform",
        description: "Корпоративная обучающая платформа для компании с 500+ сотрудников. Внедрение снизило затраты на обучение на 25%.",
        type: "Образование / EdTech",
        tags: ["Корпоративное", "Тесты", "Сертификаты"],
        icon: "fas fa-graduation-cap",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 7,
        title: "NewsHub TG",
        description: "Агрегатор новостей с более чем 50 источниками. Пользовательская лента формируется на основе просмотров и лайков.",
        type: "Медиа / Новости",
        tags: ["Контент", "AI-лента", "Подписки"],
        icon: "fas fa-newspaper",
        imageUrl: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    },
    {
        id: 8,
        title: "LocalMarket",
        description: "Маркетплейс для локальных производителей фермерской продукции. Подключено 120+ продавцов за первый месяц.",
        type: "E-commerce / Маркетплейс",
        tags: ["Маркетплейс", "Мультивендор", "Доставка"],
        icon: "fas fa-store",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        caseUrl: "#"
    }
];

//Данные для отзывов
const reviews = [
    {
        id: 1,
        name: "Александр",
        initial: "",
        rating: 5,
        text: "Сделали приложение для доставки еды за 2 недели. Все работает идеально, клиенты довольны. Рекомендую!",
        date: "15.12.2023"
    },
    {
        id: 2,
        name: "Мария",
        initial: "",
        rating: 5,
        text: "Заказывала Mini App для своего салона красоты. Очень профессионально, учли все пожелания. Спасибо!",
        date: "05.01.2024"
    },
    {
        id: 3,
        name: "Демирель",
        initial: "",
        rating: 5,
        text: "Разработали приложение для знакомств с нуля. Отличная работа, все функции работают стабильно.",
        date: "20.01.2024"
    },
    {
        id: 4,
        name: "Рустем",
        initial: "",
        rating: 4,
        text: "Быстрая и качественная разработка. Приложение для аптеки запустили в срок.",
        date: "10.02.2024"
    }
];