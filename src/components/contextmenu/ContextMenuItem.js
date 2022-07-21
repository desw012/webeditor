const default_options = {
    parent : undefined,
    title : '',
    onclick : undefined
}

const build = (option) => {
    const { parent, title, onclick } = { ...default_options, ...option};

    const root = document.createElement('li');

    const button = document.createElement('button');
    root.appendChild(button);
    button.type = 'button';

    !!parent && (parent.appendChild(root));

    !!title && (button.innerText = title);
    !!onclick && (button.onclick = onclick);

    return { root, button }
}

export default {
    build : build
}