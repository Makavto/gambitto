# Этап 1: Сборка приложения
FROM node:18 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап 2: Финальный образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Установка serve
RUN npm install -g serve

# Копируем только необходимые файлы из этапа сборки
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["serve", "-s", "build"]