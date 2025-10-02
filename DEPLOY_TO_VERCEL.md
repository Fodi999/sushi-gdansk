# 🚀 Инструкция по деплою на Vercel

## 📋 Шаг 1: Подготовка базы данных

### Рекомендуем: Supabase (бесплатно)

1. Перейдите на https://supabase.com/dashboard
2. Нажмите **New Project**
3. Заполните:
   - Name: `sushi-gdansk`
   - Database Password: (придумайте сильный пароль и сохраните!)
   - Region: `Europe (Frankfurt)` или ближайший
4. Нажмите **Create new project** (подождите ~2 минуты)
5. Перейдите: **Settings** → **Database** → **Connection String** → **URI**
6. Скопируйте строку подключения:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
7. Замените `[YOUR-PASSWORD]` на ваш пароль из шага 3

---

## 📋 Шаг 2: Генерация NEXTAUTH_SECRET

Выполните в терминале:

```bash
openssl rand -base64 32
```

Сохраните полученную строку - это ваш `NEXTAUTH_SECRET`

---

## 📋 Шаг 3: Добавление переменных окружения в Vercel

### Откройте Vercel Dashboard:
https://vercel.com/dmytros-projects-480467fa/sushi-gdansk/settings/environment-variables

### Добавьте следующие переменные:

#### 1. DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** (ваша строка подключения из Supabase)
  ```
  postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
  ```
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Type:** Secret (чекбокс включен)

#### 2. NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** (результат команды `openssl rand -base64 32`)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Type:** Secret (чекбокс включен)

#### 3. NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://sushi-gdansk.vercel.app`
- **Environment:** ✅ Production
- **Type:** Plain Text

#### 4. ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@sushigorod.ru`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Type:** Plain Text

#### 5. ADMIN_PASSWORD
- **Key:** `ADMIN_PASSWORD`
- **Value:** `admin123` (или другой пароль)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Type:** Secret (чекбокс включен)

---

## 📋 Шаг 4: Деплой на Vercel

### Вариант 1: Через CLI (рекомендуется)

```bash
# Убедитесь, что вы в папке проекта
cd /Users/dmitrijfomin/Desktop/sushi_gorod

# Запустите деплой
vercel --prod
```

### Вариант 2: Через Web UI

1. Перейдите: https://vercel.com/new
2. Импортируйте репозиторий: `Fodi999/sushi-gdansk`
3. Настройки оставьте по умолчанию
4. Нажмите **Deploy**

---

## 📋 Шаг 5: Настройка базы данных

После успешного деплоя выполните:

```bash
# Скачайте переменные из Vercel
vercel env pull .env.vercel

# Примените миграции к production БД
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Заполните БД тестовыми данными
DATABASE_URL="postgresql://..." npx prisma db seed
```

**Или через Supabase SQL Editor:**

1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте содержимое `prisma/migrations/*/migration.sql`
3. Выполните SQL запросы
4. Создайте админа вручную или через seed скрипт

---

## 📋 Шаг 6: Проверка работы

1. Откройте ваш сайт: https://sushi-gdansk.vercel.app
2. Перейдите на `/admin`
3. Войдите с credentials:
   - Email: `admin@sushigorod.ru`
   - Password: `admin123`

---

## ✅ Чеклист перед деплоем

- [ ] База данных создана (Supabase)
- [ ] `DATABASE_URL` скопирован
- [ ] `NEXTAUTH_SECRET` сгенерирован
- [ ] Все переменные добавлены в Vercel
- [ ] Все переменные отмечены для нужных окружений
- [ ] Код закоммичен и запушен в GitHub
- [ ] Запущен `vercel --prod`
- [ ] Миграции применены к БД
- [ ] Тестовые данные добавлены
- [ ] Сайт открывается
- [ ] Админ-панель работает

---

## 🆘 Решение проблем

### Ошибка: "Environment Variable references Secret which does not exist"
✅ **Решение:** Убедитесь, что включили чекбокс "Secret" для `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`

### Ошибка: "Can't reach database server"
✅ **Решение:** 
- Проверьте правильность `DATABASE_URL`
- Убедитесь, что заменили `[YOUR-PASSWORD]` на реальный пароль
- Проверьте, что БД запущена в Supabase

### Ошибка при миграции
✅ **Решение:**
```bash
# Сбросьте БД и примените миграции заново
npx prisma migrate reset --skip-seed
npx prisma migrate deploy
npx prisma db seed
```

### Ошибка NextAuth
✅ **Решение:**
- Проверьте, что `NEXTAUTH_URL` совпадает с реальным URL
- Убедитесь, что `NEXTAUTH_SECRET` не пустой

---

## 📞 Полезные команды

```bash
# Проверить статус деплоя
vercel ls

# Посмотреть логи
vercel logs

# Скачать env переменные
vercel env pull

# Откатить деплой
vercel rollback

# Удалить проект
vercel remove sushi-gdansk
```

---

## 🎉 Готово!

После успешного деплоя ваш магазин суши будет доступен по адресу:
**https://sushi-gdansk.vercel.app**

Удачи! 🍣
