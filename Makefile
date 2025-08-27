.DEFAULT_GOAL := help
.PHONY: help docker dev dev-sync docker-x check-version

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

dev: docker ## Start development inside container. Note: node_modules, bin, pkg, dist and sea are not synced.
	docker run --rm -it --ipc=host \
	  -v ${PWD}:/app \
	  --mount type=volume,dst=/var/www/app/node_modules \
	  --mount type=volume,dst=/var/www/app/dist \
	  --mount type=volume,dst=/var/www/app/bin \
	  --mount type=volume,dst=/var/www/app/pkg \
	  --mount type=volume,dst=/var/www/app/sea \
	  --entrypoint /bin/sh \
	  ${IMAGE_NAME}:${IMAGE_TAG}

dev-sync: docker ## Start development inside container. Note: all files are synced.
	docker run --rm -it -v ${PWD}:/app --entrypoint /bin/sh ${IMAGE_NAME}:${IMAGE_TAG}

######
# TEST SCRIPTS
######

docker-x: ## Build docker image with build-x.
	docker buildx create --use
	docker buildx build --file Dockerfile . --tag ${IMAGE_NAME}:${IMAGE_TAG} \
  	  --platform linux/amd64,linux/arm64 \
  	  --pull \
  	  --build-arg BUILD_DATE=${BUILD_DATE} \
  	  --build-arg BUILD_VERSION=${BUILD_VERSION} \
  	  --build-arg BUILD_REVISION=${BUILD_REVISION} \
  	  --progress plain

check-version: docker ## Check version in docker container. Note: all files are not synced.
	docker run --rm -it ${IMAGE_NAME}:${IMAGE_TAG} -v

######
# PERFORMANCE SCRIPTS
######

# Shared flags for hyperfine
DCLINT_BIN := ./bin/dclint.cjs
HF_FLAGS := --shell=none --warmup=1 --runs=10 --ignore-failure --style=basic
HYPERFINE_MIN := 1.13.0

perf: hyperfine-check perf-loading perf-single perf-multi

hyperfine-check:
	@command -v hyperfine >/dev/null || { \
	  echo "hyperfine not found. Install >= $(HYPERFINE_MIN)"; exit 1; }
	@v=$$(hyperfine --version | awk '{print $$2}'); \
	  req="$(HYPERFINE_MIN)"; \
	  if [[ "$$(printf "%s\n%s\n" "$$req" "$$v" | sort -V | head -n1)" != "$$req" ]]; then \
	    echo "hyperfine $$v < $$req — please upgrade"; exit 1; \
	  fi

PERF_MULTI_DIR := performance/temp/multi-files
prepare-perf-multi:
	rm -rf $(PERF_MULTI_DIR)
	mkdir -p $(PERF_MULTI_DIR)
	curl -L https://github.com/docker/awesome-compose/archive/18f59bdb09ecf520dd5758fbf90dec314baec545.zip -o $(PERF_MULTI_DIR)/repo.zip
	unzip -q -o $(PERF_MULTI_DIR)/repo.zip -d $(PERF_MULTI_DIR)
	mv $(PERF_MULTI_DIR)/awesome-compose-18f59bdb09ecf520dd5758fbf90dec314baec545/* $(PERF_MULTI_DIR)/
	rm -rf $(PERF_MULTI_DIR)/repo.zip $(PERF_MULTI_DIR)/awesome-compose-18f59bdb09ecf520dd5758fbf90dec314baec545

perf-loading:
	@echo
	hyperfine $(HF_FLAGS) \
	  --command-name 'Loading' \
	  "node $(DCLINT_BIN) --help"

perf-single:
	@echo
	hyperfine $(HF_FLAGS) \
	  --command-name 'Single File' \
	  "node $(DCLINT_BIN) ./mocks/docker-compose.yml"

FILES := $(shell find $(PERF_MULTI_DIR) -type f \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null | wc -l | tr -d ' ')
perf-multi:
	@echo
	hyperfine $(HF_FLAGS) \
	  --command-name "Multi Files (${FILES} files)" \
	  --export-json performance/reports/current/perf-multi.json \
	  "node $(DCLINT_BIN) $(PERF_MULTI_DIR) -r"

# 149.4 ms ±   2.2
# 149.7 ms ±   3.3 ms
# 153.6 ms ±   5.6 ms
# 149.9 ms ±   1.8 ms

# 152.6 ms ±   4.4 ms
# 151.0 ms ±   3.0 ms
# 149.8 ms ±   2.2 ms
