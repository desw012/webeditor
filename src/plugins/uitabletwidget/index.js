import Plugin from "../../core/Plugin";
import {createBlockNode, getBlockNode, insertAfter, insertBefore} from "../../utils/domUtils";
import {Commands} from "../../core/Command";

export default class UITabletWidget extends Plugin {
    get pluginName() {
        return 'UITabletWidget';
    }

    get required(){
        return ['UI', 'Selection', 'Undo']
    }

    init(){
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');

        this.widget = this.createWidget(this);
        this.ui.contentContainer.appendChild(this.widget);

        this.widget.style.display = 'none';

        this.command.on(Commands.update_selection, ()=>{
            const range = this.selection.getCurrentRange();
            const tableNode = this.getTableNode(range.commonAncestorContainer);

            this.target = tableNode;

            if(!tableNode){
                this.widget.style.display = 'none';
                return;
            }

            this.target = tableNode;
            this.widget.style.display = 'block';
            this.calcPosition();
        });
        this.ui.window.addEventListener('optimizedResize', this.calcPosition);
        this.ui.document.addEventListener('scroll', this.calcPosition);
    }

    calcPosition = () => {
        if(!this.target) return;

        const rect = this.target.getBoundingClientRect();
        const outline_top = this.widget.querySelector('.outline .top');
        outline_top.style.top = `${rect.top - 3}px`;
        outline_top.style.left = `${rect.left - 3}px`;
        outline_top.style.height = `4px`;
        outline_top.style.width = `${rect.width + 6}px`;

        const outline_left = this.widget.querySelector('.outline .left');
        outline_left.style.top = `${rect.top - 3}px`;
        outline_left.style.left = `${rect.left - 3}px`;
        outline_left.style.height = `${rect.height + 6}px`;
        outline_left.style.width = `4px`;

        const outline_right = this.widget.querySelector('.outline .right');
        outline_right.style.top = `${rect.top - 3}px`;
        outline_right.style.left = `${rect.right}px`;
        outline_right.style.height = `${rect.height + 6}px`;
        outline_right.style.width = `4px`;

        const outline_bottom = this.widget.querySelector('.outline .bottom');
        outline_bottom.style.top = `${rect.bottom}px`;
        outline_bottom.style.left = `${rect.left - 3}px`;
        outline_bottom.style.height = '4px';
        outline_bottom.style.width = `${rect.width + 6}px`;

        const newline_before = this.widget.querySelector('.newline .before');
        newline_before.style.top = `${rect.top - 10}px`;
        newline_before.style.left = `${rect.right - 3}px`;

        const newline_after = this.widget.querySelector('.newline .after');
        newline_after.style.top = `${rect.bottom - 10}px`;
        newline_after.style.left = `${rect.right - 3}px`;

    }

    getTableNode = (node) => {
        let curr, next = node;
        while( curr = next ){
            if(curr.nodeName === 'TABLE') break;
            next = curr.parentNode;
        }
        return curr;
    }

    createWidget = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'widget';

        //1. outline - START
        const outline = document.createElement("div");
        divLayer.appendChild(outline);
        outline.className = 'outline';

        const outline_top = document.createElement("div");
        outline.appendChild(outline_top)
        outline_top.className = 'top';

        const outline_left = document.createElement("div");
        outline.appendChild(outline_left)
        outline_left.className = 'left';

        const outline_right = document.createElement("div");
        outline.appendChild(outline_right)
        outline_right.className = 'right';

        const outline_bottom = document.createElement("div");
        outline.appendChild(outline_bottom)
        outline_bottom.className = 'bottom';
        //1. outline - END

        //2. newLine - START
        const newline = document.createElement("div");
        divLayer.appendChild(newline);
        newline.className = 'newline';

        const newline_before = document.createElement("div");
        newline.appendChild(newline_before)
        newline_before.className = 'before';

        const beforeBtn = document.createElement("button");
        newline_before.appendChild(beforeBtn)
        beforeBtn.innerText = '<';
        beforeBtn.onclick = () => {
            const node = createBlockNode();

            insertBefore(node, this.target);

            const range = new Range()
            range.selectNode(node.firstChild);
            range.collapse();

            this.selection.removeAllRanges();
            this.selection.addRange(range);
            this.ui.focus();
        }

        const newline_after = document.createElement("div");
        newline.appendChild(newline_after)
        newline_after.className = 'after';

        const afterBtn = document.createElement("button");
        newline_after.appendChild(afterBtn)
        afterBtn.innerText = '<';
        afterBtn.onclick = () => {
            const node = createBlockNode();

            insertAfter(node, this.target);

            const range = new Range()
            range.selectNode(node.firstChild);
            range.collapse();

            this.selection.removeAllRanges();
            this.selection.addRange(range);
            this.ui.focus();
        }
        //2. newLine - END

        return divLayer;
    }
}