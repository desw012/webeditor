import Plugin from "../../core/Plugin";
import {
    calcTableSize,
    createBlockNode,
    getBlockNode, getNodeOffset,
    getTextNodes,
    insertAfter,
    insertBefore, isBlockNode,
    isCharacterDataNode, splitNode,
    splitRange
} from "../../utils/domUtils";
import Toolbar from "./Toolbar";

/**
 * 텍스트 삽입
 *
 */
export default class InsertTable extends Plugin {
    get pluginName() {
        return 'InsertTable';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
    }

    insertTable = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        if(payload.row < 1 || payload.col < 1){ return; }

        this.undo.flush();

        range.deleteContents()

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

        const tableNode = createTable(payload.row, payload.col);
        insertAfter(tableNode, splitNodes[0]);
        calcTableSize(tableNode);

        const _range = new Range()
        const firstNode = tableNode.querySelector('td');
        _range.setStart(firstNode, 0)
        _range.setEnd(firstNode, 0)

        this.selection.removeAllRanges();
        this.selection.addRange(_range);
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}

const createTable = (row, col) => {
    const table = document.createElement('table');
    table.style.width = '100%'
    table.style.borderWidth = '0px';
    table.style.borderStyle = 'solid';
    table.style.borderColor = '#000000';
    table.style.borderCollapse = 'collapse';
    table.style.backgroundColor = '#FFFFFF';
    table.style.wordBreak = 'break-all'
    table.contentEditable = 'false';

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const tdWidth = `${(100 / col)}%`;

    for(let i = 0; i < row; i++){
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        for( let j = 0; j < col; j++){
            const td = document.createElement('td');
            tr.appendChild(td);
            td.style.width = tdWidth;
            td.style.borderWidth = '1px';
            td.style.borderStyle = 'solid';
            td.style.borderColor = '#000000';
            td.contentEditable = 'true';

            td.appendChild(createBlockNode());
        }
    }

    return table;
}