import {getBlockNode, isCharacterDataNode} from "../../../utils/domUtils";

export function isAppliedToElement(el){
    if(isCharacterDataNode(el)){
        el = el.parentNode;
    }
    const textDecorationLine = getComputedStyle(el).textDecorationLine;
    if(textDecorationLine === 'underline'){
        return true;
    } else {
        return false;
    }
}

export function getAppliedNode(el){
    const blockNode = getBlockNode(el);

    let curr, next = el;
    while(curr = next){
        next = curr.parentNode;
        if(blockNode === curr) {
            curr = undefined;
            break;
        }

        if(!isAppliedToElement(next)){
            break;
        }
    }

    return curr;
}