#!/usr/bin/with-contenv sh

# Fix permissions for cache and log files
rm -rf var/cache/*
rm -rf var/logs/*
chmod -R 777 var/cache
chmod -R 777 var/logs

# Fetch wait-for-it script and wait for database to be up
curl -o /tmp/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x /tmp/wait-for-it.sh
/tmp/wait-for-it.sh -t 120 $SYMFONY__DATABASE_HOST:$SYMFONY__DATABASE_PORT

# Create database, Run migrations and warm symfony cache
bin/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists
# Run twice to fix weirdly..
bin/console doctrine:database:create --ansi -e prod --no-interaction --if-not-exists

bin/console doctrine:migrations:migrate --ansi -e prod --no-interaction --allow-no-migration

bin/console cache:warm -e $SYMFONY__ENV
