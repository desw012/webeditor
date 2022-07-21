import {calcTableMatrix, createBlockNode, insertAfter, insertBefore} from "../../../utils/domUtils";

export default function(table, selected, payload){
    if(payload.col > 1){
        const selected = table.querySelectorAll('[selected]');
        colSplit(selected, payload.col);
    }

    if(payload.row > 1){
        const selected = table.querySelectorAll('[selected]');
        rowSplit(selected, payload.row);
    }
}

const rowSplit = (selected, split) => {
    if(selected.length === 0) return;
    if(split < 2) return;

    const table = selected[0].closest('table');
    let matrix = calcTableMatrix(table);

    for(const node of selected){
        let splitCnt = split - 1;

        const newLine = split - node.rowSpan;
        if( newLine > 0 ){
            const cellInfo = matrix[node.closest('tr').rowIndex].find(data=>{
                return data.node === node;
            });
            const tr = table.rows[cellInfo.row + cellInfo.rowSpan - 1];

            let _newLine = newLine;
            while(_newLine > 0){
                const newTr = document.createElement('tr');
                insertAfter(newTr, tr);

                matrix.splice(tr.rowIndex + 1, 0, new Array());
                _newLine--;
            }

            matrix[cellInfo.row + cellInfo.rowSpan - 1].forEach((cellInfo)=>{
                if(cellInfo.colSpan === 1){
                    cellInfo.node.rowSpan = cellInfo.rowSpan + newLine;
                }
            });

            matrix = calcTableMatrix(table);
        }

        let _node = node;
        while( splitCnt > 0 ){
            const tr = _node.closest('tr');
            const cellInfo = matrix[tr.rowIndex].find(data=>{
                return data.node === _node;
            });

            if(cellInfo.rowSpan === 1) break;

            const nextTr = table.rows[tr.rowIndex + 1];

            const newNode = _node.cloneNode(false);
            newNode.appendChild(createBlockNode());
            newNode.rowSpan = cellInfo.rowSpan - 1;

            let find = false;
            for(let i = cellInfo.cell + 1; i < matrix[nextTr.rowIndex].length; i++){
                const _cellInfo = matrix[nextTr.rowIndex][i];
                if(_cellInfo.row === nextTr.rowIndex){
                    find = true;
                    insertBefore(newNode, _cellInfo.node);
                    break;
                }
            }
            if(!find){
                nextTr.appendChild(newNode);
            }
            _node.rowSpan = 1;

            const newInfo = {
                node : newNode,
                row : cellInfo.row + 1,
                cell : cellInfo.cell,
                rowSpan : cellInfo.rowSpan - 1,
                colSpan : cellInfo.colSpan
            }
            for(let i = newInfo.row; i < newInfo.row + newInfo.rowSpan; i++){
                for(let j = newInfo.cell; j < newInfo.cell + newInfo.colSpan; j++){
                    matrix[i][j] = newInfo;
                }
            }

            _node = newNode;
            splitCnt = splitCnt - 1;
        }
    }
}

const colSplit = (selected, split) => {
    if(selected.length === 0) return;
    if(split < 2) return;

    const table = selected[0].closest('table');
    let matrix = calcTableMatrix(table);

    for(const node of selected){
        let splitCnt = split - 1;

        const newLine = split - node.colSpan;
        if( newLine > 0 ){
            const cellInfo = matrix[node.closest('tr').rowIndex].find(data=>{
                return data.node === node;
            });

            const colIndex = cellInfo.cell + cellInfo.colSpan - 1;
            for(let i = 0; i < matrix.length; i++){
                const _cellInfo = matrix[i][colIndex];
                if(_cellInfo.rowSpan === 1){
                    _cellInfo.node.colSpan = cellInfo.colSpan + newLine;
                }
            }

            matrix = calcTableMatrix(table);
        }

        let _node = node;
        while( splitCnt > 0 ){
            const tr = _node.closest('tr');
            const cellInfo = matrix[tr.rowIndex].find(data=>{
                return data.node === _node;
            });

            if(cellInfo.colSpan === 1) break;

            const newNode = _node.cloneNode(false);
            newNode.appendChild(createBlockNode());
            newNode.colSpan = cellInfo.colSpan - 1;

            insertAfter(newNode, cellInfo.node);
            cellInfo.node.colSpan = 1;

            const newInfo = {
                node : newNode,
                row : cellInfo.row,
                cell : cellInfo.cell + 1,
                rowSpan : cellInfo.rowSpan,
                colSpan : cellInfo.colSpan - 1
            }
            for(let i = newInfo.row; i < newInfo.row + newInfo.rowSpan; i++){
                for(let j = newInfo.cell; j < newInfo.cell + newInfo.colSpan; j++){
                    matrix[i][j] = newInfo;
                }
            }

            _node = newNode;
            splitCnt = splitCnt - 1;
        }
    }
}