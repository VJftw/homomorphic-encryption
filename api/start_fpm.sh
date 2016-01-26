#!/usr/bin/with-contenv sh

cd /app

# Fix permissions for cache and log files
rm -rf app/cache/*
rm -rf app/logs/*
chmod -R 777 app/cache
chmod -R 777 app/logs

# Run migrations and warm Symfony cache
app/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists
app/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists
# Run twice to fix weirdly..
app/console doctrine:migrations:migrate --ansi -e prod --no-interaction --allow-no-migration
app/console cache:warm -e prod

chmod -R 777 app/cache
chmod -R 777 app/logs

# Start PHP-FPM
/usr/sbin/php-fpm7.0 -R --nodaemonize
