BASH=/bin/bash

all: 
	${BASH} package-zip.sh

test:
	${BASH} test.sh

.PHONY: all test
