# ---- Etapa 1: Build ----
    FROM node:18-alpine AS build
    WORKDIR /app
    
    # Copiamos solo package.json primero para aprovechar la cache
    COPY package*.json ./
    
    # Instalamos dependencias
    RUN npm ci
    
    # Copiamos el resto del código
    COPY . .
    
    # Construimos la app de producción
    RUN npm run build
    
    # ---- Etapa 2: Nginx ----
    FROM nginx:alpine
    # Eliminamos html por defecto
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copiamos la build generada al directorio de Nginx
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Copiamos configuración personalizada de Nginx
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Exponemos el puerto
    EXPOSE 80
    
    # Healthcheck para comprobar disponibilidad
    HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
    