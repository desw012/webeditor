import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";


export default class Selection extends Plugin {

    get pluginName() {
        return 'Selection';
    }

    get required() {
        return ['UI']
    }

    init() {
        this.currentRange = undefined;

        this.uiPlugin = this.pm.get('UI');

        this.selection = this.uiPlugin.document.getSelection()
        this.uiPlugin.document.addEventListener('selectionchange', (e)=>{ this.onchange(e) });
    }

    onchange(e) {
        this.currentRange = this.selection.rangeCount > 0 ? this.selection.getRangeAt(0) : undefined;
        this.command.emit(Commands.update_selection);
    }

    getCurrentRange(){
        return this.currentRange?.cloneRange();
    }

    removeAllRanges() {
        this.selection.removeAllRanges();
    }

    addRange(range){
        this.selection.addRange(range);
    }

    collapse(node, offset){

        const range = new Range();
        range.setStart(node, offset);
        range.setEnd(node, offset);

        this.selection.removeAllRanges();
        this.selection.addRange( range );
    }


}