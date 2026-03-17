# 📄 Google Forms Lite (Monorepo)

Легкий аналог Google Forms, побудований як **monorepo** з клієнтом (React) і сервером (GraphQL).

---

# 🚀 Технології

## Client

- React + TypeScript
- Vite
- Redux Toolkit (RTK Query)
- React Router
- GraphQL Code Generator

## Server

- Node.js + TypeScript
- Apollo Server (GraphQL)
- UUID

---

# 📁 Структура проєкту

```
google-forms-lite/
│
├── client/        # Frontend (React)
├── server/        # Backend (GraphQL API)
├── package.json   # Root (monorepo config)
```

---

# ⚙️ Встановлення

1. Клонувати репозиторій:

```bash
git clone <your-repo-url>
cd google-forms-lite
```

2. Встановити всі залежності:

```bash
npm install
```

---

# ▶️ Запуск у режимі розробки

```bash
npm run dev
```

👉 Запуститься:

- сервер (GraphQL API)
- клієнт (React app)

Використовується пакет `concurrently` для паралельного запуску.

---

# 🌐 Доступ до додатку

- Client: http://localhost:5173
- Server (GraphQL): http://localhost:4000

---

# 🔧 Окремий запуск

## Сервер

```bash
npm run dev -w server
```

## Клієнт

```bash
npm run dev -w client
```

---

# 🏗️ Збірка проєкту

```bash
npm run build
```

👉 Виконає:

- build серверу
- build клієнту

---

# ▶️ Запуск продакшн серверу

```bash
npm run start -w server
```

---

# 📡 GraphQL API

Сервер підтримує:

## Queries

- `forms` — список форм
- `form(id)` — одна форма
- `responses(formId)` — відповіді

## Mutations

- `createForm` — створити форму
- `submitResponse` — відправити відповіді

---

# 🧠 Codegen (опціонально)

Для генерації типів GraphQL:

```bash
npm run codegen -w client
```

---

# 📦 Основні команди

| Команда                     | Опис                    |
| --------------------------- | ----------------------- |
| `npm install`               | Встановити залежності   |
| `npm run dev`               | Запустити весь проєкт   |
| `npm run build`             | Збірка                  |
| `npm run lint`              | Лінтинг client          |
| `npm run codegen -w client` | Генерація GraphQL типів |

---

# ⚠️ Змінні середовища

У client можна створити `.env`:

```
VITE_GRAPHQL_URL=http://localhost:4000/
```

# 👨‍💻 Автор

Олександр Пономаренко
