import Plugin from "../../core/Plugin";
import {getBlockNodes, getTextNodes, isCharacterDataNode, splitRange} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

export default class LineHeight extends Plugin {
    get pluginName() {
        return 'LineHeight';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.update_selection, this.updateSelection);
    }

    lineHeight = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        const blockNodes = getBlockNodes(range);

        blockNodes.forEach((node)=>{
            node.style.lineHeight = payload;
        });
    }

    //FIXME
    updateSelection = () => {
        if(!this.toolbar) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        if(textNodes.length === 1) {
            const lineHeight = getComputedStyle(textNodes[0].parentNode).lineHeight;

            this.toolbar.update(lineHeight);
        } else {
            this.toolbar.update('');
        }
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}