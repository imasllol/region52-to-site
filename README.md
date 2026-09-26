# Сайт ПТО ИП Авдюков С. А.

Новый сайт пункта технического осмотра в с. Вознесенское (Нижегородская область), замена region52-to.ru.

Стек: Next.js (App Router), React, TypeScript, Tailwind CSS. Деплой: Docker + Caddy на VPS.

## Команды

```bash
npm install      # установить зависимости
npm run dev      # запуск для разработки: http://localhost:3000
npm test         # модульные тесты (Vitest)
npm run build    # сборка
npm start        # запуск собранного сайта
```

## Деплой на VPS

1. Установить Docker и Docker Compose на сервер.
2. Направить A-запись домена region52-to.ru на IP сервера.
3. Скопировать `.env.example` в `.env` и заполнить значения.
4. Запустить: `docker compose up -d --build`.

Caddy сам получит HTTPS-сертификат Let's Encrypt.

## Документы

PDF-файлы нормативных документов и стоимости ТО лежат в `public/docs/`:

| Файл | Документ |
|---|---|
| zakon-o-to.pdf | Федеральный закон о техническом осмотре (170-ФЗ) |
| pravila-provedeniya-to.pdf | Правила проведения ТО (постановление N 1434) |
| tipovoy-dogovor.pdf | Типовой договор |
| postanovlenie-to-m2-m3.pdf | Постановление проведения ТО М2, М3 |
| stoimost-to.pdf | Стоимость ТО |

Весь текст сайта хранится в `src/content/site.ts`.
