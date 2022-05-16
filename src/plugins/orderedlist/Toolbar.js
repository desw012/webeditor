export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async () => {
        await this.plugin.ui.focus();
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'OrderedList';
        button.value = 'OrderedList';
        button.onclick = this.onClick;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'OL';
    }
}