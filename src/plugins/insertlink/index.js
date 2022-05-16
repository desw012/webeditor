import Plugin from "../../core/Plugin";
import {
    getLinkNode, getNodeOffset, getTextNodes, removeNodeAndMoveToParent, splitNode,
    splitRangeBlockNode, splitTextNode
} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import Widget from "./Widget";
import {Commands} from "../../core/Command";

export default class InsertLink extends Plugin {
    get pluginName() {
        return 'InsertLink';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.widget = new Widget(this);

        this.command.on(Commands.createLink, this.insertLink);
        this.command.on(Commands.unlink, ()=>{ this.insertLink('')})

        this.command.on(Commands.update_selection, this.updateSelection);
    }

    insertLink = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        if( range.collapsed ) {
            let linkNode = getLinkNode(range.commonAncestorContainer);
            if (linkNode) {
                if(payload){
                    linkNode.href = payload;
                } else {
                    removeNodeAndMoveToParent(linkNode);
                }
            } else {
                linkNode = document.createElement('a');
                linkNode.href = payload;
                linkNode.innerText = payload;

                range.insertNode(linkNode);
            }
        } else {
            const ranges = splitRangeBlockNode(range);

            ranges.forEach((range)=>{
                if(range.commonAncestorContainer.tagName === 'TABLE'){
                    return;
                }

                range = splitTextNode(range);

                //split
                while(range.commonAncestorContainer !== range.startContainer
                    || range.commonAncestorContainer !== range.endContainer ){

                    const cc = range.commonAncestorContainer;
                    const sc = range.startContainer;
                    const so = range.startOffset;
                    const ec = range.endContainer;
                    const eo = range.endOffset;

                    if(cc !== sc){
                        splitNode(sc, so);
                        range.setStart(sc.parentNode, getNodeOffset(sc));
                    }

                    if(cc !== ec){
                        splitNode(ec, eo);
                        range.setEnd(ec.parentNode, getNodeOffset(ec));
                    }
                }

                const linkNode = document.createElement('a');
                linkNode.href = payload;
                range.surroundContents(linkNode);

                //linkNode 하위에 있는 a 태그 제거
                const nodeList = linkNode.querySelectorAll('a');
                for(let i = 0; i < nodeList.length; i++){
                    removeNodeAndMoveToParent(nodeList[i]);
                };
            })
        }
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }

    updateSelection = () => {
        this.widget.updateSelection();
    }
}