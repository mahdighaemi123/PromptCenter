# استفاده از ایمیج بسیار سبک نود (Alpine)
FROM node:20-alpine

WORKDIR /app

# نصب وابستگی‌ها (کش می‌شود و سریع است)
COPY package*.json ./
RUN npm install

# کپی کدها
COPY . .

# پورت پیش‌فرض Vite
EXPOSE 5173

# دستور اجرا در حالت توسعه (Development)
# نکته مهم: --host 0.0.0.0 باعث می‌شود از بیرون کانتینر در دسترس باشد
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]