import {calcTableMatrix, createBlockNode, insertAfter, removeStyleProperty} from "../../../utils/domUtils";

export default function(table, selected){
    const matrix = calcTableMatrix(table);

    let lastColIndex = -1;
    for(let i = 0; i < selected.length; i++){
        const node = selected[i];
        const cellInfo =  matrix[node.closest('tr').rowIndex].find(data=>{
            return data.node === node;
        });

        lastColIndex = Math.max(lastColIndex, cellInfo.cell + cellInfo.colSpan - 1);
    }

    for(let i = 0; i < matrix.length; i++){
        const cellInfo = matrix[i][lastColIndex];

        if(cellInfo.cell + cellInfo.colSpan - 1 > lastColIndex) {
            if(cellInfo.row === i){
                cellInfo.node.colSpan = cellInfo.colSpan + 1;
            }
        } else {
            const td = cellInfo.node.cloneNode(false);
            td.rowSpan = 1;
            td.colSpan = 1;
            td.appendChild(createBlockNode());
            removeStyleProperty(td, 'height');
            removeStyleProperty(td, 'width');

            td.style.width = '100px';

            insertAfter(td, cellInfo.node);
        }
    }
}