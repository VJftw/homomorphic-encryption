#!/usr/bin/with-contenv sh

cd /app && exec s6-applyuidgid -u 1000 -g 1000 python3 start_backend.py
