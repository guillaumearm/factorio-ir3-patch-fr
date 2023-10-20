BASH=/bin/bash

all: clean test
	@${BASH} package-zip.sh

test:
	@${BASH} test.sh

clean:
	@${BASH} cleanup.sh

.PHONY: all test clean
