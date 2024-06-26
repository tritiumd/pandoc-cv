function Meta(meta)
    support_header = [[
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap">
<!-- https://jsfiddle.net/kmq736ut/ -->
<style>
/* Thank ngocptblaplafla for helping me css */
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

h3 {
    font-size: 1.2em !important;
    margin: 3mm 0;
    padding-bottom: 1mm;
    padding-left: 1mm;
    padding-right: 3mm;
    width: fit-content;
    border-bottom: #1a1a1a solid 0.75mm;
}

h4 {
    font-size: 1.1em !important;
    margin-top: 2mm;
    margin-bottom: 1.5mm;
}

h5, h6 {
    font-size: 1em !important;
    display: block;
    margin: 0 0 1mm 14pt;
    float: left;
}

h6 {
    float: right;
    text-align: right;
}

#data {
    display: none;
    width: 21cm;
}

p, ul, ol, div {
    overflow: hidden;
    width: 97%;
}

p {
    text-indent: 14pt;
    margin: 2mm 0 2mm 14pt;
    text-align: justify;
}

ul {
    margin: 2mm 0;
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

h5 + h5 + div {
    height: 1mm;
}

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
}

.container {
    width: 100%;
}

@page {
    size: A4;
    margin: 0;
}

@media print {
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

    .page-break {
        display: block;
        break-after: page;
    }

    #data, .noprint {
        display: none;
    }

    .enable-print {
        display: block;
    }
}

@-moz-document url-prefix() {
    @page {
        margin: 1.5cm;;
    }
    @media print {
        .A4 {
            padding: 0;
        }
    }
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

    function new_page(temp_a4) {
        let container = $('<div class="container"></div>');
        if (temp_a4 == null) {
            temp_a4 = $('<div class="A4"></div>');
            temp_a4.append(container);
        } else {
            temp_a4.append($('<div class="page-break"></div>'));
            temp_a4_t = $('<div class="A4"></div>');
            temp_a4.after(temp_a4_t);
            temp_a4 = temp_a4_t;
            temp_a4.append(container);
        }
        return [temp_a4, container];
    }

    function load() {
        let temp_a4, container;
        [temp_a4, container] = new_page(null);
        rendered.append(temp_a4);
        const line_height = parseFloat(rendered.css('line-height'));
        const content_area = $(temp_a4).height() - 0.25 * parseFloat($(temp_a4).css("padding-bottom"));
        const line_per_page = content_area / line_height;
        let elements = data.children();
        let float = 0
        for (let i = 0; i < elements.length; i++) {
            let new_element = $(elements[i]).clone();
            container.append(new_element);
            if ($(elements[i]).css("float") !== "none") {
                float += 1;
            }
            if (float === 2) {
                float = 0;
                container.append($("<div></div>"))
            }
            if ($(elements[i]).hasClass("page-break")) {
                container.children().last().remove();
                [temp_a4, container] = new_page(temp_a4);
            } else if (container.height() > content_area) {
                if ($(new_element).is("ul,ol,p,div")) {
                    container.children().last().remove();
                    let remaining = Math.floor((content_area - container.height()) / line_height);
                    if (remaining <= 0) {
                        [temp_a4, container] = new_page(temp_a4);
                        container.append($(new_element))
                    } else {
                        container.append($(new_element))
                        let line_start = 0;
                        let line_end = Math.ceil($(new_element).outerHeight(true) / line_height);
                        $(new_element).css("height", (remaining * line_height) + "px");
                        line_start = remaining
                        while (line_start < line_end) {
                            [temp_a4, container] = new_page(temp_a4);
                            let bottom_part = $(new_element).clone();
                            container.append(bottom_part);
                            bottom_part.css("margin-top", (-line_start * line_height) + "px");
                            bottom_part.css("height", "");
                            bottom_part.css("max-height", (Math.ceil(line_start + line_per_page) * line_height) + "px");
                            let printed_line = Math.ceil($(bottom_part).outerHeight(true) / line_height);
                            if (line_start + printed_line < line_end) {
                                printed_line -= 1
                            }
                            line_start += printed_line
                        }
                    }
                } else {
                    [temp_a4, container] = new_page(temp_a4);
                    container.append(new_element);
                }
            }
        }
    }

    const render_html = function () {
        rendered.html("");
        // https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/#aa-fout-vs-fout-with-class
        let font_waiting =  rendered.css("font-weight") + " " + rendered.css("font-size")
            + " " + rendered.css("font-family")
        Promise.all([
            document.fonts.load(font_waiting),
            document.fonts.load("14pt 'Font Awesome 6 Free'"),
            document.fonts.load("14pt 'Font Awesome 6 Brands'"),
        ]).then(load);
    }
    render_html()
    $("#rerender").on("click", render_html);
    const observer = new MutationObserver(render_html);
    data.each(function () {
        observer.observe(this, {childList: true, characterData: true, attributes: false});
    })
    rendered.each(function () {
        observer.observe(this, {
            childList: false,
            characterData: false,
            attributes: true,
            attributeFilter: ['style']
        });
    })
});
</script>
    ]]
    meta.support_footer = pandoc.RawBlock("html",support_footer)
    return meta
end