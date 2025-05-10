# Этап 1: Установка зависимостей
FROM node:18 AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Этап 2: Финальный образ
FROM node:18 AS runner

WORKDIR /app

# Установка pm2
RUN npm install -g pm2

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходники и файл с переменными окружения
COPY . .

# Установка переменной окружения, чтобы .env.prod был приоритетным
ENV NODE_ENV=prod

# Явно копируем .env.prod
COPY .env.prod .env

EXPOSE 5000

CMD ["pm2-runtime", "start", "index.js"]
