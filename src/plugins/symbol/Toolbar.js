import { insertAfter, removeNode } from "../../utils/domUtils";
import {Commands} from "../../core/Command";

export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async (e) => {
        const value = e.currentTarget.value;
        this.plugin.command.emit(Commands.insertText, value);
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'InsertSymbol';
        button.value = 'InsertSymbol';
        button.onclick = this.showSelectDiv;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'S';
    }

    showSelectDiv = () => {
        const selectDiv = this.buildSelectDiv();
        this.root.appendChild(selectDiv)

        selectDiv.addEventListener('focusout', (e)=>{
            if(!(e.relatedTarget && selectDiv.contains(e.relatedTarget)) ){
                this.root.removeChild(selectDiv);
            }
        });
        selectDiv.focus();
    }

    buildSelectDiv = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'div_layer';
        divLayer.tabIndex = -1;

        const wrap = document.createElement("div");
        divLayer.appendChild(wrap);
        wrap.className = 'layer_symbol_select';

        this.symbol.forEach((symbol)=>{
            const item = document.createElement("div");
            wrap.appendChild(item);

            const button = document.createElement("button");
            item.appendChild(button);
            button.value = symbol;
            button.onclick = this.onClick;

            const span = document.createElement("span");
            button.appendChild(span);
            span.innerText = symbol;

        });

        return divLayer;
    }

    symbol = [
        '、',
        '。',
        '·',
        '‥',
        '…',
        '¨',
        '〃',
        '‖',
        '˚',
        '˝',
        '¿',
        '〔',
        '〕',
        '〈',
        '〉',
        '《',
        '》',
        '「',
        '」',
        '『',
        '』',
        '【',
        '】',
        '±',
        '×',
        '÷',
        '≠',
        '∞',
        '≤',
        '≥',
        '∴',
        '♂',
        '♀',
        '∠',
        '⊥',
        '∂',
        '∇',
        '≡',
        '≒',
        '≪',
        '≫',
        '√',
        '∝',
        '∫',
        '∬',
        '∵',
        '∈',
        '∋',
        '⊆',
        '⊇',
        '⊂',
        '⊃',
        '∪',
        '∩',
        '∧',
        '∨',
        '∀',
        '∮',
        '∑',
        '∏',
        '℃',
        '℉',
        '￦',
        '€',
        '＄',
        '£',
        '¥',
        '※',
        '☆',
        '★',
        '○',
        '●',
        '◎',
        '◇',
        '◆',
        '□',
        '■',
        '△',
        '▲',
        '▽',
        '▼',
        '→',
        '←',
        '↑',
        '↓',
        '↔',
        '◁',
        '◀',
        '▷',
        '▶',
        '♤',
        '♠',
        '♡',
        '♥',
        '♧',
        '♣',
        '◈',
        '▣',
        '◐',
        '◑',
        '♨',
        '☏',
        '☎',
        '☜',
        '☞',
        '¶',
        '↗',
        '↙',
        '↖',
        '↘',
        '♭',
        '♩',
        '♪',
        '♬',
        '㉿',
        'ⅰ',
        'ⅱ',
        'ⅲ',
        'ⅳ',
        'ⅴ',
        'ⅵ',
        'ⅶ',
        'ⅷ',
        'ⅸ',
        'ⅹ',
        'Ⅰ',
        'Ⅱ',
        'Ⅲ',
        'Ⅳ',
        'Ⅴ',
        'Ⅵ',
        'Ⅶ',
        'Ⅷ',
        'Ⅸ',
        'Ⅹ',
        '①',
        '②',
        '③',
        '④',
        '⑤',
        '⑥',
        '⑦',
        '⑧',
        '⑨',
        '⑩',
        '⑪',
        '⑫',
        '⑬',
        '⑭',
        '⑮'
    ];
}