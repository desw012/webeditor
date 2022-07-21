import Plugin from "../../core/Plugin";
import cellMerge from "./actions/cellMerge";
import cellSplit from "./actions/cellSplit";
import deleteRow from "./actions/deleteRow";
import deleteCol from "./actions/deleteCol";
import addCol from "./actions/addCol";
import addRow from "./actions/addRow";
import {calcTableSize, isCharacterDataNode, removeStyleProperty} from "../../utils/domUtils";
import CellProperties from "./widget/CellProperties";
import CellSplitInput from "./widget/CellSplitInput";
import applyCellProperties from "./actions/applyCellProperties";
import TableProperties from "./widget/TableProperties";
import applyTableProperties from "./actions/applyTableProperties";

export default class EditTable extends Plugin {
    get pluginName() {
        return 'EditTable';
    }

    get required() {
        return ['UI', 'Selection', 'Undo', 'Indent']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.indent = this.pm.get('Indent');

        this.command.on('cell_merge', this.cellMerge );
        this.command.on('cell_split', this.cellSplit );
        this.command.on('delete_row', this.deleteRow );
        this.command.on('delete_col', this.deleteCol );
        this.command.on('add_row', this.addRow );
        this.command.on('add_col', this.addCol );

        this.command.on('apply_cell_properties', this.applyCellProperties);
        this.command.on('apply_table_properties', this.applyTableProperties);

        this.command.on('show_cell_properties', this.showCellProperties );
        this.command.on('show_table_properties', this.showTableProperties );
        this.command.on('show_cell_split_input', this.showSplitInput );
    }

    cellMerge = () => {
        const selected = this.ui.document.querySelectorAll('[selected]');
        if (selected.length === 1) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        cellMerge(table, selected);
    }

    cellSplit = ( payload ) => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length === 0){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                cell.setAttribute('selected','')
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        cellSplit(table, selected, payload);
    }


    deleteRow = () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length === 0){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        deleteRow(table, selected);
    }

    deleteCol = () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length === 0){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        deleteCol(table, selected);
    }

    addRow = () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        addRow(table, selected);
    }

    addCol = () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        addCol(table, selected);
    }

    showSplitInput = async () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        const cellSplitInput = new CellSplitInput(this.context);
        cellSplitInput.show();

        const rtn = await cellSplitInput.getReturn();
        if(rtn){
            this.context.execCommand('cell_split', rtn);
        }
    }

    showCellProperties = async () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        const table = selected[0].closest('table');
        calcTableSize(table);

        const cellProperties = new CellProperties(this.context);
        cellProperties.update(selected);
        cellProperties.show();

        const styles = await cellProperties.getReturn();

        if(styles) {
            this.context.execCommand('apply_cell_properties', styles);
        }
    }

    showTableProperties = async () => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        const table = selected[0].closest('table');
        calcTableSize(table);

        const tableProperties = new TableProperties(this.context);
        tableProperties.update(table);
        tableProperties.show();

        const properties = await tableProperties.getReturn();

        if(properties) {
            this.context.execCommand('apply_table_properties', properties);
        }
    }

    applyCellProperties = (styles) => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');

        removeStyleProperty(table, "background");

        applyCellProperties(table, selected, styles);
    }

    applyTableProperties = (styles) => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();

        const table = selected[0].closest('table');
        applyTableProperties(table, styles);
    }



    indent = ( actionType ) => {
        let selected = this.ui.document.querySelectorAll('[selected]');
        if(selected.length < 1){
            const range = this.selection.getCurrentRange();
            let node = range.commonAncestorContainer;
            if(isCharacterDataNode(node)){
                node = node.parentNode;
            }
            const cell = node.closest('td, th');
            if(cell){
                selected = [cell];
            }
        }

        if(!selected || selected.length === 0) return;

        this.undo.flush();
        const table = selected[0].closest('table');
        this.indent.indent(table, actionType);
    }
}