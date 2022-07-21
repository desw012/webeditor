
const _default = {
    parent : undefined,
    title : '',
    id : undefined,
    name : undefined,
    value : undefined,
    type : 'text',
    disabled : false,
    min : undefined,
    max : undefined,
    className : undefined,
}

const build = (option) => {
    const { parent, title, id, name, type, value, disabled, className, min, max } = {..._default, ...option};

    const root = document.createElement('li');

    const label = document.createElement('label');
    root.appendChild(label);
    label.innerText = title

    const wrap = document.createElement('div');
    root.appendChild(wrap);

    let input = document.createElement('input');
    input.type = type;
    wrap.appendChild(input);

    //Event
    if(type === 'number'){
        input.onchange = onchange;
    }

    !!id && (label.htmlFor = id);

    !!id && (input.id = id);
    !!name && (input.name = name);
    !!disabled && (input.disabled = disabled);
    !!value && (input.value = value);

    (min === 0 || !!min) && (input.min = min);
    (max === 0 || !!max) && (input.max = max);

    !!parent && (parent.appendChild(root));
    !!className && (root.className = className)

    return {
        root, label, input
    };
}

const onchange = (e) => {
    let value = Number(e.target.value);
    let min = Number(e.target.min);
    let max = Number(e.target.max);

    if(!isNaN(max) && value > max){
        e.target.value = max;
    }
    if(!isNaN(min) && value < min) {
        e.target.value = min;
    }

}

export default {
    build : build
}