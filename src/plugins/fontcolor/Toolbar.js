import { insertAfter, removeNode } from "../../utils/domUtils";
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

        await this.execCommand(Commands.foreColor, value);
        this.execCommand(Commands.focus);
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'FontColor';
        button.value = 'FontColor';
        button.onclick = this.showSelectDiv;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'T';
    }

    showSelectDiv = () => {
        const colorSelect = this.buildSelectDiv();
        this.root.appendChild(colorSelect);

        colorSelect.addEventListener('focusout', (e)=>{
            if(!(e.relatedTarget && colorSelect.contains(e.relatedTarget)) ){
                this.root.removeChild(colorSelect);
            }
        });
        colorSelect.focus();
    }

    buildSelectDiv = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'div_layer';
        divLayer.tabIndex = -1;

        const wrap = document.createElement("div");
        divLayer.appendChild(wrap);
        wrap.className = 'layer_color_select';

        this.color.forEach((color)=>{
            const item = document.createElement("div");
            item.style.backgroundColor = color;
            wrap.appendChild(item);

            const button = document.createElement("button");
            button.onclick = this.onClick;
            button.value = color;
            item.appendChild(button);
        });

        return divLayer;
    }

    color = [
        'transparent',
        '#ffffff',
        '#d9d8d8',
        '#c0bdbd',
        '#a7a4a4',
        '#8e8a8b',
        '#827e7f',
        '#767173',
        '#5c585a',
        '#000000',
        '#fefcdf',
        '#fef4c4',
        '#feed9b',
        '#fee573',
        '#ffed43',
        '#f6cc0b',
        '#e0b800',
        '#c9a601',
        '#ad8e00',
        '#8c7301',
        '#ffded3',
        '#ffc4b0',
        '#ff9d7d',
        '#ff7a4e',
        '#ff6600',
        '#e95d00',
        '#d15502',
        '#ba4b01',
        '#a44201',
        '#8d3901',
        '#ffd2d0',
        '#ffbab7',
        '#fe9a95',
        '#ff7a73',
        '#ff483f',
        '#fe2419',
        '#f10b00',
        '#d40a00',
        '#940000',
        '#6d201b',
        '#ffdaed',
        '#ffb7dc',
        '#ffa1d1',
        '#ff84c3',
        '#ff57ac',
        '#fd1289',
        '#ec0078',
        '#d6006d',
        '#bb005f',
        '#9b014f',
        '#fcd6fe',
        '#fbbcff',
        '#f9a1fe',
        '#f784fe',
        '#f564fe',
        '#f546ff',
        '#f328ff',
        '#d801e5',
        '#c001cb',
        '#8f0197',
        '#e2f0fe',
        '#c7e2fe',
        '#add5fe',
        '#92c7fe',
        '#6eb5ff',
        '#48a2ff',
        '#2690fe',
        '#0162f4',
        '#013add',
        '#0021b0',
        '#d3fdff',
        '#acfafd',
        '#7cfaff',
        '#4af7fe',
        '#1de6fe',
        '#01deff',
        '#00cdec',
        '#01b6de',
        '#00a0c2',
        '#0084a0',
        '#edffcf',
        '#dffeaa',
        '#d1fd88',
        '#befa5a',
        '#a8f32a',
        '#8fd80a',
        '#79c101',
        '#3fa701',
        '#307f00',
        '#156200',
        '#d4c89f',
        '#daad88',
        '#c49578',
        '#c2877e',
        '#ac8295',
        '#c0a5c4',
        '#969ac2',
        '#92b7d7',
        '#80adaf',
        '#9ca53b'
    ]
}