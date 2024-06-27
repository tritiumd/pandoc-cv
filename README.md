Pandoc-CV: Template cv cho pandoc chuẩn ATS

# Cài đặt

**Khuyến nghị**: Cài đặt docker

**Cách khác**: Cài pandoc rồi copy folder pandoc ở repo vào thư mục data của pandoc. [Hướng dẫn](https://pandoc.org/MANUAL.html#option--data-dir). Đối với các lệnh bên dưới thay cụm `docker run --rm -v .:/workspace ngocptblaplafla/pandoc-texlive-full:latest` thành pandoc

# Sử dụng

**Bước 1**: Điền form ở file `vnframe.yaml` trong folder init  
**Bước 2**: Chạy lệnh sau để có file `pandoc-cv.md`

``` bash
docker run --rm -v .:/workspace ngocptblaplafla/pandoc-texlive-full:latest --metadata-file vnframe.yaml --template pandoc-cv.markdown -o pandoc-cv.md
```

**Bước 3**: Chỉnh sửa file `pandoc-cv.md` theo ý muốn  
**Bước 4**: Xuất bản cv trước khi in

```bash
docker run --rm -v .:/workspace ngocptblaplafla/pandoc-texlive-full:latest pandoc-cv.md --template pandoc-cv.html5 -L pandoc-cv-html-sup.lua -o pandoc-cv.html
```
Ta thu được file `pandoc-cv.html`  
**Bước 5**: Mở `pandoc-cv.html` để xem. Khuyến nghị sử dụng trình duyệt Chrome. Giao diện sẽ có nút `Print / Save PDF` để in hoặc lưu PDF và nút `Rerender` để tải lại trong trường hợp font bị lỗi

Trong trường hợp không có Chrome hoặc các trình duyệt dùng nhân Chromium (**tức chỉ có Safari hoặc Firefox[^1]**) thì trong image đã có sẵn Chrome cho chúng ta dùng. Sử dụng lệnh sau để lấy file PDF

[^1]: Do tính tương thích của trình duyệt, Safari và Firefox chưa hỗ trợ các tính năng [CSS: break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after) của template.

```bash
 docker run --rm -v .:/workspace --entrypoint chromium ngocptblaplafla/pandoc-texlive-full:latest  --headless --no-sandbox --print-to-pdf=pandoc-cv.pdf pandoc-cv.html
```

**Lưu ý:** Đối với Linux, nếu bị lỗi quyền đọc ghi khi sử dụng docker hãy đoạn sau vào sau `docker run`
```
--user `id -u`:`id -g
```

# Thêm

Nêu muốn ngắt trang hãy paste đoạn này vào

```
::: {.page-break}
:::
```

Có thêm xem ví dụ trong folder test
