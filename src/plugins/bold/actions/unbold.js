import {getTextNodes, removeStyleProperty, removeWrapNode, renameTag} from "../../../utils/domUtils";
import {getAppliedNode} from "../utils";
import bold from "./bold";

export default function (target) {
    const appliedNode = getAppliedNode(target);
    if(!appliedNode) return false;

    if(appliedNode.offsetWidth === 0) {
        return false;
    }

    const _range = new Range();
    _range.selectNodeContents(appliedNode);

    const textNodes = getTextNodes(_range);
    textNodes.forEach((node) => {
        if (target === node) return;

        bold(node);
    });

    removeStyleProperty(appliedNode, 'font-weight');
    if (appliedNode.style.length === 0 && ['B', 'STRONG', 'SPAN', 'FONT'].indexOf(appliedNode.tagName) > -1) {
        removeWrapNode(appliedNode);
    } else {
        renameTag(appliedNode, 'span');
    }

    return true;
}