GIT_VERSION = $(shell git describe --always)
AWS_DEFAULT_REGION ?= eu-west-1

install:
	@docker run --rm -it \
	--volume ${CURDIR}:/go/src/github.com/VJftw/homomorphic-encryption/backend \
	--workdir /go/src/github.com/VJftw/homomorphic-encryption/backend \
	vjftw/go-dep:1.11 \
	scripts/install-deps.sh

build:
	scripts/build.sh

test:
	@docker run --rm -it \
	--volume ${CURDIR}:/go/src/github.com/VJftw/homomorphic-encryption/backend \
	--workdir /go/src/github.com/VJftw/homomorphic-encryption/backend \
	golang:1.11 \
	scripts/test-unit.sh

serve:
	AWS_DEFAULT_REGION=eu-west-1
	sam local start-api

publish:
	docker run --rm \
	--volume ${CURDIR}/bin:/app \
	--workdir /app \
	--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
	--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
	--env AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	mesosphere/aws-cli:latest \
	s3 cp compute.zip s3://api.homomorphic-encryption.vjpatel.me/${GIT_VERSION}.zip
