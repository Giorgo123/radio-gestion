FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]

