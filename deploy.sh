#!/bin/bash

docker pull node:8.7.0-alpine

IMAGE_NAME=071164079219.dkr.ecr.us-east-1.amazonaws.com/notificacoes

TAG=$(echo $BUILDKITE_BRANCH | sed "s|/|_|g;s|#|_|g")

if [ "$BUILDKITE_BRANCH" = "master" ]; then
    TAG="master-${BUILDKITE_COMMIT}"
fi

eval $(aws ecr get-login)

echo "--- Building Image (webpdv:$TAG)"
docker build -t "$IMAGE_NAME:$TAG" .
if [ ! $? -eq 0 ]; then
    exit 1
fi

echo "--- Pushing Images ($TAG)"
docker push "$IMAGE_NAME:$TAG"

if [ "$BUILDKITE_BRANCH" = "master" ]; then
    echo "--- Pushing Latest Images"
    docker tag "$IMAGE_NAME:$TAG" "$IMAGE_NAME:latest"
    docker push "$IMAGE_NAME:latest"
fi
