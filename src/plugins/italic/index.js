import Plugin from "../../core/Plugin";
import {getTextNodes, isCharacterDataNode, splitRange} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

export default class Italic extends Plugin {
    get pluginName() {
        return 'Italic';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        this.shortcut.on('formatItalic', this.italic );
        this.command.on(Commands.italic, this.italic )
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    italic = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const fontNode = document.createElement('font');
            fontNode.style.fontStyle = 'italic';

            const _range = new Range();
            _range.selectNode(textNode);
            _range.surroundContents(fontNode);

            this.selection.removeAllRanges();
            this.selection.collapse(textNode, 1);
            this.command.emit(Commands.UIUpdateItalicToolBar, true);
        } else {
            range = splitRange(range);
            const textNodes = getTextNodes(range);

            let isApplied = !(textNodes.some( node => {
                return !isAppliedToElement(node);
            }));

            textNodes.forEach((textNode)=>{
                const fontNode = document.createElement('font');
                fontNode.style.fontStyle = isApplied ? 'normal' : 'italic' ;

                const _range = new Range();
                _range.selectNode(textNode);
                _range.surroundContents(fontNode);
            });

            this.selection.removeAllRanges();
            const _range = new Range();
            if(textNodes.length > 1){
                _range.setStart(textNodes[0], 0);
                _range.setEnd(textNodes[textNodes.length - 1], textNodes[textNodes.length - 1].length);
            } else {
                _range.selectNode(textNodes[0]);
            }
            this.selection.addRange(_range);
            this.command.emit(Commands.update_selection, !isApplied);
        }
    }

    updateSelection = () => {
        if(!this.toolbar) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        let isApplied = false;
        if(textNodes.length > 0) {
            isApplied = !(textNodes.some(node => {
                return !isAppliedToElement(node);
            }));
        }

        this.toolbar.active = isApplied;
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}


const isAppliedToElement = (el) => {
    if(isCharacterDataNode(el)){
        el = el.parentNode;
    }
    const fontStyle = getComputedStyle(el).fontStyle;
    if(fontStyle === 'italic'){
        return true;
    } else {
        return false;
    }

}