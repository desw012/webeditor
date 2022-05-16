import Plugin from "../../core/Plugin";
import {insertBefore} from "../../utils/domUtils";

export default class Migration extends Plugin {
    get pluginName() {
        return 'Migration';
    }

    get required(){
        return ['UI', 'Undo']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.undo = this.pm.get('Undo');


    }

    migration = async () => {
        //b tag to strong;
        this.undo.stop();
        const bTagList = this.ui.document.getElementsByTagName('b');
        for(let i = bTagList.length - 1; i >= 0; i--){
            const node = bTagList[i];
            const newNode = document.createElement('strong');
            node.cloneNode(true).childNodes.forEach((child)=>{
                newNode.appendChild(child);
            })
            insertBefore(newNode, node);
            node.parentElement.removeChild(node);
        }


        this.undo.start();
    }
}