import {getTextNodes, removeStyleProperty, removeWrapNode, renameTag} from "../../../utils/domUtils";
import underline from "./underline";
import {getAppliedNode} from "../utils";

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

        underline(node);
    });

    removeStyleProperty(appliedNode, 'text-decoration-line');
    if (appliedNode.style.length === 0 && ['U', 'SPAN', 'FONT'].indexOf(appliedNode.tagName) > -1) {
        removeWrapNode(appliedNode);
    } else {
        renameTag(appliedNode, 'span');
    }

    return true;
}