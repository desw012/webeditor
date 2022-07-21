import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";

/**
 * @deprecated
 */
export default class InsertHtml extends Plugin {
    get pluginName() {
        return 'InsertHtml';
    }

    get required() {
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.insertHTML, this.insertHtml);
    }

    insertHtml = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        range.deleteContents();
        if(range.collapsed){
            if(this.pm.get('Migration')){
                const fragment = document.createDocumentFragment();
                fragment.appendChild(payload);

                this.pm.get('Migration').migration(fragment);
                debugger;
            }
            range.insertNode(payload);
        }
    }
}