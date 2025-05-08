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

# Копируем только необходимые файлы из этапа сборки
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./dist/public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["npm", "run", "build:start"]