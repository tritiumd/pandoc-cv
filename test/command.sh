echo "" | pandoc --data-dir /pandoc --metadata-file vnframe.yaml --template pandoc-cv.markdown | pandoc --data-dir /pandoc --template pandoc-cv.html5 -L pandoc-cv-html-sup.lua -o pandoc-cv-test.html