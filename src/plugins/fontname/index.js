import Plugin from "../../core/Plugin";
import {getTextNodes, splitTextNode} from "../../utils/domUtils";
import { Commands } from "../../core/Command";
import Toolbar from "./Toolbar";

export default class FontName extends Plugin {
    get pluginName() {
        return 'FontName';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.command = this.context.command;

        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');


        this.command.on(Commands.fontName, this.fontName);
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    fontName = (payload) => {
        if(!payload) return;;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const fontNode = document.createElement('span');
            fontNode.style.fontFamily = payload;

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
                fontNode.style.fontFamily = payload;

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

    updateSelection = () => {
        if(!this.toolbar) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        if(textNodes.length === 1) {
            const fontFamily = getComputedStyle(textNodes[0].parentNode).fontFamily;
            this.toolbar.updateFontName(fontFamily);
        } else {
            this.toolbar.updateFontName('');
        }
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}