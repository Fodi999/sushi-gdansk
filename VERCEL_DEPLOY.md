# 🚀 Деплой на Vercel

## Подготовка к деплою

### 1. Создайте базу данных PostgreSQL

Вам нужна PostgreSQL база данных. Рекомендуемые варианты:
- **Vercel Postgres** (встроенная в Vercel)
- **Neon** (https://neon.tech) - бесплатный tier
- **Supabase** (https://supabase.com) - бесплатный tier
- **Railway** (https://railway.app)

### 2. Получите DATABASE_URL

После создания базы данных скопируйте `DATABASE_URL` (connection string).

Пример:
```
postgresql://username:password@host:5432/database?sslmode=require
```

### 3. Сгенерируйте NEXTAUTH_SECRET

Выполните в терминале:
```bash
openssl rand -base64 32
```

Или используйте онлайн генератор: https://generate-secret.vercel.app/32

---

## Деплой через Vercel Dashboard

### Шаг 1: Подключите GitHub репозиторий

1. Зайдите на https://vercel.com
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий `sushi_gorod`

### Шаг 2: Настройте переменные окружения

В настройках проекта добавьте:

#### Environment Variables:

| Название | Значение | Окружение |
|----------|----------|-----------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://your-app-preview.vercel.app` | Preview |
| `NEXTAUTH_SECRET` | `ваш-сгенерированный-секрет` | Production, Preview, Development |

### Шаг 3: Build Settings

Vercel автоматически определит настройки:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (или используйте `vercel-build`)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Шаг 4: Deploy

Нажмите "Deploy" и подождите завершения сборки.

---

## Деплой через Vercel CLI

### Установка CLI

```bash
npm install -g vercel
```

### Логин

```bash
vercel login
```

### Деплой

```bash
# Деплой в preview окружение
vercel

# Деплой в production
vercel --prod
```

### Добавление переменных окружения

```bash
# Добавить DATABASE_URL
vercel env add DATABASE_URL

# Добавить NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET

# Добавить NEXTAUTH_URL
vercel env add NEXTAUTH_URL
```

---

## После первого деплоя

### 1. Запустите миграции базы данных

После деплоя миграции запустятся автоматически благодаря `vercel-build` скрипту.

Если нужно запустить вручную:

```bash
# Подключитесь к вашей базе данных и выполните
npx prisma migrate deploy
```

### 2. Заполните базу тестовыми данными (опционально)

```bash
# Локально с указанием production DATABASE_URL
DATABASE_URL="your-production-url" npm run db:seed
```

### 3. Проверьте деплой

Откройте URL вашего приложения и проверьте:
- ✅ Главная страница загружается
- ✅ Вход в админ панель работает
- ✅ База данных подключена

---

## Настройка домена (опционально)

### В Vercel Dashboard:

1. Перейдите в Settings → Domains
2. Добавьте ваш кастомный домен
3. Настройте DNS записи согласно инструкциям Vercel
4. Обновите `NEXTAUTH_URL` на ваш домен

---

## Автоматический деплой

Vercel автоматически деплоит:
- **Production:** при push в `main` ветку
- **Preview:** при создании Pull Request

---

## Проверка логов

### В Dashboard:
Settings → Deployments → View Function Logs

### Через CLI:
```bash
vercel logs [deployment-url]
```

---

## Troubleshooting

### Ошибка "Database connection failed"

- Проверьте `DATABASE_URL` в переменных окружения
- Убедитесь что база данных доступна извне
- Проверьте `?sslmode=require` в connection string

### Ошибка "NEXTAUTH_URL is not set"

- Добавьте `NEXTAUTH_URL` в переменные окружения
- Для production: `https://your-app.vercel.app`
- Для preview: автоматически определяется

### Ошибка при миграциях

```bash
# Локально примените миграции к production БД
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Build fails

- Проверьте логи сборки
- Убедитесь что все зависимости в `package.json`
- Проверьте TypeScript ошибки локально: `npm run build`

---

## Полезные команды

```bash
# Просмотр деплоев
vercel list

# Удалить деплой
vercel remove [deployment-name]

# Открыть проект в браузере
vercel open

# Просмотр переменных окружения
vercel env ls

# Скачать переменные окружения
vercel env pull
```

---

## Рекомендации

### Безопасность

- ✅ Никогда не коммитьте `.env` файлы
- ✅ Используйте сильный `NEXTAUTH_SECRET`
- ✅ Ограничьте доступ к базе данных по IP (если возможно)

### Производительность

- ✅ Включите кеширование в Vercel
- ✅ Используйте ISR для статических страниц
- ✅ Оптимизируйте изображения через `next/image`

### Мониторинг

- ✅ Настройте алерты в Vercel
- ✅ Отслеживайте использование базы данных
- ✅ Проверяйте логи регулярно

---

## Готово! 🎉

Ваше приложение "Суши Город" теперь на Vercel!

**Production URL:** https://your-app.vercel.app  
**Admin Panel:** https://your-app.vercel.app/admin

**Логин:** admin@sushigorod.ru  
**Пароль:** admin123

---

## Дополнительные ресурсы

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
