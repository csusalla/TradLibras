.PHONY: dev build test run lint format clean install

# Configurações
DOCKER_COMPOSE := docker-compose
NODE_ENV ?= development

# Comandos principais
dev:
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	$(DOCKER_COMPOSE) up -d --build
	@echo "✅ Ambiente disponível em:"
	@echo "   Web: http://localhost:3000"
	@echo "   API: http://localhost:8000"

build:
	@echo "🏗️ Buildando todos os projetos..."
	npm run build:web
	npm run build:sdk
	npm run build:api
	cd apps/mobile && ./gradlew build
	@echo "✅ Build concluído!"

test:
	@echo "🧪 Executando todos os testes..."
	npm run test:web
	npm run test:sdk
	npm run test:api
	cd apps/mobile && ./gradlew test
	@echo "✅ Testes concluídos!"

run:
	@echo "🚀 Iniciando em modo produção..."
	$(DOCKER_COMPOSE) -f docker-compose.prod.yml up -d

lint:
	@echo "🔍 Executando linting..."
	npm run lint:web
	npm run lint:sdk
	npm run lint:api
	cd apps/mobile && ./gradlew ktlintCheck
	@echo "✅ Linting concluído!"

format:
	@echo "💅 Formatando código..."
	npm run format:web
	npm run format:sdk
	npm run format:api
	cd apps/mobile && ./gradlew ktlintFormat
	@echo "✅ Formatação concluída!"

clean:
	@echo "🧹 Limpando builds e cache..."
	rm -rf node_modules
	rm -rf apps/web/.next
	rm -rf apps/web/out
	rm -rf packages/sdk/dist
	rm -rf services/api/dist
	cd apps/mobile && ./gradlew clean
	$(DOCKER_COMPOSE) down -v
	docker system prune -f
	@echo "✅ Limpeza concluída!"

install:
	@echo "📦 Instalando dependências..."
	npm install
	@echo "✅ Dependências instaladas!"

# Comandos de desenvolvimento local
dev-local:
	@echo "🚀 Iniciando desenvolvimento local (sem Docker)..."
	npm run dev:local

setup:
	@echo "⚙️ Configurando ambiente..."
	cp .env.example .env
	npm install
	@echo "✅ Setup concluído!"

# Comandos utilitários
logs:
	$(DOCKER_COMPOSE) logs -f

status:
	$(DOCKER_COMPOSE) ps

restart:
	$(DOCKER_COMPOSE) restart

stop:
	$(DOCKER_COMPOSE) down

help:
	@echo "📋 Comandos disponíveis:"
	@echo "  make dev        - Inicia ambiente de desenvolvimento"
	@echo "  make build      - Builda todos os projetos"
	@echo "  make test       - Executa todos os testes"
	@echo "  make run        - Roda em modo produção"
	@echo "  make lint       - Executa linting"
	@echo "  make format     - Formata o código"
	@echo "  make clean      - Limpa builds e cache"
	@echo "  make install    - Instala dependências"
	@echo "  make setup      - Configuração inicial"
	@echo "  make logs       - Visualiza logs do Docker"
	@echo "  make status     - Status dos containers"
	@echo "  make restart    - Reinicia containers"
	@echo "  make stop       - Para containers"