import Plugin from "../../core/Plugin";
import {
    deleteContents,
    insertAfter,
    insertBefore,
    isCharacterDataNode,
    splitRange,
    splitTextNode
} from "../../utils/domUtils";
import { Commands } from "../../core/Command";

/**
 * 텍스트 삽입
 *
 */
export default class InsertText extends Plugin {
    get pluginName() {
        return 'InsertText';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.insertText, this.insertText);
    }

    insertText = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        //FIXME
        this.ui.document.execCommand('insertText', false, payload);

        //range.deleteContents();
        //deleteContents(range);
        //this.ui.document.execCommand('insertHtml', false, payload);
        /*
        if(range.collapsed){

        } else {
            deleteContents(range);
        }

        debugger;
        // ≈
        // if(range.collapsed){
        //     if(range.endContainer)
        // }

        //range = splitTextNode(range);
        //const textNode = document.createTextNode(payload);
        //range.insertNode(textNode);
        //
        //
        // if( range.collapsed && isCharacterDataNode(range.commonAncestorContainer) ){
        //     if(range.startOffset === 0) {
        //         insertBefore(textNode, range.startContainer);
        //     } else if(range.startOffset === range.startContainer.length) {
        //         insertAfter(textNode, range.startContainer);
        //     } else {
        //         range = splitRange(range);
        //         insertBefore(textNode, range.startContainer);
        //     }
        // } else {
        //     range = splitRange(range);
        //     insertBefore(textNode, range.startContainer);
        //     range.deleteContents();
        // }

        //this.selection.collapse(textNode, textNode.length);
         */
    }
}