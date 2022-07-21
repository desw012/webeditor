import {ContextMenu, ContextMenuItem, Separator} from "../../../components/contextmenu";
import { t } from "i18next";

export default class TableContextMenu {
    constructor( context ) {
        this.context = context;
        this.execCommand = context.execCommand;

        this.render();
    }

    render = () => {
        const { root, ul } = ContextMenu.build();
        this.root = root;

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.add_row'),
            onclick : () => {
                this.close();
                this.execCommand('add_row');
            }
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.add_col'),
            onclick : () => {
                this.close();
                this.execCommand('add_col');
            }
        });

        //구분선
        Separator.build({
            parent : ul
        })

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.delete_row'),
            onclick : () => {
                this.close();
                this.execCommand('delete_row');
            }
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.delete_col'),
            onclick : () => {
                this.close();
                this.execCommand('delete_col');
            }
        });

        //구분선
        Separator.build({
            parent : ul
        })

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.cell_merge'),
            onclick : () => {
                this.close();
                this.execCommand('cell_merge');
            }
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.cell_split'),
            onclick : () => {
                this.close();
                this.execCommand('show_cell_split_input');
            }
        });

        //구분선
        Separator.build({
            parent : ul
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.indent'),
            onclick : () => {
                this.close();
                this.execCommand('table_indent');
            }
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.outdent'),
            onclick : () => {
                this.close();
                this.execCommand('table_outdent');
            }
        });

        //구분선
        Separator.build({
            parent : ul
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.cell_properties'),
            onclick : () => {
                this.close();
                this.execCommand('show_cell_properties');
            }
        });

        ContextMenuItem.build({
            parent : ul,
            title : t('contextmenu.table.table_properties'),
            onclick : () => {
                this.close();
                this.execCommand('show_table_properties');
            }
        });
    }

    show = (options) => {
        let { top, left } = options;

        this.context.pm.get('UI').contentContainer.appendChild(this.root);

        const rect_contextMenu = this.root.getBoundingClientRect();
        const rect_contextContainer =  this.context.pm.get('UI').contentContainer.getBoundingClientRect();

        if(top + rect_contextMenu.height > rect_contextContainer.height){
            top = top - rect_contextMenu.height;
        }
        if(left + rect_contextMenu.width > rect_contextContainer.width){
            left = left - rect_contextMenu.width;
        }

        this.root.style.top = `${top}px`;
        this.root.style.left = `${left}px`;

        this.root.addEventListener('focusout', this.focusout);
        this.root.focus();
    }

    close = () => {
        this.root.removeEventListener('focusout', this.focusout);
        setTimeout(()=>{this.context.pm.get('UI').contentContainer.removeChild(this.root)});
    }

    focusout = (e) => {
        if(!(e.relatedTarget && this.root.contains(e.relatedTarget)) ){
            this.close();
        }
    }
}