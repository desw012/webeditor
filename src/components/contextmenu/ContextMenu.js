const default_options = {
    className : 'popup contextmenu focus-visible-none'
}

const build = (option) => {
    const { className } = { ...default_options, ...option};

    const root = document.createElement('div');
    root.tabIndex = -1;
    !!className && (root.className = className);

    //content
    const content = document.createElement('ul');
    root.appendChild(content);
    content.className = 'content';

    const ul = document.createElement('ul');
    content.appendChild(ul);

    return { root, content, ul}
}

export default {
    build : build
}