import Plugin from "../../core/Plugin";
import Toolbar from "./Toolbar";

export default class  UnorderedList extends Plugin {
    get pluginName() {
        return 'UnorderedList';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}