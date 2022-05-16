import { COMPONENT_CLASS } from "../constants";


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
                const el_li = document.createElement('li');
                itemGroup.appendChild(el_li);

                const button = document.createElement("button");
                el_li.appendChild(button);
                button.className = 'toolbar-item';
                button.type = 'button';
                button.disabled = true;
                button.title = 'SEPARATOR';

                const span = document.createElement("span");
                button.appendChild(span);
                span.innerText = '|';
            }

            const plugin = uiPlugin.pm.get(toolbarName);
            if(plugin){
                const items = plugin.getToolbarItems();
                items.forEach( item => {
                    if(!item) return;

                    itemGroup.appendChild(item);
                })
            }

        }
    }

    return toolbar;
}
