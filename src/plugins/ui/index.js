import Plugin from "../../core/Plugin";

import RootContainer from './component/RootContainer';
import ContentContainer from "./component/ContentContainer";
import ToolBar from "./component/ToolBar";

import './index.css'
import { defaultContent } from "../../config";
import { optimizedResize } from "../../utils/optimizedResize";
import { Commands } from "../../core/Command";

export default class UI extends Plugin {
    get pluginName() {
        return 'UI';
    }

    init(){
        this.rootContainer = RootContainer( );
        this.context.root.appendChild(this.rootContainer);

        this.contentContainer = ContentContainer( );
        this.rootContainer.appendChild(this.contentContainer);

        const iframe = this.contentContainer.querySelector('iframe');
        this.window = iframe.contentWindow;
        this.document = iframe.contentWindow.document;

        this.document.open();
        this.document.write(defaultContent);
        this.document.close();

        this.document.body.contentEditable = 'true';

        optimizedResize(iframe.contentWindow);

        this.command.on(Commands.focus, this.focus);

        this.command.on(Commands.plugin_load_complete, this.initToolbar);
        this.command.on(Commands.plugin_load_complete, this.focus);
    }

    focus = () => {
        this.document.body.focus()
    }

    initToolbar = async () => {
        const toolbar = ToolBar( this );
        this.rootContainer.appendChild(toolbar);
    }
}