IMAGE=lojassimonetti/notificacoes
all:
	docker build --pull . -t $(IMAGE)

push: all
	docker push $(IMAGE)

prisma-diff:
	docker compose exec app npx prisma migrate dev
