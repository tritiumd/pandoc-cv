 docker run --rm --user `id -u`:`id -g` -v .:/workspace ngocptblaplafla/pandoc-texlive-full:latest test.md --template pandoc-cv.html5 -o test.html
