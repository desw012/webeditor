import ColorPalette from "../ColorPalette";

const default_value = {
    parent : undefined,
    title : '',
    id : undefined,
    name : undefined,
    value : undefined,
    type : 'text',
    disabled : false,
    onclick : async (e) => {
        const target = e.currentTarget;

        const colorPalette = new ColorPalette();
        colorPalette.show(target);

        const color = await colorPalette.getReturn();
        target.focus();

        if(color){
            target.value = `${color}`;
            target.style.backgroundColor = `${color}`;
        }
    }
}

const build = (option) => {
    const { parent, title, id, name, value, disabled, onclick } = {...default_value, ...option};

    const root = document.createElement('li');
    root.className = 'w_50';

    const label = document.createElement('label');
    root.appendChild(label);
    label.innerText = title

    const button = document.createElement('button');
    root.appendChild(button);

    button.type = 'button';
    button.className = 'btn_palette_color';

    !!id && (label.htmlFor = id);
    !!id && (button.id = id);
    !!name && (button.name = name);
    !!disabled && (button.disabled = disabled);
    !!value && (button.value = value);
    !!value && (button.style.backgroundColor = value);
    !!onclick && (button.onclick = onclick);

    !!parent && (parent.appendChild(root));

    return {
        root, label, button
    };
}

export default {
    build : build
}