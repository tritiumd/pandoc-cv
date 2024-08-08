local function stringify(v)
    pstringify = (require 'pandoc.utils').stringify
    if (v ~= nil or v ~= '')
    then
        return pstringify(v)
    else
        return ''
    end
end

function Pandoc(doc)
    template={
        ['-1']=[[
$if(name)$# $name$$endif$

$if(position)$## $position$$endif$

]],
        ['0']=[[
$if(name)$### $name$$endif$

$if(data)$$data$$endif$

]],
        ['1']=[[
$if(name)$### $name$$endif$

$for(data)$
- $data$
$endfor$

]],
        ['2']=[[
$if(name)$### $name$$endif$

::: {.horizontal-list}
$for(data)$
- $data$
$endfor$
:::

]],
        ['3']=[[
$if(name)$### $name$$endif$
$for(data)$

$if(data.left-info)$##### $data.left-info$$endif$

$if(data.right-info)$##### $data.right-info$$endif$

$for(data.extra)$
- $data.extra$
$endfor$
$endfor$
        ]],
        ['4']=[[
$if(name)$### $name$$endif$
$for(data)$

$if(data.left-info)$##### $data.left-info$$endif$

$if(data.right-info)$###### $data.right-info$$endif$

$for(data.extra)$
- $data.extra$
$endfor$
$endfor$
        ]],
        ['5']=[[
$if(name)$### $name$$endif$

$for(data)$

$if(data.group)$#### $data.group$$endif$
$for(data.data)$

$if(data.data.left-info)$##### $data.data.left-info$$endif$

$if(data.data.right-info)$##### $data.data.right-info$$endif$

$for(data.data.extra)$
- $data.data.extra$
$endfor$
$endfor$
$endfor$
        ]],
        ['6']=[[
$if(name)$### $name$$endif$

$for(data)$

$if(data.group)$#### $data.group$$endif$
$for(data.data)$

$if(data.data.left-info)$##### $data.data.left-info$$endif$

$if(data.data.right-info)$###### $data.data.right-info$$endif$

$for(data.data.extra)$
- $data.data.extra$
$endfor$
$endfor$
$endfor$
        ]],
        ['7']=[[
$if(name)$### $name$$endif$

$for(data)$
- []{$data.icon-class$} $data.content$
$endfor$

]],
        ['8']=[[
$if(name)$### $name$$endif$

::: {.horizontal-list}
$for(data)$
- []{$data.icon-class$} $data.content$
$endfor$
:::

]]
    }

    for key,_ in pairs(template) do
        template[key] = pandoc.template.compile(template[key])
    end

    local data = doc.meta.data
    local body = doc.blocks
    local meta = doc.meta.config

    -- compile header info
    compiled = pandoc.write(pandoc.Pandoc({}, data['header-info']),
            'markdown', {template = template['-1']})
    table.insert(body,pandoc.RawBlock('markdown',compiled))
    -- compile data sections
    for _,i in ipairs(data['data-sections']) do
        compiled = pandoc.write(pandoc.Pandoc({}, i),
                'markdown', {template = template[stringify(i['style'])]})
        table.insert(body,pandoc.RawBlock('markdown',compiled))
    end
    return pandoc.Pandoc(body,meta)
end