import { removeStyleProperty } from "../../../utils/domUtils";

export default function( target, actionType, indent ){
    let marginLeft;
    if(!isNaN(indent)){
        marginLeft = indent * 40;
    } else {
        marginLeft = Number(target.style.marginLeft.replace('px', '')) || 0;
        if(actionType === 'indent'){
            marginLeft += 40;
        } else {
            marginLeft -= 40;
        }
    }
    if(marginLeft > 0) {
        target.style.marginLeft = `${marginLeft}px`;
    } else {
        removeStyleProperty(target, 'margin-left');
    }
}