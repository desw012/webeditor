import Plugin from "../../core/Plugin";
import { getTextNodes, splitTextNode } from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

export default class FontColor extends Plugin {
    get pluginName() {
        return 'FontColor';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.foreColor, this.fontColor);
    }

    fontColor = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const fontNode = document.createElement('font');
            fontNode.style.color = payload;

            const _range = new Range();
            _range.selectNode(textNode);
            _range.surroundContents(fontNode);

            this.selection.removeAllRanges();
            this.selection.collapse(textNode, 1);
        } else {
            range = splitTextNode(range);

            const textNodes = getTextNodes(range);

            textNodes.forEach((textNode)=>{
                const fontNode = document.createElement('span');
                fontNode.style.color = payload;

                const _range = new Range();
                _range.selectNode(textNode);
                _range.surroundContents(fontNode);
            });


            const _range = new Range();
            if(textNodes.length > 1){
                _range.setStart(textNodes[0], 0);
                _range.setEnd(textNodes[textNodes.length - 1], textNodes[textNodes.length - 1].length);
            } else {
                _range.selectNode(textNodes[0]);
            }

            this.selection.removeAllRanges();
            this.selection.addRange(_range);
        }
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();;
    }
}