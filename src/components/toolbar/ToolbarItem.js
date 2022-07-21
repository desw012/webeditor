const default_options = {
    title : undefined,
    value : undefined,
    onclick : undefined,
    className : undefined,
    imageClassName : undefined,
}

const build = (option) => {
    const { title, value, onclick, className, imageClassName } = { ...default_options, ...option};

    const root = document.createElement('li');

    const button = document.createElement('button');
    root.appendChild(button);
    button.type = 'button';
    button.onclick = onclick;

    !!className && ( root.className = className );
    !!title && ( button.title = title );
    !!value && ( button.value = value );
    !!onclick && ( button.onclick = onclick );


    if(imageClassName) {
        const img = document.createElement('img');
        button.appendChild(img);
        img.className = imageClassName;
    }

    return { root, button }
}

export default {
    build : build
}