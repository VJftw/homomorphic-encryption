#!/bin/sh -e

env GOOS=linux go build -ldflags="-s -w" -o main .
mkdir -p bin
zip bin/compute.zip main
mv main bin/compute
