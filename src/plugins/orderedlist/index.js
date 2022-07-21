import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";
import {getNodeOffset, getSiblingBlockNodes, isCharacterDataNode} from "../../utils/domUtils";
import orderedList from "./actions/orderedList";
import unorderedList from "./actions/unorderedList";
import removeOrderedList from "./actions/removeOrderedList";

export default class OrderedList extends Plugin {
    get pluginName() {
        return 'OrderedList'
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.insertOrderedList, ()=>{ this.action(Commands.insertOrderedList); });
        this.command.on(Commands.insertUnorderedList, ()=>{ this.action(Commands.insertUnorderedList); });
    }

    action = ( actionType ) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        const blockNodes = getSiblingBlockNodes(range);

        //선택된 노드 중 ul/ol 찾는다.
        let isApplied = false;
        for(const node of blockNodes){
            if(['OL', 'UL', 'LI'].indexOf(node.tagName) > -1){
                isApplied = true;
                break;
            }
        }

        const keepRange = new this.selection.KeepRange(range);

        if(isApplied){
            removeOrderedList(blockNodes, range);
        } else if(Commands.insertOrderedList === actionType) {
            orderedList(blockNodes, range);
        } else if(Commands.insertUnorderedList === actionType){
            unorderedList(blockNodes, range);
        }


        this.selection.removeAllRanges();
        this.selection.addRange(keepRange.getRange());

    }

    getToolbarItems () {
        const onclick = async (e) => {
            const value = e.currentTarget.value;

            await this.execCommand(value);
            this.execCommand(Commands.focus);
        };

        const { root : orderedList } = ToolbarItem.build({
            title : t('toolbar.orderedList'),
            value : Commands.insertOrderedList,
            imageClassName : 'img_toolbar_ordered-list',
            onclick : onclick
        });

        const { root : unorderedList } = ToolbarItem.build({
            title : t('toolbar.unorderedList'),
            value : Commands.insertUnorderedList,
            imageClassName : 'img_toolbar_unordered-list',
            onclick : onclick
        });

        return [ orderedList, unorderedList ];
    }


}