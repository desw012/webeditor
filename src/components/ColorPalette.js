import {insertBefore, scrollParent} from "../utils/domUtils";

export default class ColorPalette {
    constructor() {
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });

        this.render();
    }

    render = () => {
        const root = document.createElement("span");
        this.root = root;
        root.tabIndex = -1;

        const div = document.createElement("div");
        root.appendChild(div);
        div.className = 'color_palette';

        const wrap = document.createElement("div");
        div.appendChild(wrap);

        COLOR.forEach((color)=>{
            const item = document.createElement("div");
            item.style.backgroundColor = color;
            wrap.appendChild(item);

            const button = document.createElement("button");
            button.onclick = this.click;
            button.value = color;
            item.appendChild(button);
        });
    }

    show = ( target ) => {
        insertBefore(this.root, target);

        this.scrollNode = scrollParent(target);
        if(this.scrollNode){
            this.root.firstElementChild.style.transform = `translate(-${this.scrollNode.scrollLeft}px, -${this.scrollNode.scrollTop}px)`;
            this.scrollNode.addEventListener('scroll', this.close, {once: true});
        }

        this.root.addEventListener('focusout', this.focusout, {once: true});
        this.root.focus();
    }

    close = (rtn) => {
        if(this.scrollNode){
            this.scrollNode.removeEventListener('scroll', this.close);
        }
        this.root.removeEventListener('focusout', this.focusout);

        setTimeout(()=>{this.root.parentNode.removeChild(this.root);}, 10);
        this.resolve(rtn);
    }

    getReturn = () => {
        return this.promise;
    }

    //Event
    focusout = (e) => {
        if(!(e.relatedTarget && this.root.contains(e.relatedTarget)) ){
            this.close();
        }
    }

    click = (e) => {
        e.preventDefault();
        this.close(e.currentTarget.value);
    }

}

export const COLOR = [
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