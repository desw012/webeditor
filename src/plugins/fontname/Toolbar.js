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

        await this.execCommand(Commands.fontName, value);
        this.execCommand(Commands.focus);
    }

    build() {
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item toolbar-select';
        button.type = 'button';
        button.title = 'FontName';
        button.value = 'FontName';
        button.onclick = (e) => {
            const fontSelect = this.buildSelectDiv();
            insertAfter(fontSelect, button);

            fontSelect.addEventListener('focusout', (e)=>{
                if(!(e.relatedTarget && fontSelect.contains(e.relatedTarget)) ){
                    removeNode(fontSelect);
                }
            });
            fontSelect.focus();
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

        this.font.forEach((font)=>{
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            li.appendChild(button);
            button.value = font;
            button.onclick = this.onClick;

            const span = document.createElement("span");
            button.appendChild(span);
            span.style.fontFamily = font;
            span.innerText = font;
        });

        return divLayer;
    }

    updateFontName = (value) => {
        this.root.querySelector('span').innerText = value;
    }

    font = [
        '굴림',
        '굴림체',
        '돋움',
        '돋움체',
        '바탕',
        '바탕체',
        '궁서',
        '궁서체',
        '맑은 고딕',
        'Arial',
        'Arial Black',
        'Century Gothic',
        'Comic Sans MS'
    ]
}