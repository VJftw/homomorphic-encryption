# Homomorphic Encryption
by [VJ Patel](https://vjpatel.me)

[![Build Status](https://ci.vjpatel.me/job/homomorphic-encryption/branch/master/badge/icon)](https://ci.vjpatel.me/job/homomorphic-encryption/branch/master/)
[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?maxAge=2592000)]()

[![Docker](https://img.shields.io/badge/docker-1.11.0-blue.svg?maxAge=2592000)]()
[![Docker Compose](https://img.shields.io/badge/docker--compose-1.7.0-blue.svg?maxAge=2592000)]()

Homomorphic Encryption describes a way of encrypting information so that operations can be performed on cipher-texts thus creating an encrypted result which, when decrypted, match the result of the same operations performed on the plain-text.

This has a wide range of uses where, secure information is computed on, such as in secure cloud computing and distributed computing projects such as [Folding@home](https://folding.stanford.edu/).

## Structure
I have used a single repository for this application in order to keep set-up simple.
### API
The API is a Symfony 3 RESTful API which only collects statistical data and provides an authentication mechanism.
### Backend
The Backend is a Python 3 application using WebSockets used to imitate an untrusted third-party.
### Client
The client is a Angular 2 (TypeScript) application used to imitate a User/Client that carries out Homomorphic Encryption. The schemes are stored and executed here.

## Development environment set-up
I recommend that you use [Docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/) to run this application in your local environment to simplify set-up and avoid conflicting with other applications in your computer.

1. Clone the repository and `cd` into the directory
```
git clone git@github.com:VJftw/homomorphic-encryption.git
cd homomorphic-encryption
```

2. Build the Docker images using docker-compose
```
docker-compose -f development.compose.yml build
```

3. Start the containers using docker-compose
```
docker-compose -f development.compose.yml up
```
This may take some time the first it is run as it will install all of the dependencies it needs into the containers.

4. Once it has finished starting up, the application will be available at http://localhost:3000.
To stop the application, use `ctrl + c` followed by
```
docker-compose -f development.compose.yml stop
docker-compose -f development.compose.yml rm
```
