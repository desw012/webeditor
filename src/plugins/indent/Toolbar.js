import {Commands} from "../../core/Command";

export default class Toolbar {
    getItems = () => {
        return [this.indent, this.outdent];
    }

    constructor(plugin) {
        this.plugin = plugin;
        this.execCommand = plugin.context.execCommand;
        this.build();
    }

    onClick = async (e) => {
        const value = e.currentTarget.value;

        await this.execCommand(value);
        this.execCommand(Commands.focus);
    }

    build = () => {
        this.indent = this._build(Commands.indent, 'I');
        this.outdent = this._build(Commands.outdent, 'O');
    }

    _build = (value, text) => {
        const root = document.createElement('li');

        const button = document.createElement('button');
        root.appendChild(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = value;
        button.value = value;
        button.onclick = this.onClick;

        const span = document.createElement("span");
        button.appendChild(span);
        span.innerText = text;

        return root;
    }
}