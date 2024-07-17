#!/bin/bash
set -e

# $1 = input dir
# $2 = filename (without extension)
# docker run --rm --user `id -u`:`id -g` -v $1:/workspace ngocptblaplafla/pandoc-texlive-full:latest "$2.md" --template ../pandoc/pandoc-cv.html5 -o "$2.html"
docker run --user 1008:1008 --rm -v $1:/workspace ngocptblaplafla/pandoc-texlive-full:latest "$2.md" --template ../pandoc/templates/pandoc-cv.html5 -L pandoc-cv-html-sup.lua -o "$2.html"

