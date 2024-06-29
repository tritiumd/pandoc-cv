$(document).ready(function () {
    const data = $("#data");
    const rendered = $("#rendered");

    function new_page(temp_a4) {
        let container = $('<div class="container"></div>');
        if (temp_a4 == null) {
            temp_a4 = $('<div class="A4"></div>');
            temp_a4.append(container);
        } else {
            temp_a4_t = $('<div class="A4"></div>');
            temp_a4.after(temp_a4_t);
            temp_a4 = temp_a4_t;
            temp_a4.append($('<div class="page-break"></div>'));
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
        for (let i = 0; i < elements.length; i++) {
            let new_element = $(elements[i]).clone();
            container.append(new_element);
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
                            bottom_part.css("max-height", (Math.ceil(line_start +  line_per_page)*line_height) + "px");
                            let printed_line = Math.ceil($(bottom_part).outerHeight(true) / line_height);
                            if (line_start+printed_line<line_end){
                                printed_line -=1
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
        load();
        $(".container h5 + h5:has(+ h5 + h5),.container h5 + h6").after("<div class='hbreak'></div>");
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