import Plugin from "../../core/Plugin";
import {getBlockNodes, getTextNodes, isCharacterDataNode, splitRange} from "../../utils/domUtils";
import {Commands} from "../../core/Command";
import LineHeightList from "../../components/LineHeightList";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";
import lineHeight from "./actions/lineHeight";

export default class LineHeight extends Plugin {
    get pluginName() {
        return 'LineHeight';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.update_selection, this.updateSelection);
    }

    action = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        const blockNodes = getBlockNodes(range);

        blockNodes.forEach((node)=>{
            lineHeight(node, payload);
        });
    }

    updateSelection = () => {
        if(!this.toolbarButton) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        if(textNodes.length > 0) {
            const styles = getComputedStyle(textNodes[textNodes.length - 1].parentNode);
            const lineHeight = styles.lineHeight;
            this.applyToolbar(lineHeight, styles);
        } else {
            this.applyToolbar('');
        }
    }

    getToolbarItems () {
        const onclick = async (e) => {
            const target = e.currentTarget;

            const lineHeightList = new LineHeightList();
            lineHeightList.show(target);

            const lineHeight = await lineHeightList.getReturn();

            if(lineHeight){
                this.action(lineHeight);
                this.ui.focus();
            }
        }

        const { root, button } = ToolbarItem.build({
            title : t('toolbar.lineHeight'),
            value : Commands.bold,
            className : 'select',
            onclick : onclick
        });
        this.toolbarButton = button;

        this.applyToolbar(this.context.config.DEFAULT_LINEHEIGHT);

        return [root]
    }

    applyToolbar = ( payload, styles ) => {
        let text = payload;
        switch (payload) {
            case 'normal' :
                text = '120%';
                break;
            case payload.endsWith('px') :
                if(styles){
                    payload.replace('')
                }
            default :
                break;
        }

        if(this.toolbarButton){
            this.toolbarButton.innerText = text;
        }
    }
}