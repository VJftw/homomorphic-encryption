FROM vjftw/alpine:latest

RUN apk add --update nginx && rm -rf /var/cache/apk

# Copy built app
COPY ./dist/* /app/
COPY ./nginx.conf /app/

# Copy NGINX service script
COPY s6/start_nginx.sh /etc/services.d/nginx/run
RUN chmod 755 /etc/services.d/nginx/run

# Copy fix-attrs scripts
COPY s6/01-app-dir /etc/fix-attrs.d/01-app-dir

EXPOSE 80
