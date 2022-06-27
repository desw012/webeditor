import Plugin from "../../core/Plugin";
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

    //FIXME : block 노드가 아닌 content node에 생성됨.
    insertText = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        range.deleteContents();
        if(range.collapsed){
            const textNode = document.createTextNode(payload);
            range.insertNode(textNode);
            this.selection.collapse(textNode, 1);
            textNode.parentNode.normalize();
            this.ui.focus();
        }
    }
}