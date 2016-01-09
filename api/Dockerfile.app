FROM vjftw/ubuntu:latest

ARG github_token

RUN apt-add-repository ppa:ondrej/php5-5.6 -y
RUN apt-add-repository ppa:git-core/ppa -y
RUN apt-add-repository ppa:nginx/stable -y
RUN apt-get update && apt-get install -y \
    git \
    php5-cli \
    php5-fpm \
    php5-curl \
    php5-intl \
    php5-json \
    php5-mysql \
    php5-redis \
    nginx

# Configure PHP and PHP-FPM
RUN sed -i 's|.*date.timezone=.*|date.timezone=Europe/London|g' /etc/php5/cli/php.ini
RUN sed -i 's|.*listen =.*|listen=9000|g' /etc/php5/fpm/pool.d/www.conf
RUN sed -i 's|.*error_log =.*|error_log=/dev/stdout|g' /etc/php5/fpm/php-fpm.conf
RUN sed -i 's|.*access.log =.*|access.log=/dev/stdout|g' /etc/php5/fpm/pool.d/www.conf
RUN sed -i 's|.*user =.*|user=root|g' /etc/php5/fpm/pool.d/www.conf
RUN sed -i 's|.*group =.*|group=root|g' /etc/php5/fpm/pool.d/www.conf
RUN sed -i -e "s/;catch_workers_output\s*=\s*yes/catch_workers_output = yes/g" /etc/php5/fpm/pool.d/www.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

RUN mkdir -p /app

COPY symfony/ /app

WORKDIR /app

# Clean up
RUN rm -rf app/cache/* app/logs/* app/bootstrap.php.cache app/config/parameters.yml vendor/ bin/

ENV SYMFONY_ENV prod
ENV SYMFONY__SECRET IAmNotSoSecret
ENV SYMFONY__DATABASE_HOST db
ENV SYMFONY__DATABASE_NAME homomorphic_encryption
ENV SYMFONY__DATABASE_PASSWORD test
ENV SYMFONY__DATABASE_PORT 3306
ENV SYMFONY__DATABASE_USER he_user
ENV SYMFONY__JMS_SERIALIZER__CAMEL_CASE_NAMING_STRATEGY__CLASS JMS\Serializer\Naming\IdenticalPropertyNamingStrategy
ENV SYMFONY__MAILER_HOST 127.0.0.1
ENV SYMFONY__MAILER_PASSWORD temp
ENV SYMFONY__MAILER_TRANSPORT smtp
ENV SYMFONY__MAILER_USER temp

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

# Clean up
RUN apt-get remove -y --purge git && apt-get autoremove -y && apt-get clean && composer clear-cache
