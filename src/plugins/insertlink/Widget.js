import {getLinkNode, removeNode} from "../../utils/domUtils";
import {Commands} from "../../core/Command";

export default class Widget {
    isShow = true;
    linkNode = null;

    constructor( plugin ) {
        this.plugin = plugin;
        this.execCommand = plugin.context.execCommand;

        this.root = this.build();
        this.hide();

        this.content = this.root.firstChild;

        this.plugin.ui.contentContainer.appendChild(this.root);

        this.root.addEventListener('focusout', (e)=>{
            if(!(e.relatedTarget && this.root.contains(e.relatedTarget)) ){
                this.hide();
            }
        });
    }

    updateSelection = () => {
        const range = this.plugin.selection.getCurrentRange();
        let linkNode = null;
        if( range.collapsed ) {
            linkNode = getLinkNode(range.commonAncestorContainer);
        }
        if(!linkNode) {
            this.linkNode = null;
            this.hide();
            return;
        }

        if(this.linkNode === linkNode){
            this.calcPosition()
        } else {
            this.linkNode = linkNode;
            this.updateValue(linkNode.href);

            this.show();
            this.calcPosition()
        }
    }

    calcPosition = () => {
        const range = this.plugin.selection.getCurrentRange();

        const rect1 = range.getBoundingClientRect();
        const rect2 = this.content.getBoundingClientRect();
        const containerRect = this.plugin.ui.contentContainer.getBoundingClientRect();

        /**
         * 하단 중앙에 우선 탐색
         */
        let top =  rect1.bottom
        let left = rect1.left + (rect1.right - rect1.left) / 2 - (rect2.right - rect2.left) / 2

        if(left < 0) left = 0;
        if(left + rect2.width >  containerRect.right ) left = containerRect.right - rect2.width;
        if(top + rect2.height > containerRect.bottom ) top = rect1.top - rect2.height;


        this.content.style.top = top + 'px';
        this.content.style.left = left  + 'px';
    }

    build = () => {
        const root = document.createElement("div");
        root.className = 'widget';

        const divLayer = document.createElement("div");
        root.appendChild(divLayer);
        divLayer.className = 'link';
        divLayer.tabIndex = -1;

        const inputUrl = document.createElement("input");
        divLayer.appendChild(inputUrl);
        inputUrl.type = 'text';

        const confirm = document.createElement("button");
        divLayer.appendChild(confirm);
        confirm.type = 'button';
        confirm.onclick = async  (e) => {
            const value = inputUrl.value;

            await this.execCommand(Commands.createLink, value);
            this.execCommand(Commands.focus);
        }

        const confirmText = document.createElement('span');
        confirm.appendChild(confirmText);
        confirmText.innerText = '확인';

        const cancel = document.createElement("button");
        divLayer.appendChild(cancel);
        cancel.type = 'button';
        cancel.onclick = (e) => {
            this.plugin.ui.focus();
        }

        const cancelText = document.createElement('span');
        cancel.appendChild(cancelText);
        cancelText.innerText = '취소';

        return root;
    }

    updateValue(href) {
        this.root.querySelector('input').value = href;
    }

    show(){
        if(this.isShow) {
            return
        }
        this.isShow = true;
        this.root.style.display = 'block';

        this.plugin.ui.document.addEventListener('scroll', this.calcPosition);
        this.plugin.ui.window.addEventListener('optimizedResize', this.calcPosition);
    }

    hide() {
        if(!this.isShow) {
            return;
        }
        this.isShow = false;
        this.root.style.display = 'none';

        this.plugin.ui.document.removeEventListener('scroll', this.calcPosition);
        this.plugin.ui.window.removeEventListener('optimizedResize', this.calcPosition);
    }

    focus() {
        this.root.querySelector('input').focus();
    }
}