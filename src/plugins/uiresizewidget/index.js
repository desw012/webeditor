import Plugin from "../../core/Plugin";
import {getParentNodeByNodeName} from "../../utils/domUtils";
import {Commands} from "../../core/Command";

export default class UIResizeWidget extends Plugin {
    get pluginName() {
        return 'UIResizeWidget';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.widget = this.createWidget();
        this.ui.contentContainer.appendChild(this.widget);

        this.widget.style.display = 'none';

        this.ui.document.addEventListener('mousemove', this.fn);
    }

    fn = (e) => {
        const target = getParentNodeByNodeName(e.target, ['TD', 'TH']);
        if(!target) {
            this.target = null;
            this.hide();
            return;
        }

        const rect = target.getBoundingClientRect();

        if(rect.right - 4 < e.clientX && rect.right >= e.clientX ){
            this.axis = 'v';
        } else if(rect.bottom - 4 < e.clientY && rect.bottom >= e.clientY) {
            this.axis = 'h';
        } else {
            this.target = null;
            this.hide();
            return;
        }

        this.target = target;
        this.calcPosition();
        this.show();
    }

    show = () => {
        this.widget.style.display = '';
    }

    hide = () => {
        this.widget.style.display = 'none';
    }

    calcPosition = () => {
        if(!this.target) return;

        const rect = this.target.getBoundingClientRect();
        const resizeBar = this.widget.querySelector('.resize-bar');

        if(this.axis === 'h'){
            resizeBar.style.top = `${rect.bottom - 2}px`;
            resizeBar.style.left = '0px';
            resizeBar.style.width = '100%';
            resizeBar.style.height = '4px';
        } else {
            resizeBar.style.top = '0px';
            resizeBar.style.left = `${rect.right - 2}px`;
            resizeBar.style.width = '4px';
            resizeBar.style.height = '100%';
        }
        resizeBar.style.cursor = this.getCursorStyle();
    }

    createWidget = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'widget';

        const resizeBar = document.createElement("div");
        divLayer.appendChild(resizeBar);
        resizeBar.className = 'resize-bar';

        const dim = document.createElement("div");
        divLayer.appendChild(dim);
        dim.className = 'dim';
        dim.style.display = 'none';


        resizeBar.addEventListener('mousedown', this.mousedown);
        dim.addEventListener('mousemove', this.mousemove);
        dim.addEventListener('mouseup', this.mouseup);

        return divLayer
    }

    mousedown = (e) => {
        e.preventDefault();

        this.widget.querySelector('.dim').style.display = '';
        this.widget.querySelector('.dim').style.cursor = this.getCursorStyle();
        this.widget.querySelector('.resize-bar').style.backgroundColor = 'yellow';

        this.top = -1;
        this.left = -1;
        this.right = -1;
        this.bottom = -1;
        if(this.axis === 'h'){
            this.top = this.target.getBoundingClientRect().top + 24;
        } else {
            this.left = this.target.getBoundingClientRect().left + 24;
            this.right = -1;

            if(this.target.nextSibling){
                this.right = this.target.nextSibling.getBoundingClientRect().right - 24;
            }
        }
    }

    mousemove = (e) => {
        let top = e.offsetY, left = e.offsetX;
        if(this.axis === 'h'){
            if(this.top != -1 && top < this.top) top = this.top;
            this.widget.querySelector('.resize-bar').style.top = `${top}px`;
        } else {
            if(this.left != -1 && left < this.left) left = this.left;
            if(this.right != -1 && left > this.right) left = this.right;
            this.widget.querySelector('.resize-bar').style.left = `${left}px`;
        }
    }

    mouseup = (e) => {
        this.widget.querySelector('.dim').style.display = 'none';
        this.widget.querySelector('.resize-bar').style.backgroundColor = '';
        this.hide();

        this.resize();
        this.calcTableSize();
    }

    resize = () => {
        const table = getParentNodeByNodeName(this.target, ['TABLE']);

        if(this.axis === 'h'){
            const to = Number(this.widget.querySelector('.resize-bar').style.top.replace('px', ''));
            const from = this.target.getBoundingClientRect().bottom;
            const diff = to - from;
            const resizeHeight = this.target.getBoundingClientRect().height + diff;

            table.style.height = `${table.getBoundingClientRect().height + diff}px`;

            const tr = this.target.parentNode;
            let curr, next = tr.firstChild;
            while( curr = next){
                if(['TD', 'TH'].indexOf(curr.tagName) > -1){
                    curr.style.height = `${resizeHeight}px`;
                }
                next = curr.nextSibling;
            }
        } else {
            const to = Number(this.widget.querySelector('.resize-bar').style.left.replace('px', ''));
            const from =  this.target.getBoundingClientRect().right;
            const diff = to - from;

            const iterator = document.createNodeIterator(table
                , NodeFilter.SHOW_ELEMENT
                , node => {
                    if(['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TD', 'TH'].indexOf(node.nodeName) > -1) return NodeFilter.FILTER_ACCEPT;
                    else return NodeFilter.FILTER_REJECT;
                });

            let nodeWidthMap = new Map(), trArray = new Array(), node, width;
            while(node = iterator.nextNode()){
                if('TR' === node.nodeName) { trArray.push(node); }
                if(['TD', 'TH'].indexOf(node.nodeName) === -1) continue;

                width = node.getBoundingClientRect().width;
                nodeWidthMap.set(node, width);
            }

            let colIndex = 0, curr, next = this.target.parentNode.firstChild;
            while (curr = next){
                if(['TD', 'TH'].indexOf(curr.nodeName) > -1) colIndex += curr.colSpan;
                if(curr == this.target) break;

                next = curr.nextSibling;
            }

            if(this.right === -1) {
                table.style.width = `${table.getBoundingClientRect().width + diff}px`;
            }

            trArray.forEach( tr => {
                let curr, next = tr.firstElementChild, _colIndex = 0;
                while(curr = next){
                    next = curr.nextSibling;

                    if(['TD', 'TH'].indexOf(curr.nodeName) > -1) { _colIndex += curr.colSpan; }
                    if(_colIndex >= colIndex) break;
                }
                const width = nodeWidthMap.get(curr);
                curr.style.width = `${width + diff}px`;

                if(_colIndex === colIndex){
                    while(curr = next){
                        next = curr.nextSibling;
                        if(['TD', 'TH'].indexOf(curr.nodeName) > -1) break;
                    }
                    if( curr ){
                        const width = nodeWidthMap.get(curr);
                        curr.style.width = `${width - diff}px`;
                    }


                }
            });
        }

        this.command.emit(Commands.update_selection);
    }

    calcTableSize = () => {
        const table = this.target.closest('table');
        const iterator = document.createNodeIterator(table
            , NodeFilter.SHOW_ELEMENT
            , node => {
                if(['TABLE', 'TD', 'TH'].indexOf(node.nodeName) > -1) return NodeFilter.FILTER_ACCEPT;
                else if(['TD', 'TH'].indexOf(node.parentNode.nodeName) > -1) return NodeFilter.FILTER_REJECT;
                else return NodeFilter.FILTER_SKIP;
            });

        let node;
        while(node = iterator.nextNode()){
            const rect = node.getBoundingClientRect()
            node.style.width = `${rect.width}px`;
            node.style.height = `${rect.height}px`;
            node.style.boxSizing = 'border-box';
        }
    }



    getCursorStyle = () => {
        return this.axis === 'h' ? 'row-resize' : 'col-resize';
    }
}