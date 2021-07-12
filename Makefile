run: node_modules
	@yarn start

lint:
	@yarn $@

node_modules:
	@yarn


.PHONY: \
	run \
	lint