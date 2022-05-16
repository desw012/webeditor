import Plugin from "../../core/Plugin";
import {
    splitTextNode
} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

/**
 * 텍스트 삽입
 *
 */
export default class InsertHorizontalRule extends Plugin {
    get pluginName() {
        return 'InsertHorizontalRule';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.insertHorizontalRule, this.insertHorizontalRule);
    }

    insertHorizontalRule = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        range.deleteContents();
        range = splitTextNode(range);

        const cc = range.commonAncestorContainer;
        const sc = range.startContainer;
        const so = range.startOffset;
        const ec = range.endContainer;
        const eo = range.endOffset;

        const endNode = ec.childNodes[eo];
/*
        if(range.collapsed){
            if('BODY' === ec.tagName ){

            }
            const blockNode = getBlockNode(endNode);
            if('BODY' === ec.tagName && !endNode) {
                const hr = document.createElement('hr');
                ec.appendChild(hr);
                range.collapse();
            }else if('BODY' === ec.tagName && endNode){
                const hr = document.createElement('hr');
                insertBefore(hr, endNode);
                const block = createBlockNode();
                insertBefore(block, endNode);

                range.selectNode(block);
                range.collapse();
            } else {
                // const blockNode = getBlockNode(range.commonAncestorContainer);
                // const node = range.startContainer.childNodes[range.startOffset].previousSibling;
                // if(blockNode !== node){
                //     splitNodeToTarget(blockNode, node);
                // }
                //
                // insertBefore(hr, blockNode);
            }





            this.selection.removeAllRanges();
            this.selection.addRange(range);
        }

 */
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}