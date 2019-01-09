GIT_VERSION = $(shell git describe --always)
AWS_DEFAULT_REGION ?= eu-west-1

install:
	docker run --rm -v ${CURDIR}:/app -w /app node npm install
	docker run --rm -v ${CURDIR}:/app -w /app node npm run postinstall

serve:
	docker run --rm -v ${CURDIR}:/app -w /app \
	-p 4200:4200 \
	node npm run server

build:
	docker run --rm -v ${CURDIR}:/app -w /app \
	--env CLIENT_API_ADDRESS="api.homomorphic-encryption.vjpatel.me" \
	--env CLIENT_BACKEND_ADDRESS="api.homomorphic-encryption.vjpatel.me" \
	node \
	npm run build:prod

publish:
	@docker run --rm \
	--volume ${CURDIR}:/app \
	--workdir /app \
	--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
	--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
	--env AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	mesosphere/aws-cli:latest \
	s3 cp dist/. s3://homomorphic-encryption.vjpatel.me --acl public-read --recursive --cache-control max-age=120