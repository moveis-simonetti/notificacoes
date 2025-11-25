IMAGE=lojassimonetti/notificacoes
all:
	docker build --pull . -t $(IMAGE)

push: all
	docker push $(IMAGE)

prisma-diff:
	docker compose run --rm app npx prisma migrate dev

studio:
	docker compose run --rm -p 5555:5555 app npx prisma studio

npm-install:
	cli/run-node-local --interactive npm install

images=
docker-up:
	docker compose up -d --remove-orphans $(images)

up: docker-up npm-install prisma-diff
