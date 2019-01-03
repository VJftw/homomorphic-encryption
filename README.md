# Homomorphic Encryption
by [VJ Patel](https://vjpatel.me)

[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?maxAge=2592000)]()

Homomorphic Encryption describes a way of encrypting information so that operations can be performed on cipher-texts thus creating an encrypted result which, when decrypted, match the result of the same operations performed on the plain-text.

This has a wide range of uses where, secure information is computed on, such as in secure cloud computing and distributed computing projects such as [Folding@home](https://folding.stanford.edu/).

## Structure
I have used a single repository for this application in order to keep set-up simple. It is now hosted on AWS (https://homomorphic-encryption.vjpatel.me), in order to save money and as a learning experience in serverless computing.

### Backend
The backend is a simple Golang application that has a simple REST API to calculate computations.

### Client
The client is a Angular 2 (TypeScript) application used to imitate a User/Client that carries out Homomorphic Encryption. The schemes are stored and executed here.

## Contributing

### Running Locally (Development)

#### Pre-requisites

* AWS SAM CLI
* AWS CLI
* Docker
* NPM

#### Backend

```
cd ./backend
make install
make build
make serve
```


### Client
```
cd ./client
make install
make serve
```

**Instructions in progress.** 
