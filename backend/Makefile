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
