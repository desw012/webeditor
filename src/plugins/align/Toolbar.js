import Command, {Commands} from "../../core/Command";

export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.execCommand = plugin.context.execCommand;
        this.build();
    }

    getItems = () => {
        return [this.alignLeft, this.alignCenter, this.alignRight];
    }


    onClick = async (e) => {
        const value = e.currentTarget.value;

        await this.execCommand(value);
        this.execCommand(Commands.focus);
    }

    build = () => {
        this.alignLeft = this._build(Commands.justifyLeft, 'L');
        this.alignCenter = this._build(Commands.justifyCenter, 'C');
        this.alignRight = this._build(Commands.justifyRight, 'R');
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