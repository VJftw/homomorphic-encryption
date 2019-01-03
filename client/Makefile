install:
	docker run --rm -v ${CURDIR}:/app -w /app node npm install
	docker run --rm -v ${CURDIR}:/app -w /app node npm run postinstall

serve:
	docker run --rm -v ${CURDIR}:/app -w /app \
	-p 4200:4200 \
	node npm run server

build:
	docker run --rm -v ${CURDIR}:/app -w /app \
	--env CLIENT_API_ADDRESS="" \
	--env CLIENT_BACKEND_ADDRESS="" \
	node \
	npm run build:prod
