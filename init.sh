#!/bin/sh

# start docker image and copy out files to a volume named "data"
docker run --rm -it -v $(pwd)/data:/data my-discord-bot /bin/bash -c "cp -r * /data/"