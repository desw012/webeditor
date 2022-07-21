import Plugin from "../../core/Plugin";
import { getTextNodes, splitNode } from "../../utils/domUtils";
import {Commands} from "../../core/Command";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";
import FontSizeList from "../../components/FontSizeList";
import fontSize from "./actions/fontSize";

export default class FontSize extends Plugin {
    get pluginName() {
        return 'FontSize';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.command = this.context.command;

        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.fontSize, this.action)
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    action = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const rtn = fontSize(textNode, payload);

            rtn && this.selection.collapse(textNode, 1);
        } else {
            const textNodes = getTextNodes(range);
            let sc = textNodes[0];
            let so = sc === range.startContainer ? range.startOffset : 0;
            let ec = textNodes[textNodes.length - 1];
            let eo = ec === range.endContainer ? range.endOffset : ec.length;

            textNodes.forEach((target)=>{
                if(target === range.startContainer){
                    const nodes = splitNode(target, range.startOffset);
                    target = nodes[1];
                    sc = target;
                    so = 0;
                }
                if(target === range.endContainer){
                    const nodes = splitNode(target, range.endOffset);
                    target = nodes[0];
                    ec = target;
                    eo = target.length
                }
                if(target) fontSize(target, payload);
            });

            const _range = new Range()
            _range.setStart(sc, so);
            _range.setEnd(ec, eo);
            this.selection.removeAllRanges();
            this.selection.addRange(_range);
        }
    }

    updateSelection = () => {
        if(!this.toolbar) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        if(textNodes.length > 0) {
            const fontSize = getComputedStyle(textNodes[textNodes.length - 1].parentNode).fontSize;
            const _fontSize = Math.floor(Number(fontSize.replace('px', '')) / 1.333) + 'pt';

            this.applyToolbar(_fontSize);
        } else {
            this.applyToolbar('');
        }
    }

    getToolbarItems () {
        const onclick = async (e) => {
            const target = e.currentTarget;

            const fontSizeList = new FontSizeList();
            fontSizeList.show(target);

            const fontSize = await fontSizeList.getReturn();
            if(fontSize){
                await this.execCommand(Commands.fontSize, fontSize);
                this.execCommand(Commands.focus);
            }
        };
        const { root, button } = ToolbarItem.build({
            title : t('toolbar.fontSize'),
            value : Commands.bold,
            className : 'select',
            onclick : onclick
        });
        this.toolbarButton = button;
        this.applyToolbar(this.context.config.DEFAULT_FONTSIZE);

        return [root]
    }

    applyToolbar = ( payload ) => {
        if(this.toolbarButton){
            this.toolbarButton.innerText = payload;
        }
    }
}