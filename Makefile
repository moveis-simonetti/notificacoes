IMAGE=lojassimonetti/notificacoes
all:
	docker build --pull . -t $(IMAGE)

push: all
	docker push $(IMAGE)
