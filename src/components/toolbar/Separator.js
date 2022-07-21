const build = ( ) => {
    const root = document.createElement('li');

    const div1 = document.createElement("div");
    root.appendChild(div1);
    div1.className = 'toolbar-separator';

    const div = document.createElement("div");
    div1.appendChild(div);

    return { root }
}

export default {
    build : build
}