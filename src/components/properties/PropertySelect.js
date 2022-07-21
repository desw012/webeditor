const default_value = {
    parent : undefined,
    title : '',
    id : undefined,
    name : undefined,
    value : undefined,
    type : 'text',
    disabled : false,
    options : []
}

const build = (option) => {
    const { parent, title, id, name, value, disabled, type, options } = {...default_value, ...option};

    const root = document.createElement('li');

    const label = document.createElement('label');
    root.appendChild(label);
    label.innerText = title

    const select = document.createElement('select');
    root.appendChild(select);

    options.forEach(({text, value})=>{
        const option = document.createElement('option');
        select.appendChild(option);

        option.innerText = text;
        option.value = value;
    });

    !!id && (label.htmlFor = id);
    !!id && (select.id = id);
    !!name && (select.name = name);
    !!disabled && (select.disabled = disabled);
    !!value && (select.value = value);

    !!parent && (parent.appendChild(root));

    return {
        root, label, select
    };
}

export default {
    build : build
}