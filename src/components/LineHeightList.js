import {FONT_SIZES} from "./FontSizeList";
import {insertBefore, scrollParent} from "../utils/domUtils";

export default class LineHeightList {
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

        LINE_HEIGHT.forEach((lineHeight)=>{
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            li.appendChild(button);
            button.value = lineHeight;
            button.innerText = lineHeight;
            button.onclick = this.click;
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

export const LINE_HEIGHT = [
    '50%',
    '80%',
    '100%',
    '120%',
    '150%',
    '160%',
    '180%',
    '200%'
];