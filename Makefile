.PHONY: tests
all: help
SHELL=bash
GITHUB_TOKEN := $(if $(GITHUB_TOKEN),$(GITHUB_TOKEN),$(shell grep GITHUB_TOKEN .env | cut -d '=' -f2))
export GITHUB_TOKEN

# Absolutely awesome: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'


IMAGE=lojassimonetti/notificacoes
docker-build-images: ## Build docker images
	docker build --pull . -t $(IMAGE)

push: all ## Push docker images to registry
	docker push $(IMAGE)

prisma-diff: ## Run prisma migrate dev
	docker compose run --rm app npx prisma migrate dev

studio: ## Run prisma studio
	docker compose run --rm -p 5555:5555 app npx prisma studio

npm-install: ## Install npm dependencies
	cli/run-node-local --interactive npm install

images=
docker-up: ## Start docker containers
	docker compose up -d --remove-orphans $(images)

up: docker-up npm-install prisma-diff ## Start project (docker-up, npm-install, prisma-diff)

.env: ## Create .env file from .env.dist
	cp .env.dist .env

host-aliases: ## Add host aliases to /etc/hosts
	sudo cli/section-edit "notificacoes-aliases" /etc/hosts /dev/stdin <<< "127.0.0.1	notificacoes.test"

setup: host-aliases .env docker-build-images up ## Setup project from scratch

setup-functions: ## Setup Firebase Functions environment
	bash cli/setup-functions.sh
	cd functions && firebase login
	cd functions && firebase use --add
	cd functions && npm install
	cd functions && npm run dev

up-functions: ## Start Firebase Functions emulators
	cd functions && npm run dev
