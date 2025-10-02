# ⚡ Быстрая подготовка к деплою на Vercel

## ✅ Что уже сделано:

1. ✅ `.env.local` создан для локальной разработки
2. ✅ `.env.example` обновлён для Vercel
3. ✅ `package.json` имеет `postinstall: prisma generate`
4. ✅ Код запушен в GitHub: https://github.com/Fodi999/sushi-gdansk

---

## 🚀 Следующие шаги (5 минут):

### 1️⃣ Создайте БД на Supabase

```
1. https://supabase.com/dashboard → New Project
2. Name: sushi-gdansk
3. Password: (придумайте и СОХРАНИТЕ)
4. Region: Europe (Frankfurt)
5. Скопируйте Connection String (URI)
```

### 2️⃣ Сгенерируйте NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3️⃣ Добавьте переменные в Vercel

Откройте: https://vercel.com/dmytros-projects-480467fa/sushi-gdansk/settings/environment-variables

**Добавьте 5 переменных:**

| Key | Value | Type | Env |
|-----|-------|------|-----|
| `DATABASE_URL` | `postgresql://...` (из Supabase) | Secret | All |
| `NEXTAUTH_SECRET` | результат openssl | Secret | All |
| `NEXTAUTH_URL` | `https://sushi-gdansk.vercel.app` | Plain | Production |
| `ADMIN_EMAIL` | `admin@sushigorod.ru` | Plain | All |
| `ADMIN_PASSWORD` | `admin123` | Secret | All |

### 4️⃣ Деплой!

```bash
vercel --prod
```

### 5️⃣ Настройте БД

```bash
# Скачайте переменные
vercel env pull .env.vercel

# Примените миграции
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Заполните данными
DATABASE_URL="postgresql://..." npx prisma db seed
```

---

## 📚 Подробная инструкция

См. файл: **DEPLOY_TO_VERCEL.md**

---

## ✅ Готово!

Ваш сайт будет доступен по адресу:
**https://sushi-gdansk.vercel.app**

Админ-панель: **https://sushi-gdansk.vercel.app/admin**
