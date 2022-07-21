import {getNodeOffset, isCharacterDataNode} from "../../utils/domUtils";

/**
 *
 */
export class KeepRange {
    constructor( range ) {
        this.commonAncestorContainer = range.commonAncestorContainer;
        this.startContainer = range.startContainer;
        this.startOffset = range.startOffset;
        this.endContainer = range.endContainer;
        this.endOffset = range.endOffset;
        this.startNode = isCharacterDataNode(range.startContainer) ? range.startContainer : range.startContainer.childNodes[range.startOffset];
        this.endNode = isCharacterDataNode(range.endContainer) ? range.endContainer : range.endContainer.childNodes[range.endOffset];
    }

    getRange () {
        const range = new Range();

        if(isCharacterDataNode(this.startNode)){
            range.setStart(this.startContainer, this.startOffset);
        } else {
            range.setStart(this.startNode.parentNode, getNodeOffset(this.startNode));
        }
        if(isCharacterDataNode(this.endNode)){
            range.setEnd(this.endContainer, this.endOffset);
        } else {
            range.setEnd(this.endNode.parentNode, getNodeOffset(this.endNode));
        }

        return range;
    }
}