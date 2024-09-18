$(document).ready(function () {
    const data = $("#data");
    const rendered = $("#rendered");

    function getPPI() {
        let div = $("<div>").css("width", "1in").appendTo("body");
        let ppi = window.getComputedStyle(div[0], null).getPropertyValue('width');
        div.remove();
        return parseFloat(ppi);
    }

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

    function printing_support(margin) {
        $("#printing-support").html(`
            .A4 {
                padding: ${margin};
            }`)
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            $("#printing-support").append(`
            @-moz-document url-prefix() {
                @page {
                    margin: ${margin};
                }
                @media print {
                    .A4 {
                        padding: 0;
                        height:auto;
                        width:auto;
                    }
                }
            }
            `)
        }
    }

    function divload(div, temp_a4, container, layer, line_height, content_area, line_per_page) {
        let container_temp = load_layer(container, layer);
        let elements = div.children();
        let temp_float_div = null;
        for (let i = 0; i < elements.length; i++) {
            let new_element = $(elements[i]).clone();
            container_temp.append(new_element);
            if ($(elements[i]).is("h5,h6")) {
                if (temp_float_div === null) {
                    container.append("<div class='temp_float'></div>");
                    temp_float_div = container.children().last();
                }
                temp_float_div.append(new_element);
                if (temp_float_div.children().length > 1) {
                    temp_float_div = null;
                }
            } else {
                temp_float_div = null;
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
                            container_temp = load_layer(container, layer);
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
                        container_temp = load_layer(container, layer)
                        container_temp.append($(new_element))
                    } else {
                        container_temp.append($(new_element))
                        let line_start = 0;
                        let line_end = Math.ceil($(new_element).outerHeight(true) / line_height);
                        $(new_element).css("height", (remaining * line_height) + "px");
                        line_start = remaining
                        while (line_start < line_end) {
                            [temp_a4, container] = new_page(temp_a4);
                            container_temp = load_layer(container, layer)
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
                    [temp_a4, container] = divload($(new_element), temp_a4, container, new_layer, line_height, content_area, line_per_page)
                } else {
                    [temp_a4, container] = new_page(temp_a4);
                    container_temp = load_layer(container, layer)
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
        let temp_float_div = null;
        for (let i = 0; i < elements.length; i++) {
            let new_element = $(elements[i]).clone();
            container.append(new_element);
            if ($(elements[i]).is("h5,h6")) {
                if (temp_float_div === null) {
                    container.append("<div class='temp_float'></div>");
                    temp_float_div = container.children().last();
                }
                temp_float_div.append(new_element);
                if (temp_float_div.children().length > 1) {
                    temp_float_div = null;
                }
                if (container.height() > 0.95*content_area) {
                    [temp_a4, container] = new_page(temp_a4);
                    container.append(temp_float_div);
                }
            } else {
                temp_float_div = null;
            }
            if ($(elements[i]).is("h3,h4") && container.height() > 0.95*content_area) {
                [temp_a4, container] = new_page(temp_a4);
                container.append(new_element);
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
                            if (new_list.children().length === 0) {
                                new_list.remove();
                            }
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
                    [temp_a4, container] = divload($(new_element), temp_a4, container, [$(new_element)], line_height, content_area, line_per_page)
                } else {
                    [temp_a4, container] = new_page(temp_a4);
                    container.append(new_element);
                }
            }
        }
        printing_support($(".A4").css("padding"));
    }

    const render_html = function () {
        rendered.html("");
        // https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/#aa-fout-vs-fout-with-class
        let font_waiting = rendered.css("font-size") + " " + rendered.css("font-family")
        Promise.all([
            document.fonts.load(font_waiting),
            document.fonts.load("14pt 'Font Awesome 6 Free'"),
            document.fonts.load("14pt 'Font Awesome 6 Brands'"),
        ]).then(load);
    }

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

    // button and input for customize in support bar
    $("#rerender").on("click", render_html);
    let font_builtin = {
        "Serif": ["EB Garamond", "Merriweather", "Noto Serif", "Times New Roman", "serif"],
        "Sans-serif": ["Arial", "Inter", "Montserrat", "Noto Sans", "sans-serif"],
        "Monospace": ["JetBrains Mono", "Inconsolata", "Reddit Mono", "monospace"],
    }
    const font_selector = $("#font-selector");
    const font_family = $("#font-family");
    for (let [key, value] of Object.entries(font_builtin)) {
        let optgroup = $(`<optgroup label="${key}"></optgroup>`);
        for (let font of value) {
            optgroup.append(`<option value="${font}" style="font-family: ${font}">${font}</option>`);
            if (rendered.css("font-family").includes(font)) {
                optgroup.children().last().prop("selected", true);
            }
        }
        font_selector.append(optgroup);
    }
    font_selector.select2({tags: true, width: 'resolve', selectionCssClass: "font-selector"});
    font_selector.on("change", function () {
        rendered.css("font-family", $(this).val());
    });
    let start_val = rendered.attr("style");
    const font_size = $("#font-size");
    font_size.val(parseFloat(start_val.match(/(\d*(.\d*)?)pt/g)[0]));
    font_size.on("change", function () {
        rendered.css("font-size", $(this).val() + "pt");
    });
    const font_weight = $("#font-weight");
    font_weight.val(rendered.css("font-weight"));
    font_weight.on("change", function () {
        rendered.css("font-weight", $(this).val());
    });
    const line_height = $("#line-height");
    line_height.val(parseFloat((new RegExp(/line-height:\s?(\d*(.\d*))/)).exec(start_val)[1]));
    line_height.on("change", function () {
        rendered.css("line-height", $(this).val());
    });
    const margin = $("#margin");
    margin.val($("#printing-support").html().match(/padding:\s?(\d*(.\d*)\w*)/)[1]);
    margin.on("change", function () {
        printing_support($(this).val());
        render_html()
    });
    render_html();
});