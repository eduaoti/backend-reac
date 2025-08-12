# ---- Etapa 1: Build ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build
    
    # ---- Etapa 2: Nginx (runtime) ----
    FROM nginx:alpine
    
    # Limpia html por defecto
    RUN rm -rf /usr/share/nginx/html/*
    
    # ✅ gzip en el contexto correcto (http) vía conf.d
    RUN printf "gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n" \
      > /etc/nginx/conf.d/gzip.conf
    
    # Estáticos de la app
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # 🔁 Plantilla para envsubst en runtime (mecanismo nativo del entrypoint)
    # El entrypoint de nginx generará /etc/nginx/conf.d/default.conf desde esta plantilla
    COPY nginx.conf /etc/nginx/templates/default.conf.template
    
    # Valor por defecto; puedes override en `docker run -e BACKEND_HOST=...`
    ENV BACKEND_HOST=doinow-back-16-1.azurewebsites.net
    
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1
    CMD ["nginx","-g","daemon off;"]
    