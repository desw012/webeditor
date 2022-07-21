import Plugin from "../../core/Plugin";
import { getBlockNodes } from "../../utils/domUtils";
import { Commands } from "../../core/Command";
import { ToolbarItem } from "../../components/toolbar";
import { t } from "i18next";
import align from "./actions/align";

/**
 * [문단 정렬]
 */
export default class Align extends Plugin {
    static required = ['UI', 'Selection', 'Undo'];

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.justifyLeft, () => { this.action('left') });
        this.command.on(Commands.justifyCenter, () => { this.action('center') });
        this.command.on(Commands.justifyRight, () => { this.action('right') });
    }

    action = (payload) => {
        if(!payload) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();

        const blockNodes = getBlockNodes(range);
        blockNodes.forEach((node)=>{
            align(node, payload);
        });
    }

    getToolbarItems () {
        const onclick = async (e) => {
            const value = e.currentTarget.value;

            await this.execCommand(value);
            this.execCommand(Commands.focus);
        };

        const { root : alignLeft } = ToolbarItem.build({
            title : t('toolbar.align.left'),
            value : Commands.justifyLeft,
            imageClassName : 'img_toolbar_align_left',
            onclick : onclick

        });

        const { root : alignCenter } = ToolbarItem.build({
            title : t('toolbar.align.center'),
            value : Commands.justifyCenter,
            imageClassName : 'img_toolbar_align_center',
            onclick : onclick
        });

        const { root : alignRight } = ToolbarItem.build({
            title : t('toolbar.align.right'),
            value : Commands.justifyRight,
            imageClassName : 'img_toolbar_align_right',
            onclick : onclick
        });

        return [ alignLeft, alignCenter, alignRight ];
    }
}