# 🔐 Переменные окружения для Vercel

## 📋 Скопируйте эти значения в Vercel Dashboard

**Ссылка для добавления:** https://vercel.com/dmytros-projects-480467fa/sushi-gorod/settings/environment-variables

---

### 1️⃣ DATABASE_URL

**Key:** `DATABASE_URL`  
**Value:**
```
postgresql://neondb_owner:2pLI4eDQXEdF@ep-orange-bird-a2yh5v07-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
**Type:** `Secret` ✅  
**Environments:** Production ✅ Preview ✅ Development ✅

---

### 2️⃣ NEXTAUTH_SECRET

**Key:** `NEXTAUTH_SECRET`  
**Value:**
```
4J43K9E8pc18AEhZ2ZXZzg371hUHP+cPQ8vTz82mhGE=
```
**Type:** `Secret` ✅  
**Environments:** Production ✅ Preview ✅ Development ✅

---

### 3️⃣ NEXTAUTH_URL

**Key:** `NEXTAUTH_URL`  
**Value:**
```
https://sushi-gorod.vercel.app
```
> ⚠️ **Важно:** Замените на ваш реальный домен после первого деплоя!

**Type:** `Plain Text`  
**Environments:** Production ✅ Preview ✅ Development ✅

---

### 4️⃣ ADMIN_EMAIL

**Key:** `ADMIN_EMAIL`  
**Value:**
```
admin@sushigorod.ru
```
**Type:** `Plain Text`  
**Environments:** Production ✅ Preview ✅ Development ✅

---

### 5️⃣ ADMIN_PASSWORD

**Key:** `ADMIN_PASSWORD`  
**Value:**
```
admin123
```
**Type:** `Secret` ✅  
**Environments:** Production ✅ Preview ✅ Development ✅

---

## 🚀 После добавления переменных:

### 1. Запустите деплой:
```bash
vercel --prod
```

### 2. После успешного деплоя:
1. Скопируйте URL вашего приложения (например, `https://sushi-gorod-xxx.vercel.app`)
2. Вернитесь в Environment Variables
3. Обновите значение `NEXTAUTH_URL` на ваш реальный URL
4. Сделайте redeploy: `vercel --prod`

---

## ✅ Проверка после деплоя:

1. Откройте ваш сайт на Vercel
2. Перейдите на `/admin`
3. Войдите:
   - Email: `admin@sushigorod.ru`
   - Пароль: `admin123`
4. Проверьте вкладку "Склад"

---

## 🔒 Безопасность:

- ✅ `NEXTAUTH_SECRET` сгенерирован через `openssl rand -base64 32`
- ✅ База данных защищена SSL (`sslmode=require`)
- ✅ Все секреты помечены как Secret в Vercel
- ✅ `.env` и `.env.local` в `.gitignore`

---

**Готово к деплою! 🎉**
