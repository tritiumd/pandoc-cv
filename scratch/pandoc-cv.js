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

    function load_layer(container, layer) {
        if (Array.isArray(layer) && layer.length) {
            let container_temp;
            for (let i = 0; i < layer.length; i++) {
                container_temp = layer[i].clone();
                container.append(container_temp);
                container_temp.html("");
                container = container_temp
            }
            return container
        }
    }

    function divload(div, temp_a4, container, layer,line_height,content_area, line_per_page) {
        let container_temp = load_layer(container,layer);
        let elements = div.children();
        let float = 0;
        for (let i = 0; i < elements.length; i++) {
            let new_element = $(elements[i]).clone();
            container_temp.append(new_element);
            if ($(elements[i]).css("float") !== "none" && $(new_element).is("h5,h6")) {
                float += 1;
            }
            if (float === 2) {
                float = 0;
                container_temp.append($("<div></div>"));
            }
            if ($(elements[i]).hasClass("page-break")) {
                container.children().last().remove();
                [temp_a4, container] = new_page(temp_a4);
            } else if (container.height() > content_area) {
                if ($(new_element).is("ul,ol")) {
                    container_temp.children().last().remove();
                    let lis = new_element.children();
                    let j = 0;
                    let tag = $(new_element).prop("tagName");
                    let new_list = $(`<${tag}></${tag}>`);
                    container_temp.append(new_list);
                    while (j < lis.length) {
                        new_list.append(lis[j]);
                        if (container.height() > content_area) {
                            new_list.children().last().remove();
                            [temp_a4, container] = new_page(temp_a4);
                            container_temp = load_layer(container,layer);
                            j--;
                            new_list = $(`<${tag}></${tag}>`);
                            container_temp.append(new_list);
                        }
                        j++;
                    }
                } else if ($(new_element).is("p")) {
                    container_temp.children().last().remove();
                    let remaining = Math.floor((content_area - container.height()) / line_height);
                    if (remaining <= 0) {
                        [temp_a4, container] = new_page(temp_a4);
                        container_temp = load_layer(container,layer)
                        container_temp.append($(new_element))
                    } else {
                        container_temp.append($(new_element))
                        let line_start = 0;
                        let line_end = Math.ceil($(new_element).outerHeight(true) / line_height);
                        $(new_element).css("height", (remaining * line_height) + "px");
                        line_start = remaining
                        while (line_start < line_end) {
                            [temp_a4, container] = new_page(temp_a4);
                            container_temp = load_layer(container,layer)
                            let bottom_part = $(new_element).clone();
                            container_temp.append(bottom_part);
                            bottom_part.css("margin-top", (-line_start * line_height) + "px");
                            bottom_part.css("height", "");
                            bottom_part.css("max-height", (Math.ceil(line_start + line_per_page) * line_height) + "px");
                            let printed_line = Math.ceil($(bottom_part).outerHeight(true) / line_height);
                            if (line_start + printed_line < line_end) {
                                printed_line -= 1;
                            }
                            line_start += printed_line;
                        }
                    }
                } else if ($(new_element).is("div")) {
                    container_temp.children().last().remove();
                    let new_layer = layer.clone();
                    new_layer.append($(new_element));
                    [temp_a4, container] = divload($(new_element), temp_a4, container, new_layer,line_height,content_area, line_per_page)
                } else {
                    [temp_a4, container] = new_page(temp_a4);
                    container_temp = load_layer(container,layer)
                    container_temp.append(new_element);
                }
            }
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
                } else if ($(new_element).is("div")) {
                    container.children().last().remove();
                    [temp_a4, container] = divload($(new_element), temp_a4, container, [$(new_element)],line_height,content_area, line_per_page)
                } else {
                    [temp_a4, container] = new_page(temp_a4);
                    container.append(new_element);
                }
            }
        }
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            let margin = $(".A4").css("padding");
            $("#printing-support").html(`
            .A4 {
                padding: ${margin};
            }
            @-moz-document url-prefix() {
                @page {
                    margin: ${margin};
                }
                @media print {
                    .A4 {
                        padding: 0;
                    }
                }
            }
            `)
        }
    }

    const render_html = function () {
        rendered.html("");
        // https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/#aa-fout-vs-fout-with-class
        let font_waiting = rendered.css("font-weight") + " " + rendered.css("font-size")
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
    });
});