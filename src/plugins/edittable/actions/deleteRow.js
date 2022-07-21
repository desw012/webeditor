import {
    calcTableMatrix,
    calcTableSize,
    createBlockNode,
    insertBefore, removeNode,
    removeStyleProperty
} from "../../../utils/domUtils";

export default function (table, selected){
    calcTableSize(table);
    const matrix = calcTableMatrix(table);

    let sRowIdx = matrix.length;
    let eRowIdx = -1;
    for(let i = 0; i < selected.length; i++){
        const node = selected[i];
        const cellInfo =  matrix[node.closest('tr').rowIndex].find(data=>{
            return data.node === node;
        });
        sRowIdx = Math.min(sRowIdx, cellInfo.row);
        eRowIdx = Math.max(eRowIdx, cellInfo.row + cellInfo.rowSpan - 1);
    }

    for(let i = 0; i < matrix[eRowIdx].length; i++){
        const cellInfo = matrix[eRowIdx][i];
        const endRow = cellInfo.row + cellInfo.rowSpan - 1;

        if( cellInfo.row >= sRowIdx && endRow > eRowIdx && i === cellInfo.cell){
            const td = cellInfo.node.cloneNode(false);
            td.rowSpan = cellInfo.row + cellInfo.rowSpan - 1 - eRowIdx;
            td.colSpan = cellInfo.colSpan;
            td.appendChild(createBlockNode());
            removeStyleProperty(td, 'height');
            removeStyleProperty(td, 'width');

            let find = false;
            for(let j = i + 1; j < matrix[eRowIdx + 1].length; j++){
                const _cellInfo = matrix[eRowIdx + 1][j];
                if(eRowIdx + 1 === _cellInfo.row){
                    find = true;
                    insertBefore(td, _cellInfo.node);
                    break;
                }
            }
            if(!find){
                table.rows[eRowIdx + 1].appendChild(td);
            }
        }
    }

    for(let i = 0; i < matrix[sRowIdx].length; i++){
        const cellInfo = matrix[sRowIdx][i];
        const endRow = cellInfo.row + cellInfo.rowSpan - 1;
        if(endRow >= sRowIdx ){
            cellInfo.node.rowSpan = cellInfo.rowSpan - ( Math.min(endRow, eRowIdx) - sRowIdx + 1);
            removeStyleProperty(cellInfo.node, 'height');
            removeStyleProperty(cellInfo.node, 'width');
        }
    }

    for(let i = eRowIdx; i >= sRowIdx; i--){
        const row = table.rows[i];
        removeNode(row);
    }

    removeStyleProperty(table, 'height');
    removeStyleProperty(table, 'width');
}