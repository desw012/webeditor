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

    let sColIdx = matrix[0].length;
    let eColIdx = -1;
    for(let i = 0; i < selected.length; i++){
        const node = selected[i];
        const cellInfo =  matrix[node.closest('tr').rowIndex].find(data=>{
            return data.node === node;
        });
        sColIdx = Math.min(sColIdx, cellInfo.cell);
        eColIdx = Math.max(eColIdx, cellInfo.cell + cellInfo.colSpan - 1);
    }

    for(let i = 0; i < matrix.length; i++){
        const cellInfo = matrix[i][eColIdx];
        const endCol = cellInfo.cell + cellInfo.colSpan - 1;

        if( cellInfo.cell >= sColIdx && endCol > eColIdx && i === cellInfo.cell){
            const td = cellInfo.node.cloneNode(false);
            td.rowSpan = cellInfo.rowSpan;
            td.colSpan = cellInfo.cell + cellInfo.colSpan - 1 - eColIdx;
            td.appendChild(createBlockNode());
            removeStyleProperty(td, 'height');
            removeStyleProperty(td, 'width');

            insertBefore(td, cellInfo.node);
        }
    }

    for(let i = 0; i < matrix.length; i++){
        const cellInfo = matrix[i][sColIdx];
        const endCol = cellInfo.cell + cellInfo.colSpan - 1;
        if(endCol >= sColIdx ){
            cellInfo.node.colSpan = cellInfo.colSpan - ( Math.min(endCol, eColIdx) - sColIdx + 1);
            removeStyleProperty(cellInfo.node, 'height');
            removeStyleProperty(cellInfo.node, 'width');
        }
    }

    for(let i = 0; i < matrix.length; i++){
        for(let j = eColIdx; j >= sColIdx; j--){
            const cellInfo = matrix[i][j];
            if(cellInfo.row === i && cellInfo.cell === j){
                removeNode(cellInfo.node);
            }
        }
    }

    removeStyleProperty(table, 'height');
    removeStyleProperty(table, 'width');
}