# Homomorphic Encryption
by [VJ Patel](https://vjpatel.me)

[![Build Status](https://ci.vjpatel.me/job/homomorphic-encryption/branch/master/badge/icon)](https://ci.vjpatel.me/job/homomorphic-encryption/branch/master/)
[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?maxAge=2592000)]()

Homomorphic Encryption describes a way of encrypting information so that operations can be performed on cipher-texts thus creating an encrypted result which, when decrypted, match the result of the same operations performed on the plain-text.

This has a wide range of uses where, secure information is computed on, such as in secure cloud computing and distributed computing projects such as [Folding@home](https://folding.stanford.edu/).

## Structure
I have used a single repository for this application in order to keep set-up simple. It is now hosted on Google App Engine (http://homomorphic-encryption.vjpatel.me), making use of the free limits in order to save money.
### Backend
The backend is a Golang application that has a simple REST API to register and then perform computations. Google App Engine does not currently have support for Websockets and so this was simplified.
### Client
The client is a Angular 2 (TypeScript) application used to imitate a User/Client that carries out Homomorphic Encryption. The schemes are stored and executed here.

### Contributing
**Instructions in progress.** This used to be much simpler when I was using Docker Cloud with AWS but I migrated to Google App Engine which means it is a bit more difficult to set up.
