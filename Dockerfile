FROM node:alpine
WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* ./
# Instalar npm
RUN npm install
# Copiar proyecto
COPY . .
# Compilar
RUN npm run build
EXPOSE 3000
# Comando de inicio
CMD ["node", "dist/main"]