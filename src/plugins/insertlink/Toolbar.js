export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async () => {
        //FIXME 현재 a Tag 인 경우.
        this.plugin.widget.updateValue('https://');
        this.plugin.widget.show();
        this.plugin.widget.calcPosition();
        this.plugin.widget.focus();
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'InsertLink';
        button.value = 'InsertLink';
        button.onclick = this.onClick;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'L';
    }
}