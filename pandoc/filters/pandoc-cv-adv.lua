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
# $name$

## $position$

]],
        ['0']=[[
### $name$

$data$

]],
        ['1']=[[
### $name$

 $for(data)$
- $data$
$endfor$

]],
        ['2']=[[
### $name$

::: {.horizontal-list}
$for(data)$
- $data$
$endfor$
:::

]],
        ['3']=[[
### $name$

$for(data)$
##### $data.left-info$

##### $data.right-info$

$for(data.extra)$
- $data.extra$
$endfor$
$endfor$
        ]],
        ['4']=[[
### $name$

$for(data)$
##### $data.left-info$

###### $data.right-info$

$for(data.extra)$
- $data.extra$
$endfor$
$endfor$
        ]],
        ['5']=[[
### $name$

$for(data)$

#### $data.group$

$for(data.data)$
##### $data.data.left-info$

##### $data.data.right-info$

$for(data.data.extra)$
- $data.data.extra$
$endfor$
$endfor$
$endfor$
        ]],
        ['6']=[[
### $name$

$for(data)$

#### $data.group$

$for(data.data)$
##### $data.data.left-info$

###### $data.data.right-info$

$for(data.data.extra)$
- $data.data.extra$
$endfor$
$endfor$
$endfor$
        ]],
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