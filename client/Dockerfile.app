FROM vjftw/alpine:latest

RUN apk add --update nginx && rm -rf /var/cache/apk

# Copy built app
COPY ./dist/* /app/
COPY ./nginx.conf /app/

# Fix Permissions
RUN chown -R root:nginx /app
RUN chmod -R 777 /app && chmod -R g+x /app

# Copy NGINX service script
COPY start_nginx.sh /etc/services.d/nginx/run
RUN chmod 755 /etc/services.d/nginx/run

EXPOSE 80
