#!/usr/bin/with-contenv sh

whoami

/usr/sbin/nginx -V
/usr/sbin/nginx -c /app/nginx.conf
