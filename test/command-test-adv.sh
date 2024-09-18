echo "" | pandoc --metadata-file vnframe-adv2.yaml --template default.markdown -L pandoc-cv-adv.lua -w markdown | pandoc  --template pandoc-cv.html5 -L pandoc-cv-html-sup.lua -o test-adv.html
