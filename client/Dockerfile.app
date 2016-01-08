FROM alpine:3.2

RUN apk add --update nginx && rm -rf /var/cache/apk

COPY ./__build__ /app
COPY ./nginx.conf /app

EXPOSE 80

CMD ["nginx", "-c", "/app/nginx.conf"]
