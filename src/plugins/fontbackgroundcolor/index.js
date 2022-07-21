import Plugin from "../../core/Plugin";
import { getTextNodes, splitNode } from "../../utils/domUtils";
import {Commands} from "../../core/Command";
import {t} from "i18next";
import { ToolbarItem } from "../../components/toolbar";
import fontBackgroundColor from "./actions/fontBackgroundColor";
import ColorPalette from "../../components/ColorPalette";

export default class FontBackgroundColor extends Plugin {
    get pluginName() {
        return 'FontBackgroundColor';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.backColor, this.action)
    }

    action = (payload) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const rtn = fontBackgroundColor(textNode, payload);

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
                if(target) fontBackgroundColor(target, payload);
            });

            const _range = new Range()
            _range.setStart(sc, so);
            _range.setEnd(ec, eo);
            this.selection.removeAllRanges();
            this.selection.addRange(_range);
        }
    }

    getToolbarItems () {
        const onclick = async (e) => {
            const target = e.currentTarget;

            const colorPalette = new ColorPalette();
            colorPalette.show(target);

            const color = await colorPalette.getReturn();
            if(color){
                await this.execCommand(Commands.backColor, color);
                this.execCommand(Commands.focus);
            }
        };

        const { root } = ToolbarItem.build({
            title : t('toolbar.fontBackgroundColor'),
            value : Commands.backColor,
            imageClassName : 'img_toolbar_font-background-color',
            onclick : onclick
        });

        return [root];
    }
}