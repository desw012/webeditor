import Plugin from "../../core/Plugin";
import {getSiblingBlockNodes, isBlockNode} from "../../utils/domUtils";

import { Commands } from "../../core/Command";
import indent from "./actions/indent";
import {ToolbarItem} from "../../components/toolbar";
import {t} from "i18next";

export default class Indent extends Plugin {
    get pluginName() {
        return 'Indent';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.command.on(Commands.indent, ()=>{ this.action(Commands.indent); });
        this.command.on(Commands.outdent, ()=>{ this.action(Commands.outdent); });
    }

    action = ( actionType ) => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        const blockNodes = getSiblingBlockNodes(range);

        const _blockNodes = new Array();
        const {
            commonAncestorContainer : cc,
            startContainer : sc,
            startOffset : so,
            endContainer : ec,
            endOffset : eo
        } = range;

        for(let i = 0; i < blockNodes.length; i++){
            const node = blockNodes[i];
            if(['OL', 'UL'].indexOf(node.tagName) > -1){
                let curr, next = node.firstChild, find = false;
                while(curr = next){
                    next = curr.nextSibling;
                    if(!isBlockNode(curr)) continue;
                    if(curr.contains(sc)){ find = true; }
                    if(find){ _blockNodes.push(curr); }
                    if(curr.contains(ec)){ break; }
                }
            } else {
                _blockNodes.push(node);
            }
        }

        _blockNodes.forEach((node)=>{
            indent(node, actionType);
        })
    }

    getToolbarItems () {
        const onclick = async (e) => {
            const value = e.currentTarget.value;

            await this.execCommand(value);
            this.execCommand(Commands.focus);
        };

        const { root : indent } = ToolbarItem.build({
            title : t('toolbar.indent'),
            value : Commands.indent,
            imageClassName : 'img_toolbar_indent',
            onclick : onclick
        });

        const { root : outdent } = ToolbarItem.build({
            title : t('toolbar.outdent'),
            value : Commands.outdent,
            imageClassName : 'img_toolbar_outdent',
            onclick : onclick
        });

        return [ indent, outdent ];
    }
}