import { COMPONENT_CLASS } from "../constants";
import { Separator } from "../../../components/toolbar";


export default function ToolBar( uiPlugin ) {
    const config = uiPlugin.context.config;
    const toolbarItems = config.toolbarItems;

    const toolbar = document.createElement("div");
    toolbar.className = COMPONENT_CLASS.TOOLBAR_CONTAINER;

    if( toolbarItems && toolbarItems.length > 0){
        const itemGroup = document.createElement("ul");
        toolbar.appendChild(itemGroup);

        for(const toolbarName of toolbarItems){
            if(toolbarName === 'SEPARATOR'){
                const { root } = Separator.build();
                itemGroup.appendChild(root);
            }

            const plugin = uiPlugin.pm.get(toolbarName);
            if(plugin){
                const items = plugin.getToolbarItems() || [];
                items.forEach( item => {
                    if(!item) return;

                    itemGroup.appendChild(item);
                })
            }

        }
    }

    return toolbar;
}
