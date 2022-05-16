import {insertAfter, removeNode} from "../../utils/domUtils";

export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.build();

        this.defaultValue = this.plugin.context.config.LINE_HEIGHT;
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async (e) => {
        const value = e.currentTarget.value;

        await this.plugin.lineHeight(value);
        await this.plugin.ui.focus();
    }

    build() {
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item toolbar-select';
        button.type = 'button';
        button.title = 'FontSize';
        button.value = 'FontSize';
        button.onclick = (e) => {
            const fontSizeSelect = this.buildSelectDiv();
            insertAfter(fontSizeSelect, button);

            fontSizeSelect.addEventListener('focusout', (e)=>{
                if(!(e.relatedTarget && fontSizeSelect.contains(e.relatedTarget)) ){
                    removeNode(fontSizeSelect);
                }
            });
            fontSizeSelect.focus();
        }

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = this.defaultValue
    }

    buildSelectDiv = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'div_layer';
        divLayer.tabIndex = -1;

        const wrap = document.createElement("div");
        divLayer.appendChild(wrap);
        wrap.className = 'layer_select';

        const ul = document.createElement("ul");
        wrap.appendChild(ul);

        this.lineHeight.forEach((lineHeight)=>{
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            li.appendChild(button);
            button.onclick = this.onClick;
            button.value = lineHeight;

            const span = document.createElement("span");
            button.appendChild(span);
            span.innerText = lineHeight;
        });

        return divLayer;
    }

    update = (value) => {
        this.root.querySelector('span').innerText = value;
    }

    lineHeight = [
        '50%',
        '80%',
        '100%',
        '120%',
        '150%',
        '160%',
        '180%',
        '200%'
    ]
}