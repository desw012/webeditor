import Plugin from "../../core/Plugin";
import {
    getBlockNodes, getCommonAncestor,

} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

export default class Indent extends Plugin {
    get pluginName() {
        return 'Indent';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.indent, this.indent);
        this.command.on(Commands.outdent, this.indent);
    }

    indent = async () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        const blockNodes = getBlockNodes(range);
        const commandAncestor = getCommonAncestor(blockNodes);

        //선택된 Block Node들이 공통한 blockquote에 포함된 경우.
        // if(commandAncestor.tagName === 'BLOCKQUOTE'){
        //     const childNode = commandAncestor.childNodes;
        //     let startPos = -1, cnt = 0;
        //     for(let i = 0; i < childNode.length; i++){
        //         if(blockNodes.indexOf(childNode[i]) > -1){
        //             if(startPos === -1) startPos = i;
        //             cnt++;
        //         }
        //     }
        //     const splitNode = splitChildNode(commandAncestor, startPos, cnt);
        //     let node;
        //     while( node = splitNode.firstChild) {
        //         insertBefore(node, splitNode);
        //     }
        // }
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}