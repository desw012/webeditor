import Plugin from "../../core/Plugin";
import { getBlockNodes } from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

/**
 * [문단 정렬]
 */
export default class Align extends Plugin {
    static required = ['UI', 'Selection', 'Undo'];

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.justifyLeft, () => { this.align('left') });
        this.command.on(Commands.justifyCenter, () => { this.align('center') });
        this.command.on(Commands.justifyRight, () => { this.align('right') });
        this.command.on('align', this.align );
    }

    align = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        const blockNodes = getBlockNodes(range);

        blockNodes.forEach((node)=>{
            if(node.nodeName === 'TABLE'){
                 return;
            }
            node.style.textAlign = payload;
        });
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}