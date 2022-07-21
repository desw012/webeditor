import Plugin from "../../core/Plugin";

import {
    getTextNodes,
    removeNode,
    splitNode
} from "../../utils/domUtils";
import {Commands} from "../../core/Command";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";
import {isAppliedToElement} from "./utils";
import unBold from "./actions/unbold";
import bold from "./actions/bold";


export default class Bold extends Plugin {
    get pluginName() {
        return 'Bold';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        this.shortcut.on('formatBold', this.action);
        this.command.on(Commands.bold, this.action);
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    action = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if(range.collapsed){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const isApplied = isAppliedToElement(textNode);
            if(isApplied){
                const rtn = unBold(textNode);
                !rtn && removeNode(textNode);

                rtn && this.selection.collapse(textNode, 1);
            } else {
                const rtn = bold(textNode);

                rtn && this.selection.collapse(textNode, 1);
            }
        } else {
            const textNodes = getTextNodes(range);
            let sc = textNodes[0];
            let so = sc === range.startContainer ? range.startOffset : 0;
            let ec = textNodes[textNodes.length - 1];
            let eo = ec === range.endContainer ? range.endOffset : ec.length;

            const NOTAppliedNodes = textNodes.filter( node => {
                return !isAppliedToElement(node);
            });

            const isApplied = NOTAppliedNodes.length === 0;

            if(isApplied){
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
                    if(target) unBold(target);
                });
            } else {
                NOTAppliedNodes.forEach((target)=>{
                    if(target === range.startContainer){
                        const nodes = splitNode(target, range.startOffset);
                        target = nodes[1];
                        sc = target
                        so = 0;
                    }
                    if(target === range.endContainer){
                        const nodes = splitNode(target, range.endOffset);
                        target = nodes[0];
                        ec = target;
                        eo = target.length
                    }
                    if(target) bold(target);
                });
            }

            const _range = new Range()
            _range.setStart(sc, so);
            _range.setEnd(ec, eo);
            this.selection.removeAllRanges();
            this.selection.addRange(_range);
        }

    }

    updateSelection = () => {
        if(!this.toolbarButton) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        let isApplied = false;
        if(textNodes.length > 0) {
            isApplied = !(textNodes.some(node => {
                return !isAppliedToElement(node);
            }));
        }

        if(isApplied && !this.toolbarButton.classList.contains('active')){
            this.toolbarButton.classList.add('active');
        } else if(!isApplied && this.toolbarButton.classList.contains('active')){
            this.toolbarButton.classList.remove('active');
        }
    }

    getToolbarItems = () => {
        const onclick = async (e) => {
            const value = e.currentTarget.value;

            await this.execCommand(value);
            this.execCommand(Commands.focus);
        };

        const { root, button } = ToolbarItem.build({
            title : t('toolbar.bold'),
            value : Commands.bold,
            imageClassName : 'img_toolbar_bold',
            onclick : onclick
        });

        this.toolbarButton = button;

        return [root];
    }
}
