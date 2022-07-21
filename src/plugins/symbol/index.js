import Plugin from "../../core/Plugin";
import {Commands} from "../../core/Command";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";
import SymbolList from "../../components/SymbolList";

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
        const onclick = async (e) => {
            const target = e.currentTarget;

            const symbolList = new SymbolList();
            symbolList.show(target);

            const symbol = await symbolList.getReturn();
            if(symbol){
                await this.execCommand(Commands.insertText, symbol);
                this.execCommand(Commands.focus);
            }
        };

        const { root } = ToolbarItem.build({
            title : t('toolbar.bold'),
            value : Commands.bold,
            imageClassName : 'img_toolbar_symbol',
            onclick : onclick
        });

        return [root]
    }

}