SHELL=/bin/bash

.PHONY: all clean build deploy
default: all

all: clean build

clean:
	rm -rf dist/*

build:
	npm run build

deploy:
	ssh test "rm -rf /home/snail/snail-web/*"
	scp -r dist/* test:/home/snail/snail-web/
