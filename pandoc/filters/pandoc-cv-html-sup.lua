function Meta(meta)
    support_header = [[
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap">
<!-- https://jsfiddle.net/kmq736ut/ -->
<style>
    .A4 {
        background: white;
        width: 21cm;
        height: 29.7cm;
        display: block;
        padding: 1.5cm;
        margin: 0.5cm auto;
        box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
        overflow: hidden;
        box-sizing: border-box;
        font-size: 11pt !important;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
    }

    @page {
        size: A4;
        margin: 0;
    }

    @media print {
        .page-break {
            display: block;
            page-break-before: always;
        }

        body {
            margin: 0;
            padding: 0;
        }

        .A4 {
            box-shadow: none;
            margin: 0;
            width: auto;
            height: auto;
        }

        #data, .noprint {
            display: none;
        }

        .enable-print {
            display: block;
        }
    }

    h1, h2 {
        text-align: center;
        margin: 3mm;
    }

    h1 {
        font-size: 1.5em !important;
    }

    h2 {
        font-size: 1.25em !important;
    }

    #info > ul {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        padding: 0;
        gap: 0.75mm
    }

    #info > ul > li {
        display: inline;
        flex-basis: fit-content;
    }

    p, ul {
        margin: 2mm 0;
    }

    h3 {
        font-size: 1.2em !important;
        margin: 3mm 0;
        padding-bottom: 1mm;
        padding-left: 1mm;
        padding-right: 3mm;
        width: fit-content;
        border-bottom: #1a1a1a solid 0.75mm;
    }

    p {
        text-indent: 14pt;
        margin-left: 14pt;
        text-align: justify;
        overflow: hidden;
    }

    h4 {
        font-size: 1.1em !important;
        margin-top: 2mm;
        margin-bottom: 1.5mm;
    }

    h5, h6 {
        font-size: 1em !important;
        display: inline;
        margin: 0 0 1mm 14pt;
    }

    h5 + h6 {
        display: block;
        float: right;
    }

    h5:has(+ h6) {
        display: block;
        float: left;
    }

    h5 + h6 + * {
        display: inline-block;
        width: 97%;
        margin-top: 0;
    }

    h5 + h5:has(+ h5 + h5):after {
        content: "\A";
        display: block;
        margin-bottom: 3mm;
    }

    #data {
        display: none;
    }

    .container{
        overflow: hidden;
    }
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    ]]
    meta.support_header = pandoc.RawBlock("html",support_header)
    support_footer = [[
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script>
    $(document).ready(function () {
        const data = $("#data");
        const rendered = $("#rendered");
        function new_page(temp_a4){
            let container;
            if (temp_a4 == null) {
                temp_a4 = $('<div class="A4"></div>');
                container = $('<div></div>');
                temp_a4.append(container);
            }
            else {
                temp_a4_t = $('<div class="A4"></div>');
                temp_a4.after(temp_a4_t);
                temp_a4 = temp_a4_t;
                temp_a4.append($('<div class="page-break"></div>'));
                container = $('<div class="container"></div>');
                temp_a4.append(container);
            }
            return [temp_a4, container];
        }
        function load() {
            let temp_a4, container;
            [temp_a4, container] = new_page(null);
            rendered.append(temp_a4);
            const content_area = $(temp_a4).height();
            let elements = data.children();
            for (let i = 0; i < elements.length; i++) {
                let new_element = $(elements[i]).clone();
                container.append(new_element);
                if ($(elements[i]).hasClass("page-break")){
                    container.children().last().remove();
                    [temp_a4, container] = new_page(temp_a4);
                }
                else if (container.height() > content_area) {
                    if ($(new_element).is("ul,ol")) {
                        container.children().last().remove();
                        let lis = new_element.children();
                        let j = 0;
                        let tag = $(new_element).prop("tagName");
                        let new_list = $(`<${tag}></${tag}>`);
                        container.append(new_list);
                        while (j < lis.length) {
                            new_list.append(lis[j]);
                            if (container.height() > content_area) {
                                new_list.children().last().remove();
                                [temp_a4, container] = new_page(temp_a4);
                                j--;
                                new_list = $(`<${tag}></${tag}>`);
                                container.append(new_list);
                            }
                            j++;
                        }
                    } else if ($(new_element).is("p")) {
                        let true_height = $(new_element).outerHeight(true);
                        let line_height = 1.5 * parseFloat($(new_element).css('font-size'));
                        let prev_height = true_height + Math.floor((content_area - container.height())
                                / line_height) * line_height;
                        $(new_element).css("height", prev_height + "px");
                        [temp_a4, container] = new_page(temp_a4);
                        let bottom_p = $(new_element).clone()
                        container.append(bottom_p)
                        bottom_p.css("margin-top",(-prev_height)+"px")
                        bottom_p.css("height","")
                        bottom_p.css("width",$(new_element).width())

                    } else {
                        [temp_a4, container] = new_page(temp_a4);
                        container.append(new_element);
                    }
                }
            }
            $(".A4 div h5 + h6 + *").before("<br>")
        }

        load();
        $("#rerender").on("click", function () {
            rendered.html("");
            load();
        })
    });
</script>
    ]]
    meta.support_footer = pandoc.RawBlock("html",support_footer)
    return meta
end