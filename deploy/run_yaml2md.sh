#!/bin/bash
set -e

# $1 = input dir
# $2 = filename (without extension)
docker run --user 1008:1008 --rm -v $1:/workspace ngocptblaplafla/pandoc-texlive-full:latest --metadata-file "$2.yaml" --template pandoc/templates/pandoc-cv.markdown -o "$2.md"

# pandoc --metadata-file "$1/$2.yaml" --template ../pandoc/templates/pandoc-cv.markdown -o "$1/$2.md"

