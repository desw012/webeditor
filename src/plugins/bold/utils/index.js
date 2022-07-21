import {isBlockNode, isCharacterDataNode} from "../../../utils/domUtils";

export function isAppliedToElement(target){
    if(isCharacterDataNode(target)){
        target = target.parentNode;
    }
    const fontWeight = getComputedStyle(target).fontWeight;
    if(fontWeight === 'bold' || fontWeight === 'bolder'){
        return true;
    } else if(fontWeight === 'normal' || fontWeight === 'lighter'){
        return false;
    } else {
        const weightNum = parseInt("" + fontWeight);
        if(isNaN(weightNum)){ return false; }
        return weightNum > 400 ? true : false;
    }
}

export function getAppliedNode(target){
    let curr, next = target;
    while(curr = next){
        next = curr.parentNode;
        if(isBlockNode(curr)) {
            curr = undefined;
            break;
        }

        if(!isAppliedToElement(next)){
            break;
        }
    }

    return curr;
}