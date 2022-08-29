HOSTNAME=theflies

CONTAINERS=node dotnet jvm java python ruby alt rust julia systems dart crystal ocaml swift haskell objc go lua esolangs chapel nim r erlang elixir powershell gradle solidity

ALL_CONTAINERS=${CONTAINERS} base

.PHONY: ${ALL_CONTAINERS} clean docker_rm docker_rmi

all: ${CONTAINERS}

recent: ${RECENT_CONTAINERS}

base:
	cp docker/$@.docker ./Dockerfile
	# docker build -t $(HOSTNAME)/$@-runner .
	podman build -t $(HOSTNAME)/$@-runner .

${CONTAINERS}:
	cp docker/$@.docker ./Dockerfile
	podman build -t $(HOSTNAME)/$@-runner .

# Kill all of the in-flight and exited docker containers
docker_rm:
	podman ps -q | xargs podman stop
	[ ! -n "$(shell podman ps -a -q)" ] || echo $(shell podman ps -a -q) | xargs -n 1 podman rm -f

# Kill all docker images
docker_rmi: docker_rm
	podman rmi $(podman images -q -f dangling=true)

clean: docker_rmi

deep-clean: docker_rmi

push:
	docker push theflies/base-runner
	docker push theflies/node-runner
	docker push theflies/ruby-runner
	docker push theflies/python-runner
	docker push theflies/dotnet-runner
	docker push theflies/jvm-runner
	docker push theflies/java-runner
	docker push theflies/haskell-runner
	docker push theflies/systems-runner
	docker push theflies/erlang-runner
	docker push theflies/alt-runner
	docker push theflies/rust-runner
	docker push theflies/crystal-runner
	docker push theflies/dart-runner
	docker push theflies/ocaml-runner
	docker push theflies/objc-runner
	docker push theflies/swift-runner || true

pull:
	docker pull theflies/base-runner
	docker pull theflies/node-runner
	docker pull theflies/ruby-runner
	docker pull theflies/python-runner
	docker pull theflies/dotnet-runner
	docker pull theflies/jvm-runner
	docker pull theflies/java-runner
	docker pull theflies/haskell-runner
	docker pull theflies/systems-runner
	docker pull theflies/erlang-runner
	docker pull theflies/alt-runner
	docker pull theflies/rust-runner
	docker pull theflies/crystal-runner
	docker pull theflies/dart-runner
	docker pull theflies/ocaml-runner
	docker pull theflies/objc-runner
	docker pull theflies/swift-runner || true
