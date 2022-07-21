import {insertBefore, scrollParent} from "../utils/domUtils";

export default class FontSizeList {
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
        div.className = 'layer_select';

        const ul = document.createElement("ul");
        div.appendChild(ul);

        FONT_SIZES.forEach((fontSize)=>{
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            li.appendChild(button);
            button.value = fontSize;
            button.onclick = this.click;

            const span = document.createElement("span");
            button.appendChild(span);
            span.style.fontSize = fontSize;
            span.innerText = fontSize;
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

export const FONT_SIZES = [
    '7pt',
    '10pt',
    '12pt',
    '14pt',
    '18pt',
    '24pt',
    '36pt',
]