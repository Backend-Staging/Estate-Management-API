build:
	docker compose -f local.yml up --build -d --remove-orphans

build-no-cache:
	docker compose -f local.yml build --no-cache
	docker compose -f local.yml up -d --remove-orphans

build-client:
	docker compose -f local.yml build --no-cache client
	docker compose -f local.yml up -d client

up:
	docker compose -f local.yml up -d 
	
down:
	docker compose -f local.yml down

down-v:
	docker compose -f local.yml down -v

show-logs:
	docker compose -f local.yml logs

show-logs-api:
	docker compose -f local.yml logs api

makemigrations:
	docker compose -f local.yml run --rm api python manage.py makemigrations

migrate:
	docker compose -f local.yml run --rm api python manage.py migrate

collectstatic:
	docker compose -f local.yml run --rm api python manage.py collectstatic --no-input --clear

superuser:
	docker compose -f local.yml run --rm api python manage.py createsuperuser

db-volume:
	docker volume inspect api_estate_prod_postgres_data

mailpit-volume:
	docker volume inspect api_estate_prod_mailpit_data

estate-db:
	docker compose -f local.yml exec postgres psql --username=alphaogilo --dbname=estate

test:
	docker compose -f local.yml run --rm api pytest

test-cov:
	docker compose -f local.yml run --rm api pytest --cov-report=term-missing

test-html:
	docker compose -f local.yml run --rm api pytest --cov-report=html
	@echo "Coverage report generated in htmlcov/index.html"

test-watch:
	docker compose -f local.yml run --rm api pytest -f