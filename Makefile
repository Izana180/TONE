run-dev:
	docker compose  --env-file .env.dev up -d

run-prod:
	docker compose  --env-file .env.prod up -d

stop:
	docker compose down