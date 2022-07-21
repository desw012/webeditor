
const _default = {
    className : undefined,
    parent : undefined
}
const build = (option) => {
    const { parent, className } = {..._default, ...option};;

    const root = document.createElement('div');

    const fieldset = document.createElement('fieldset');
    root.appendChild(fieldset);

    const ul = document.createElement('ul');
    fieldset.appendChild(ul);

    !!className && (root.className = className);

    !!parent && ( parent.appendChild(root) );

    return { root, fieldset, ul };
}

export default {
    build : build
}