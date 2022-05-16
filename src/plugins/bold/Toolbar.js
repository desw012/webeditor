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

    onClick = async (e) => {
        await this.execCommand(Commands.bold);
        this.execCommand(Commands.focus);
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'Bold';
        button.value = 'Bold';
        button.onclick = this.onClick;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'B';
        text.style.fontWeight = 'bold';
    }

    set active ( payload ) {
        const button = this.root.querySelector('button');
        if(payload && !button.classList.contains('active')){
            button.classList.add('active');
        }
        if(!payload && button.classList.contains('active')){
            button.classList.remove('active');
        }
    }
}