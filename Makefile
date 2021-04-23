start:
	docker-compose up -d
	docker-compose exec node npm run serve

scan-translations:
	docker-compose exec node i18next-scanner --config i18next-scanner.config.js
