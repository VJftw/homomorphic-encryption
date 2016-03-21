FROM vjftw/ubuntu:latest

RUN apt-add-repository ppa:ondrej/php -y
RUN apt-add-repository ppa:nginx/stable -y
RUN apt-get update && apt-get install -y \
    php-fpm \
    php-curl \
    php-intl \
    php-json \
    php-mysql \
    php-redis \
    php-xml \
    php-zip \
    php-bcmath \
    nginx

# Configure PHP and PHP-FPM
RUN sed -i 's|.*listen =.*|listen=9000|g' /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i 's|.*error_log =.*|error_log=/dev/stdout|g' /etc/php/7.0/fpm/php-fpm.conf
RUN sed -i 's|.*access.log =.*|access.log=/dev/stdout|g' /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i 's|.*user =.*|user=root|g' /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i 's|.*group =.*|group=root|g' /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i -e "s/;catch_workers_output\s*=\s*yes/catch_workers_output = yes/g" /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i 's#.*variables_order.*#variables_order=EGPCS#g' /etc/php/7.0/fpm/pool.d/www.conf
RUN sed -i 's#.*date.timezone.*#date.timezone=Europe/London#g' /etc/php/7.0/fpm/pool.d/www.conf

RUN mkdir -p /run/php && chmod -R 755 /run/php

COPY ./__build__ /app/

WORKDIR /app

ENV SYMFONY_ENV prod
ENV SYMFONY__SECRET IAmNotSoSecret
ENV SYMFONY__DATABASE_HOST db
ENV SYMFONY__DATABASE_NAME homomorphic_encryption
ENV SYMFONY__DATABASE_PASSWORD test
ENV SYMFONY__DATABASE_PORT 3306
ENV SYMFONY__DATABASE_USER he_user
ENV SYMFONY__REDIS_HOST redis://redis
ENV SYMFONY__REDIS_TTL 3600
ENV SYMFONY__JMS_SERIALIZER__CAMEL_CASE_NAMING_STRATEGY__CLASS JMS\Serializer\Naming\IdenticalPropertyNamingStrategy
ENV SYMFONY__MAILER_HOST 127.0.0.1
ENV SYMFONY__MAILER_PASSWORD temp
ENV SYMFONY__MAILER_TRANSPORT smtp
ENV SYMFONY__MAILER_USER temp
ENV SYMFONY__CORS_ORIGIN *

# Fix permissions for Symfony cache and logs
RUN mkdir -p /app/var/cache && mkdir -p /app/var/logs && chmod -R 777 /app/var/cache && chmod -R 777 /app/var/logs && rm -rf /app/var/cache/*

# Temp hack to fix Symfony environment parameters
RUN mv /app/app/config/config.yml /app/app/config/config.yml.bak && sed '/- { resource: parameters.yml }/d' /app/app/config/config.yml.bak > /app/app/config/config.yml

# Copy NGINX configuration
COPY nginx.conf /var/nginx.conf

EXPOSE 80

# Copy NGINX service script
COPY start_nginx.sh /etc/services.d/nginx/run
RUN chmod 755 /etc/services.d/nginx/run

# Copy PHP-FPM service script
COPY start_fpm.sh /etc/services.d/php_fpm/run
RUN chmod 755 /etc/services.d/php_fpm/run

# Clean up
RUN apt-get autoremove -y && apt-get clean
