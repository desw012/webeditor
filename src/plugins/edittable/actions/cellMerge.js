import { calcTableMatrix, removeNode } from "../../../utils/domUtils";

export default function (table, selected) {
    const matrix = calcTableMatrix(table);

    const startNode = selected[0];
    const endNode = selected[selected.length - 1];
    const startCell = matrix[startNode.closest('tr').rowIndex].find(data=>{
        return data.node === startNode;
    })

    const endCell = matrix[endNode.closest('tr').rowIndex].find(data=>{
        return data.node === endNode;
    })

    const rowSpan = endCell.row + endCell.rowSpan - startCell.row;
    const colSpan = endCell.cell + endCell.colSpan - startCell.cell;

    startNode.rowSpan = rowSpan;
    startNode.colSpan = colSpan;

    for(const node of selected){
        if(node === startNode) continue;

        removeNode(node);
    }
}