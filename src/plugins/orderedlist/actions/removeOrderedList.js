import {getNodeOffset, insertBefore, isBlockNode, removeNode, renameTag, splitChildNode} from "../../../utils/domUtils";

export default function( targetList, range ){
    const {
        commonAncestorContainer : cc,
        startContainer : sc,
        startOffset : so,
        endContainer : ec,
        endOffset : eo
    } = range;

    const _blockNodes = new Array();
    for(let i = 0; i < targetList.length; i++){
        const node = targetList[i];
        if(['OL', 'UL'].indexOf(node.tagName) > -1){
            let curr, next = node.firstChild, find = false;
            if(i > 0) find = true;
            while(curr = next){
                next = curr.nextSibling;
                if(!isBlockNode(curr)) continue;
                if(curr.contains(sc)){ find = true; }
                if(find){ _blockNodes.push(curr); }
                if(curr.contains(ec)){ break; }
            }
        } else {
            _blockNodes.push(node);
        }
    }

    _blockNodes.forEach((node)=>{
        if(['LI'].indexOf(node.tagName) === -1) return;

        splitChildNode(node.parentNode, getNodeOffset(node));
        const _node = renameTag(node, 'p');
        const p = _node.parentNode;
        insertBefore(_node, p);
        if(p.childElementCount === 0){
            removeNode(p);
        }
    })
}
