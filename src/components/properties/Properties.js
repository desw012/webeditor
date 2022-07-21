import {t} from "i18next";

const default_options = {
    className : undefined,
    titleName : undefined,
}

const build = (option) => {
    const { className, titleName } = { ...default_options, ...option};

    const root = document.createElement('div');
    root.tabIndex = -1;
    root.className = `popup`;
    !!className && (root.className = className);

    const header = document.createElement('div');
    root.appendChild(header);
    header.className = 'header';
    !!titleName && (header.innerText = titleName);

    //content
    const content = document.createElement('div');
    root.appendChild(content);
    content.className = 'content';

    const form = document.createElement('form');
    content.appendChild(form);

    //footer
    const footer = document.createElement('div');
    root.appendChild(footer);
    footer.className = 'footer';

    const button_apply = document.createElement('button');
    footer.appendChild(button_apply);
    button_apply.type = 'button';
    button_apply.innerText = t('properties.apply');

    const button_cancel = document.createElement('button');
    footer.appendChild(button_cancel);
    button_cancel.type = 'button';
    button_cancel.innerText = t('properties.cancel');



    return { root, header, content, form, button_apply, button_cancel };
}

export default {
    build : build
}