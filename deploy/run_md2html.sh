#!/bin/bash
set -e

# $1 = input dir
# $2 = filename (without extension)
docker run --rm --user `id -u`:`id -g` -v $1:/workspace ngocptblaplafla/pandoc-texlive-full:latest "$2.md" --template ../pandoc/pandoc-cv.html5 -o "$2.html"
