FROM sillelien/base-alpine:0.10

ARG github_token

RUN apk add --update nginx php-cli php-fpm php-phar php-dom php-json php-intl php-pdo_mysql php-opcache php-curl php-bcmath php-openssl php-ctype php-posix openssl curl ca-certificates && update-ca-certificates
RUN sed -i 's#.*date.timezone=.*#date.timezone=Europe/London#g' /etc/php/php.ini

# Configure PHP-FPM
RUN sed -i 's#.*listen =.*#listen=9000#g' /etc/php/php-fpm.conf
RUN sed -i -e "s/;catch_workers_output\s*=\s*yes/catch_workers_output = yes/g" /etc/php/php-fpm.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

RUN mkdir -p /app

COPY symfony/ /app

WORKDIR /app

# Clean up
RUN rm -rf app/cache/* app/logs/* app/bootstrap.php.cache app/config/parameters.yml vendor/ bin/

ENV SYMFONY_ENV prod

# Set composer github token
RUN rm -rf /root/.composer && composer config --global github-oauth.github.com $github_token

# Composer install
RUN composer --no-dev --ansi --no-interaction --prefer-dist -v --optimize-autoloader install

# Remove github tken
RUN rm -rf /root/.composer

# Fix permissions for Symfony cache and logs
RUN chmod -R 777 /app/app/cache && chmod -R 777 /app/app/logs && rm -rf /app/app/cache/*

# Temp hack to fix Symfony environment parameters
RUN rm app/config/parameters.yml && mv app/config/config.yml app/config/config.yml.bak && sed '/- { resource: parameters.yml }/d' app/config/config.yml.bak > app/config/config.yml

# Copy NGINX configuration
COPY nginx.conf /var/nginx.conf

EXPOSE 80

# Copy NGINX service script
COPY start_nginx.sh /etc/services.d/nginx/run
RUN chmod 755 /etc/services.d/nginx/run

# Copy PHP-FPM service script
COPY start_fpm.sh /etc/services.d/php_fpm/run
RUN chmod 755 /etc/services.d/php_fpm/run
