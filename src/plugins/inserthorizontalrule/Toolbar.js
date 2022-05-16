import {Commands} from "../../core/Command";

export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.execCommand = plugin.context.execCommand;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async () => {
        await this.execCommand(Commands.insertHorizontalRule);
        this.execCommand(Commands.focus);
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.appendChild(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'InsertHorizontalRule';
        button.value = 'InsertHorizontalRule';
        button.onclick = this.onClick;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'HR';
    }
}