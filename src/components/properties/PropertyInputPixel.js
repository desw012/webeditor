const default_value = {
    parent : undefined,
    title : '',
    id : undefined,
    name : undefined,
    value : undefined,
    disabled : false,
    min : undefined,
    max : undefined
}

const build = (option) => {
    const { parent, title, id, name, value, disabled, min, max} = {...default_value, ...option};

    const root = document.createElement('li');
    root.className = 'w_50';

    const label = document.createElement('label');
    root.appendChild(label);
    label.innerText = title

    const input_wrap = document.createElement('div');
    root.appendChild(input_wrap);
    input_wrap.className = 'property_input_px';

    let input = document.createElement('input');
    input.type = 'number';
    input_wrap.appendChild(input);

    !!id && (label.htmlFor = id);
    !!id && (input.id = id);
    !!name && (input.name = name);
    !!disabled && (input.disabled = disabled);
    !!value && (input.value = value);
    !!min && (input.min = min);
    !!max && (input.max = max);

    !!parent && (parent.appendChild(root));

    return {
        root, label, input
    };
}

export default {
    build : build
}