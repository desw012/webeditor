import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";
import {calcTableMatrix, isBlockNode, isCharacterDataNode} from "../../utils/domUtils";
import { KeepRange } from "./KeepRange";


export default class Selection extends Plugin {

    get pluginName() {
        return 'Selection';
    }

    get required() {
        return ['UI']
    }

    init() {
        this.currentRange = undefined;

        this.ui = this.pm.get('UI');

        this.selection = this.ui.document.getSelection()
        this.ui.document.addEventListener('selectionchange', this.onchange);

        this.ui.document.addEventListener('mousedown', this.mouseDown );
        this.ui.document.addEventListener('mousemove', this.mouseMove );
        this.ui.document.addEventListener('mouseup', this.mouseUp );
        this.ui.document.addEventListener('beforeinput', this.beforeinput );

        //텍스트가 아닌 영역을 클릭 시
        this.ui.document.body.addEventListener('click', this.click );

    }

    onchange = (e) => {
        const prevRange = this.currentRange
        this.currentRange = this.selection.rangeCount > 0 ? this.selection.getRangeAt(0) : undefined;


        if(!prevRange || !this.currentRange || prevRange.compareBoundaryPoints(Range.END_TO_END, this.currentRange) !== 0){
            this.command.emit(Commands.update_selection);
        }
    }

    getCurrentRange = () => {
        return this.currentRange?.cloneRange();
    }

    removeAllRanges = () => {
        this.selection.removeAllRanges();
    }

    addRange = (range) => {
        this.selection.addRange(range);
    }

    collapse = (node, offset) => {
        const range = new Range();
        range.setStart(node, offset);
        range.setEnd(node, offset);

        this.selection.removeAllRanges();
        this.selection.addRange( range );
    }

    //Table 관련
    removeTableSelected = () => {
        if( this.tableSelected ){
            this.ui.document.querySelectorAll('[selected]').forEach((node)=>{
                node.removeAttribute('selected');
            })
        }
    }

    mouseDown = (e) => {
        if(!e.currentTarget) {
            e.preventDefault();
            return;
        }

        if(e.which !== 1) return;

        this.removeTableSelected();

        const node = e.target.closest('td,th');
        if(node){
            this.startNode = node;
            this.endNode = node;
            this.dragged = false;
        }
    }
    mouseMove = (e) => {
        if(e.which !== 1) return;


        let node = undefined;
        if(this.startNode && (node = e.target.closest('td,th'))){
            if(this.endNode === node) return;
            if(this.startNode.closest('table') !== node.closest('table')) return;

            this.dragged = true;
            this.tableSelected = true;

            const table = this.startNode.closest('table');
            const matrix = calcTableMatrix(table);

            const startCell = matrix[this.startNode.closest('tr').rowIndex].find(data=>{
                return data.node === this.startNode;
            })

            const endCell = matrix[node.closest('tr').rowIndex].find(data=>{
                return data.node === node;
            })


            let sRow = Math.min(startCell.row, endCell.row)
            let eRow = Math.max(startCell.row, endCell.row)
            let sCell = Math.min(startCell.cell, endCell.cell)
            let eCell = Math.max(startCell.cell, endCell.cell)

            let needReCalc = true;
            while(needReCalc) {
                needReCalc = false;
                for( let i = sRow; i < eRow + 1; i++){
                    for( let j = sCell; j < eCell + 1; j++) {
                        const info = matrix[i][j];
                        if (sRow > info.row) {
                            sRow = info.row;
                            needReCalc = true;
                        }
                        if (eRow < info.row + info.rowSpan - 1) {
                            eRow = info.row + info.rowSpan - 1
                            needReCalc = true;
                        }
                        if (sCell > info.cell) {
                            sCell = info.cell;
                            needReCalc = true;
                        }
                        if (eCell < info.cell + info.colSpan - 1) {
                            eCell = info.cell + info.colSpan - 1
                            needReCalc = true;
                        }

                        if (needReCalc) {
                            break;
                        }
                    }
                    if(needReCalc){
                        break;
                    }
                }
            }

            const selected = this.ui.document.querySelectorAll('[selected]');
            selected.forEach((node)=>{
                node.removeAttribute('selected');
            });

            for( let i = sRow; i < eRow + 1; i++) {
                for (let j = sCell; j < eCell + 1; j++) {
                    const info = matrix[i][j];
                    info.node.setAttribute('selected','')
                }
            }

            this.endNode = node;
        }
    }

    mouseUp = (e) => {
        if(!e.currentTarget) {
            e.preventDefault();
            return;
        }

        if(e.which !== 1) return;
        if(this.dragged) {
            e.preventDefault();
            this.dragged = false;
            this.startNode = undefined;
        }
    }

    beforeinput = (e) => {
        if(e.inputType === 'insertText'){
            this.removeTableSelected();
        }
    }

    click = (e) => {
        try{
            if(['BODY', 'HTML'].indexOf(e.currentTarget.tagName) > -1){
                const {
                    endContainer : ec,
                    endOffset : eo,
                } = this.getCurrentRange();

                if(ec.childNodes[eo].tagName === 'TABLE'){
                    const nodes = ec.childNodes[eo].querySelectorAll('td, th');
                    this.collapse(nodes[0], 1);
                }else if(ec.childNodes[eo - 1].tagName === 'TABLE'){
                    const nodes = ec.childNodes[eo - 1].querySelectorAll('td, th');
                    this.collapse(nodes[nodes.length - 1], 1);
                }
            }
        } catch (e){

        }
    }

    KeepRange = KeepRange;
}


