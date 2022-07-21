const default_options = {
    parent : undefined
}

const build = ( option ) => {
    const { parent } = { ...default_options, ...option};

    const hr = document.createElement('hr')

    !!parent && ( parent.appendChild(hr) );

    return {
        hr
    }

}

export default {
    build : build
}