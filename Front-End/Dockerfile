# Usar imagem oficial do Nginx Alpine
FROM nginx:alpine

# Remover a configuração padrão do Nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/studant.conf

# Remover conteúdo padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos estáticos para o diretório do Nginx
COPY html /usr/share/nginx/html/html
COPY css /usr/share/nginx/html/css
COPY JavaScript /usr/share/nginx/html/JavaScript
COPY assets /usr/share/nginx/html/assets

# Expor porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
