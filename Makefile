start:
	docker-compose up -d
	docker-compose exec node npm run start

build:
	docker-compose up -d
	docker-compose exec node npm run webpack:build

scan-translations:
	docker-compose exec node i18next-scanner --config i18next-scanner.config.js

container:
	docker-compose exec node bash
