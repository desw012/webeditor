import Plugin from "../../core/Plugin";
import TableContextMenu from "./widget/TableContextMenu";
import {isSafari} from "../../utils/browser";

export default class ContextMenu extends Plugin {
    get pluginName() {
        return 'EditTable';
    }

    get required() {
        return ['UI', 'EditTable', 'Selection']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.Selection = this.pm.get('Selection');

        this.ui.document.addEventListener('mouseup', this.mouseup);
        this.ui.document.addEventListener('contextmenu', this.contextmenu);
    }

    mouseup = (e) => {
        if(e.which !== 3) return;

        if(e.target.closest('table')){
            const tableContextMenu = new TableContextMenu(this.context);
            tableContextMenu.show({top : e.clientY, left : e.clientX});
            e.preventDefault();

            // safari에서는 선택된 영역에 text가 없으면 상위 노드로 이동함으로 선택된 노드에 selected를 준다.
            if(isSafari() && e.target.closest('td, th')){
                this.Selection.tableSelected = true;
                e.target.closest('td, th').setAttribute('selected', '');
            }
        }
    }

    contextmenu = (e) => {
        if(e.target.closest('table')) {
            e.preventDefault();
        }
    }
}