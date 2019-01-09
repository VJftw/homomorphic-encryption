GIT_VERSION = $(shell git describe --always)
AWS_DEFAULT_REGION ?= eu-west-1

apply:
	docker run -it --rm \
	--volume ${CURDIR}:/app \
	--workdir /app \
	--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
	--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
	--env AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	--env TF_VAR_version=${GIT_VERSION} \
	hashicorp/terraform:0.11.11 \
	apply