.DEFAULT_GOAL := help
.PHONY: help docker dev dev-sync check-version

%:
	@true

help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

######
# CONFIGURATION
######

MSYS_NO_PATHCONV:=1 # Fix for Windows
ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

IMAGE_NAME=zavoloklom/dclint
IMAGE_TAG=dev

BUILD_VERSION=$(shell awk -F\" '/"version":/ {print $$4}' package.json)
BUILD_DATE=$(shell date +%Y-%m-%dT%T%z)
BUILD_REVISION=$(shell git rev-parse --short HEAD)

######
# MAIN SCRIPTS
######

docker: ## Build docker image.
	docker build --file Dockerfile . --tag ${IMAGE_NAME}:${IMAGE_TAG} \
	  --pull \
	  --build-arg BUILD_DATE=${BUILD_DATE} \
	  --build-arg BUILD_VERSION=${BUILD_VERSION} \
	  --build-arg BUILD_REVISION=${BUILD_REVISION}

dev: docker ## Start development inside container. Note: node_modules, bin, pkg and dist are not synced.
	docker run --rm -it --ipc=host \
	  -v ${PWD}:/var/www/app \
	  --mount type=volume,dst=/var/www/app/node_modules \
	  --mount type=volume,dst=/var/www/app/dist \
	  --mount type=volume,dst=/var/www/app/bin \
	  --mount type=volume,dst=/var/www/app/pkg \
	  ${IMAGE_NAME}:${IMAGE_TAG} /bin/sh

dev-sync: docker ## Start development inside container. Note: all files are synced.
	docker run --rm -it --ipc=host -v ${PWD}:/var/www/app ${IMAGE_NAME}:${IMAGE_TAG} /bin/sh

check-version: docker ## Check version in docker container. Note: all files are not synced.
	docker run --rm -it --ipc=host ${IMAGE_NAME}:${IMAGE_TAG} -v
