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
** Trong trường hợp các header quá dài và bị ngắt dòng, bạn thêm option `--warp none` ở cuối để không bị ngắt.

**Bước 3**: Chỉnh sửa file `pandoc-cv.md` theo ý muốn
**Bước 4**: Xuất bản cv trước khi in

```bash
docker run --rm -v .:/workspace ngocptblaplafla/pandoc-texlive-full:latest pandoc-cv.md --template pandoc-cv.html5 -L pandoc-cv-html-sup.lua -o pandoc-cv.html
```
Ta thu được file `pandoc-cv.html`  
**Bước 5**: Mở `pandoc-cv.html` để xem. Khuyến nghị sử dụng trình duyệt Chrome. Giao diện sẽ có nút `Print / Save PDF` để in hoặc lưu PDF và nút `Rerender` để tải lại trong trường hợp font bị lỗi

Trong trường hợp không có Chrome, Firefox hoặc các trình duyệt dùng nhân Chromium, Firefox để xuất pdf (**ví dụ Safari hoặc Microsoft Edge trên MacOS**) thì trong image đã có sẵn Chrome cho chúng ta dùng. Sử dụng lệnh sau để lấy file PDF

```bash
 docker run --rm -v .:/workspace --entrypoint chromium ngocptblaplafla/pandoc-texlive-full:latest  --headless --no-sandbox --run-all-compositor-stages-before-draw --virtual-time-budget=10000 --print-to-pdf=pandoc-cv.pdf pandoc-cv.html
```

**Lưu ý:** Đối với Linux, nếu bị lỗi quyền đọc ghi khi sử dụng docker hãy đoạn sau vào sau `docker run`
```
--user `id -u`:`id -g`
```

**Trong trường hợp muốn nhanh**: Copy file `command.sh` trong folder `test` vào thư mục làm việc sau đó dùng lệnh sau để chuyển trực tiếp từ yaml sang html

```bash
 docker run --rm -v .:/workspace --entrypoint bash ngocptblaplafla/pandoc-texlive-full:latest command.sh
```

# Thêm

Nêu muốn ngắt trang hãy paste đoạn này vào

```
::: {.page-break}
:::
```

Có thêm xem ví dụ trong folder test
