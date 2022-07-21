import {insertBefore, removeNode, renameTag} from "../../../utils/domUtils";

export default function( targetList ){
    const ol = document.createElement('ol');
    insertBefore(ol, targetList[0]);

    targetList.forEach((node)=>{
        const li = renameTag(node, 'li');
        ol.appendChild(li);
    });
}