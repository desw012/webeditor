import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";
import {getBlockNode} from "../../utils/domUtils";

export default class Enter extends Plugin {
    get pluginName() {
        return 'Enter';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        //this.shortcut.on('insertParagraph', this.enter );
        this.command.on(Commands.insertParagraph, this.enter);
    }

    enter = () => {
        //debugger
    }
}