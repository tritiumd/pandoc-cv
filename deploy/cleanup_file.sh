#!/bin/bash
set -e

# $1 = input dir
# $2 = filename (without extension)

rm "$1/$2.md"
rm "$1/$2.html"