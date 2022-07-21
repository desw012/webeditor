import Plugin from "../../core/Plugin";
import {
    createBlockNode,
    getNodeOffset, insertAfter,
    isCharacterDataNode, splitNode,
    splitTextNode
} from "../../utils/domUtils";
import {Commands} from "../../core/Command";
import {ToolbarItem} from "../../components/toolbar";
import { t } from "i18next";

/**
 * 텍스트 삽입
 *
 */
export default class InsertHorizontalRule extends Plugin {
    get pluginName() {
        return 'InsertHorizontalRule';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Enter']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.insertHorizontalRule, this.action);
    }

    //FIXME
    action = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        range.deleteContents();

        let node = range.commonAncestorContainer;
        let offset = range.startOffset;
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

        insertAfter(document.createElement('hr'), splitNodes[0])

        this.selection.removeAllRanges();
        this.selection.addRange(_range);
    }

    getToolbarItems () {
        const { root  } = ToolbarItem.build({
            title : t('toolbar.insertHorizontalRule'),
            value : Commands.outdent,
            imageClassName : 'img_toolbar_insert-horizontal-rule',
            onclick : onclick
        });

        return [root];
    }
}