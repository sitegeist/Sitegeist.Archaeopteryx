#!/bin/bash

set -x
set -e

docker run -it -v $(pwd):/app -w /app node:16 sh -c "yarn && yarn build"





