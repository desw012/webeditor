import Plugin from "../../core/Plugin";
import Toolbar from "./Toolbar";

export default class Symbol extends Plugin {
    get pluginName() {
        return 'Symbol';
    }

    get required(){
        return ['UI', 'InsertText']
    }

    init() {
        this.ui = this.pm.get('UI');
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }

}