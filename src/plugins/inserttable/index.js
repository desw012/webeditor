import Plugin from "../../core/Plugin";
import {
    createBlockNode,
    getBlockNode,
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

        if(!range.collapsed) {
            range.deleteContents();
        }

        if(range.collapsed){
            let target = range.endContainer;
            while( isBlockNode(target) ){


            }
            // let cc;
            // while( ( cc = range.commonAncestorContainer )
            // && cc.tagName !== 'BODY'
            // && cc.tagName !== 'HTML' ){
            //     if(isCharacterDataNode(cc)){
            //         range = splitNode(range);
            //     } else if(!isBlockNode(cc.childNodes[range.startOffset])){
            //         range = splitNode(range);
            //     } else {
            //         break;
            //     }
            // }

            const tableNode = createTable(payload.row, payload.col);

            const ec = range.commonAncestorContainer.childNodes[range.endOffset];
            insertBefore(tableNode, ec);

            range.setStart(ec, 0);
            range.setEnd(ec, 0);
        }

        this.selection.removeAllRanges();
        this.selection.addRange(range);
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

            td.appendChild(createBlockNode());
    }
}

return table;
}