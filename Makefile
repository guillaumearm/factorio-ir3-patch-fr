BASH=/bin/bash

all: 
	@${BASH} package-zip.sh

test:
	@${BASH} test.sh

clean:
	@${BASH} cleanup.sh

.PHONY: all test clean
