# Документация приложения "Исторатор"

## Обзор
"Исторатор" - это веб-приложение для генерации персонализированных коротких историй на основе пользовательского ввода. Приложение использует AI для создания уникальных рассказов и предоставляет пользователям возможность делиться своими историями.

## Технологии
- Next.js 
- Framer Motion (для анимаций)
- Prisma (ORM для работы с базой данных)
- SQLite (база данных)
- OpenRouter API (для генерации текста)

## Структура приложения

### Главная страница (app/page.tsx)
- Основной компонент, который отображает форму ввода и сгенерированную историю.
- Использует состояния для управления процессом генерации истории.

### Компонент PaperSheet (app/components/PaperSheet.tsx)
- Основной компонент для отображения формы ввода и сгенерированной истории.
- Реализует анимации ввода, генерации и отображения истории.
- Управляет состоянием приложения и взаимодействием с API.

### API роуты
1. generateStory (app/api/generateStory/route.ts)
   - Обрабатывает POST-запросы для генерации истории.
   - Использует OpenRouter API для создания текста.
   - Реализует потоковую передачу данных для отображения текста по мере генерации.

2. generateTitle (app/api/generateTitle/route.ts)
   - Генерирует заголовок для созданной истории.

3. saveStory (app/api/saveStory/route.ts)
   - Сохраняет сгенерированную истори в базе данных.

4. getStory (app/api/getStory/[id]/route.ts)
   - Получает сохраненную историю по ID для отображения на странице истории.

### Страница истории (app/story/[id]/page.tsx)
- Отображает сохраненную историю.
- Предоставляет возможность поделиться ссылкой на историю.

## Дизайн и анимации

### Цветовая схема
- Основной фон: мягкий желтый (#fffdf0)
- Текст: темно-серый (#171717)

### Шрифты
- Для историй: Neucha (курсивный)
- Для системного текста: JetBrains Mono

### Анимации (использование Framer Motion)

1. Анимация очистки текста перед генерацией:
   - Текст пользовательского ввода постепенно удаляется символ за символом с интервалом в 50 мс.
   - Создает эффект "стирания" текста перед началом генерации истории c помощью курсора.

2. Анимация появления текста по мере генерации:
   - Используется потоковая передача данных от API.
   - Каждый новый токен текста добавляется к существующему содержимому с мгновенным отображением.
   - Курсор (синяя вертикальная черта) мигает в конце текста, имитируя процесс печати.
   - Автоматическая прокрутка вниз при добавлении нового текста.

3. Анимация генерации и отображения заголовка:
   - После завершения генерации истории появляется текст "Придумываю название..." с эффектом печатающейся машинки (20 мс на символ).
   - Затем текст "Придумываю название..." стирается посимвольно (20 мс на символ).
   - Сгенерированное название появляется с эффектом печатающейся машинки (30 мс на символ).
   - Курсор мигает в конце текста во время анимации.

4. Плавное появление элементов интерфейса:
   - Основной контейнер с историей появляется с эффектом fade-in и движением снизу вверх.
   - Кнопки управления и информация о истории появляются с эффектом fade-in.

## Модель генерации и параметры

Для генерации историй и заголовков используется языковая модель:

- Модель: mistralai/pixtral-12b:free
- API: OpenRouter

Параметры генерации истории:
- Максимальное количество токенов: 2000
- Температура: по умолчанию (не указана явно)
- Потоковая передача: включена (stream: true)

Системное сообщение для генерации истории:
"Вы - креативный писатель, который создает короткие, увлекательные истории на основе подсказок пользователей. Используйте переносы строк для разделения абзацев."

Системное сообщение для генерации заголовка:
"Вы - креативный писатель, который придумывает короткие и интересные названия для историй."

## Процесс работы приложения
1. Пользователь вводит подсказку для истории.
2. Текст подсказки анимированно стирается.
3. Приложение отправляет запрос на генерацию через API.
4. Текст истории отображается по мере генерации с анимацией появления и мигающим курсором.
5. После завершения генерации истории происходит анимированная генерация заголовка.
6. История сохраняется в базе данных.
7. Пользователю предоставляется анимированно появляющаяся ссылка для шаринга.

## Особенности реализации
- Использование серверных компонентов Next.js для оптимизации производительности.
- Потоковая передача данных для отображения текста в реальном времени.
- Адаптивный дизайн для мобильных и десктопных устройств.
- Оптимизация SEO с использованием метаданных Next.js для страниц историй.

## Развертывание
- Приложение настроено для запуска на порту 3001 в продакшн-режиме.
- Используется переменная окружения NEXT_PUBLIC_SITE_URL для настройки базового URL.

Для воспроизведения приложения необходимо настроить переменные окружения, установить зависимости и запустить миграции Prisma для создания схемы базы данных.