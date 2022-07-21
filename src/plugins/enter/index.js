import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";
import {
    createBlockNode,
    getBlockNode,
    getNodeOffset,
    insertAfter,
    isBlockNode,
    isCharacterDataNode,
    splitNode
} from "../../utils/domUtils";

export default class Enter extends Plugin {
    get pluginName() {
        return 'Enter';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        this.shortcut.on('insertParagraph', this.action );
        this.command.on(Commands.insertParagraph, this.action);
    }

    action = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        let node = range.commonAncestorContainer;
        let offset = range.startOffset;
        range.deleteContents();

        if(isCharacterDataNode(node) && offset !== 0 && offset !== node.length){
            node.splitText(offset);
        } else if(isCharacterDataNode(node) && offset === node.length) {
            offset = getNodeOffset(node) + 1;
            node = node.parentNode;
        }
        if(isCharacterDataNode(node)){
            offset = getNodeOffset(node);
            node = node.parentNode;
        }
        let splitNodes = null;
        while(node.parentNode.isContentEditable) {
            if( offset === node.length ){
                offset = getNodeOffset(node) + 1;
                node = node.parentNode;
            } else {
                splitNodes = splitNode(node, offset);

                offset = getNodeOffset(node);
                node = node.parentNode;
            }
        }
        const _range = new Range()

        if(splitNodes[1]){
            _range.selectNodeContents(splitNodes[1]);
            _range.collapse(true);
        } else {
            const newLine = createBlockNode(splitNodes[0]);
            insertAfter(newLine, splitNodes[0])

            _range.selectNodeContents(newLine);
            _range.collapse(true);
        }

        if(_range.commonAncestorContainer.clientHeight === 0){
            _range.insertNode(document.createElement('br'));
        }

        this.selection.removeAllRanges();
        this.selection.addRange(_range);

        return true;
    }
}