import {calcTableMatrix, createBlockNode, insertAfter, removeStyleProperty} from "../../../utils/domUtils";

export default function(table, selected){
    const matrix = calcTableMatrix(table);

    let lastRowIndex = -1;
    for(let i = 0; i < selected.length; i++){
        const node = selected[i];
        const cellInfo =  matrix[node.closest('tr').rowIndex].find(data=>{
            return data.node === node;
        });

        lastRowIndex = Math.max(lastRowIndex, cellInfo.row + cellInfo.rowSpan - 1);
    }

    const currRow = table.rows[lastRowIndex]
    const newRow = currRow.cloneNode(false);
    insertAfter(newRow, currRow);

    for(let i = 0; i < matrix[lastRowIndex].length; i++ ){
        const cellInfo = matrix[lastRowIndex][i];
        if(cellInfo.row + cellInfo.rowSpan - 1 > lastRowIndex) {
            if(cellInfo.cell === i){
                cellInfo.node.rowSpan = cellInfo.rowSpan + 1;
            }
        } else {
            const td = cellInfo.node.cloneNode(false);
            td.rowSpan = 1;
            td.colSpan = 1;
            td.appendChild(createBlockNode());
            removeStyleProperty(td, 'height');
            removeStyleProperty(td, 'width');
            newRow.appendChild(td);
        }
    }
}