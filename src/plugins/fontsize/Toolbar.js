import {insertAfter, removeNode} from "../../utils/domUtils";
import {Commands} from "../../core/Command";

export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.execCommand = plugin.context.execCommand;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async (e) => {
        const value = e.currentTarget.value;

        await this.execCommand(Commands.fontSize, value);
        this.execCommand(Commands.focus);
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
        text.innerText = '';
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

        this.fontsize.forEach((fontSize)=>{
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            li.appendChild(button);
            button.value = fontSize;
            button.onclick = this.onClick;

            const span = document.createElement("span");
            button.appendChild(span);
            span.style.fontSize = fontSize;
            span.innerText = fontSize;
        });

        return divLayer;
    }

    updateFontSize = (value) => {
        this.root.querySelector('span').innerText = value;
    }

    fontsize = [
        '7pt',
        '10pt',
        '12pt',
        '14pt',
        '18pt',
        '24pt',
        '36pt',
    ]
}