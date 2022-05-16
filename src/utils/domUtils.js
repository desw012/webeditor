import {BLOCK_CANDIDATE_NODE, BLOCK_NODE, INLINE_NODE_STYLE_DISPLAY, NOT_SPLIT_NODE} from "../config/constant";

export const isCharacterDataNode = node => {
    const t = node.nodeType;
    return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
}

export const isBlockNode = (node) => {
    if(!node) return false;
    if(node.nodeType != Node.ELEMENT_NODE) return false;

    if(BLOCK_NODE.indexOf(node.nodeName) === -1) return false;

    return INLINE_NODE_STYLE_DISPLAY.indexOf(getComputedStyle(node).display) === -1;
}

/**
 * @deprecated
 * startContainer, endContainer를 offset에 따라 split하여 Text Node로 변경.
 */
export const splitRange = (range) => {
    let sc = range.startContainer;
    let so = range.startOffset;
    let ec = range.endContainer;
    let eo = range.endOffset;

    const _range = range.cloneRange();
    if( range.collapsed ){
        if (isCharacterDataNode(sc) && so > 0 && eo < ec.length) {
            const node = sc.cloneNode(false);
            node.deleteData(so, node.length - so);
            insertBefore(node, sc);
            sc.deleteData(0, so)

            _range.setStart(sc, 0);
            _range.setEnd(sc, 0);
        }
    } else {
        if (isCharacterDataNode(ec) && eo < ec.length) {
            const node = ec.cloneNode(false);
            node.deleteData(0, eo);
            insertAfter(node, ec);

            ec.deleteData(eo, ec.length - eo);
            _range.setEnd(ec, ec.length);
        }

        if (isCharacterDataNode(sc) && so > 0) {
            const node = sc.cloneNode(false);
            node.deleteData(so, node.length - so);
            insertBefore(node, sc);

            sc.deleteData(0, so)
            _range.setStart(sc, 0);
        }
    }

    return _range;
}





export const getBlockNode = (node) => {
    let curr, next = node;
    while(curr = next){
        next = curr.parentNode;

        if(isBlockNode(curr)){ break; }
    }

    return curr;
}



export const splitRangeBlockNode = (range) => {
    const ranges = new Array();
    const startBlockNode = getBlockNode(range.startContainer);
    const endBlockNode = getBlockNode(range.endContainer);

    const blockNodes = getBlockNodes(range);
    blockNodes.forEach((node)=>{
        const _range = new Range();
        _range.setStart(node, 0);
        _range.setEnd(node, node.childNodes.length);

        if(node === startBlockNode){
            _range.setStart(range.startContainer, range.startOffset);
        }

        if(node === endBlockNode){
            _range.setEnd(range.endContainer, range.endOffset);
        }

        ranges.push(_range);
    })
    return ranges;
}



export const getLinkNode = (node) => {
    if(isCharacterDataNode(node)){
        node = node.parentNode;
    }

    let _curr, _next = node;
    while(_curr = _next){
        if(_curr.nodeName === 'A'){
            return _curr;
        }

        if( ['BODY', 'TABLE', 'TD', 'TH', 'TBODY', 'THEAD'].indexOf(_curr.nodeName) > -1 ){
            return null;
        }

        _next = _curr.parentNode;
    }
}

export const getCommonAncestor = (nodeList) => {
    if(nodeList.length === 0) return null;
    if(nodeList.length === 1) return nodeList[0].parentNode;

    let p = nodeList[0].parentNode;

    for( let i = 1; i < nodeList.length; i++){
        const node = nodeList[i];
        while(!p.contains(node)){
            p = p.parentNode;
        }
    }
    return p;
}

/**
 * node의 자식 노드를 split한다.
 */
export const splitChildNode = (node, startPos, cnt) => {
    const childNodes = new Array();
    let rtnNode = node;
    node.childNodes.forEach((child)=>{
        childNodes.push(child);
    })

    cnt = cnt || 0;
    if(startPos > 0) {
        const cloneNode = node.cloneNode(false);
        insertBefore(cloneNode, node);

        for(let i = 0; i < startPos; i++){
            cloneNode.appendChild(childNodes[i]);
        }
    }


    if(cnt > 0) {
        const cloneNode = node.cloneNode(false);
        insertBefore(cloneNode, node);

        for(let i = startPos; i < startPos + cnt; i++){
            cloneNode.appendChild(childNodes[i]);
        }
        rtnNode = cloneNode;
    }

    return rtnNode;
}
//
// export const splitRange2 = (range) => {
//     if(range.collapsed){
//         const splitNodes = splitNode(range.startContainer, range.startOffset);
//         const _range = new Range();
//         _range.selectNode(splitNodes[0]);
//         _range.collapse();
//         return _range;
//     } else {
//         const cc = range.commonAncestorContainer;
//         const sc = range.startContainer;
//         const so = range.startOffset;
//         const ec = range.endContainer;
//         const eo = range.endOffset;
//         let sn, en;
//
//         if(!isCharacterDataNode(ec)){
//             en = ec.childNodes[eo];
//         }
//         if(!isCharacterDataNode(sc)){
//             sn = sc.childNodes[so];
//         }
//
//         if(isCharacterDataNode(ec)){
//             const splitNodes = splitNode(ec, eo);
//             en = splitNodes[0];
//         }
//
//         if(isCharacterDataNode(sc)){
//             const _sc = sc === ec ? en : sc;
//             const splitNodes = splitNode(_sc, so);
//             sn = splitNodes[1];
//         }
//
//         while(cc !== ec && cc !== en.parentNode){
//             const splitNodes = splitNode(en.parentNode, getNodeOffset(en) + 1);
//             en = splitNodes[0];
//         }
//
//         while(cc !== sc && cc !== sn.parentNode){
//             const splitNodes = splitNode(sn.parentNode, getNodeOffset(sn));
//             sn = splitNodes[1];
//         }
//
//         if(!en && cc === ec){
//             en = ec.childNodes[ec.childNodes.length - 1];
//         }
//
//         const _range = new Range();
//         _range.setStart(sn.parentNode, getNodeOffset(sn));
//         _range.setEnd(en.parentNode, getNodeOffset(en) + 1);
//         return _range;
//     }
// }

export const removeWrapNode = ( node ) => {
    let curr;
    while(curr = node.firstChild){
        insertBefore(curr, node);
    }
    node.parentNode.removeChild(node);
}

export const createBlockNode = () => {
    const p = document.createElement('p');
    p.style.margin = '0px';
    p.style.lineHeight = '1.5'

    const br = document.createElement('br');
    p.appendChild(br);

    return p;
}

/**
 * @deprecated
 * @param node
 * @returns {any[]}
 */
export const createBlockNodeAndWrapChild = ( node ) => {
    let curr, next = node.firstChild;
    let blockNode = null;
    let blockNodes = new Array();
    while(curr = next){
        next = curr.nextSibling;

        if(isBlockNode(curr)){
            blockNode = null;

            blockNodes.push(curr);
        } else if( 'BR' === curr.tagName ) {
            if(!blockNode){
                blockNode = createBlockNode();
            }
            insertBefore(blockNode, curr);
            node.removeChild(curr);
            blockNodes.push(blockNode);
            blockNode = null;
        } else {
            if(!blockNode){
                blockNode = createBlockNode();
                removeChildNodeAll(blockNode);

                insertBefore(blockNode, curr);
                blockNodes.push(blockNode);
            }
            blockNode.appendChild(curr);
        }
    }

    return blockNodes;
}


/*
export const moveToChild = (src, dest, ) => {
    let curr, next = src.firstChild;
    while(curr = next){
        next = curr.nextSibling;

        dest.appendChild(curr);
    }
}
 */



//==================================================
// Range 탐색 functions
//==================================================
export const getParentNodeByNodeName = (node, nodeNames) => {
    let curr, next = node;
    while(curr = next){
        if(nodeNames.indexOf(curr.tagName) > -1){
            break;
        }

        next = curr.parentNode;
    }
    return curr;
}

//==================================================
// Node 탐색 functions
//==================================================
/**
 * 해당 노드가 부모로부터의 몇번째 노드인지 찾는다.
 */
export const getNodeOffset = (node) => {
    let curr, next = node.parentNode.firstChild, offset = 0;
    if(!next) return -1;
    while( (curr = next) && curr !== node){
        next = curr.nextSibling;
        offset++;
    }
    return offset;
}

/**
 * 해당 Range에 포함된 Block Node List를 리턴한다.
 */
export const getBlockNodes = (range) => {
    const blockNodes = new Array();

    const startBlockNode = getBlockNode(range.startContainer);
    const endBlockNode = getBlockNode(range.endContainer);

    if(startBlockNode === endBlockNode){
        blockNodes.push(startBlockNode);
    } else {
        const commonAncestor = getCommonAncestor([startBlockNode, endBlockNode]);
        const iterator = document.createNodeIterator( commonAncestor
            , NodeFilter.SHOW_ELEMENT
            , (node) => {
                return NodeFilter.FILTER_ACCEPT;
            });

        let node, find = false;
        while(node = iterator.nextNode()){
            if(node === startBlockNode) { find = true; }
            if(!find) continue;

            if( isBlockNode(node) ) {
                blockNodes.push(node);
            }

            if(node === endBlockNode) { break; }
        }
    }

    return blockNodes;
}

export const getTextNodes = (range) => {
    const cc = range.commonAncestorContainer;
    const sc = range.startContainer;
    const so = range.startOffset;
    const ec = range.endContainer;
    const eo = range.endOffset;

    const textNodes = new Array();

    const startNode = isCharacterDataNode(sc) ? sc :  sc.childNodes[so];
    const endNode = isCharacterDataNode(ec) ? ec :  ec.childNodes[eo];
    if(startNode === endNode && isCharacterDataNode(startNode)){
        textNodes.push(startNode);
    } else {
        const iterator = document.createNodeIterator(range.commonAncestorContainer
            , NodeFilter.SHOW_ALL
            , (node)=>{ return NodeFilter.FILTER_ACCEPT; });

        let node, find = false;

        while(node = iterator.nextNode()){
            if(node === startNode) { find = true; }
            if(node === endNode) { break; }
            if(!find) continue;

            if(isCharacterDataNode(node)) {
                textNodes.push(node);
            }

            if(!endNode && ec === node.parentNode && ec.childNodes.length - 1 === getNodeOffset(node)) {
                break;
            }
        }

    }

    return textNodes;
}


export const getNodePath = (root, node) => {
    const paths = new Array();
    if(!root.contains(node)) return paths;

    let curr, next = node;

    while(curr = next){
        next = curr.parentNode;

        paths.push(curr);

        if(root === curr){
            break;
        }
    }

    return paths;

}

//==================================================
// Node 분할 functions
//==================================================
/**
 * node를 offset 기준으로 앞뒤로 split하여 array로 리턴한다.
 */
export const splitNode = (node, offset) => {
    if(NOT_SPLIT_NODE.indexOf(node.nodeName) > -1) {
        return [node, node];
    }

    if( isCharacterDataNode(node)){
        if( offset <= 0 ) {
            return [undefined, node];
        } else if( offset >= node.length ){
            return [node, undefined];
        } else {
            const _node = node.splitText(offset);
            return [node, _node];
        }
    } else {
        if( offset === 0 ){
            return [undefined, node];
        } else if( offset === node.childNodes.length ) {
            return [node, undefined];
        } else {
            const child = node.childNodes[offset];
            const _node = node.cloneNode(false);
            insertAfter(_node, node);

            let curr, next = child;
            while(curr = next){
                next = curr.nextSibling;
                _node.appendChild(curr);
            }

            return [node, _node];
        }
    }
}

/**
 * TextNode의
 */
export const splitTextNode = (range) => {
    const cc = range.commonAncestorContainer;
    const sc = range.startContainer;
    const so = range.startOffset;
    const ec = range.endContainer;
    const eo = range.endOffset;

    const _range = range.cloneRange()
    if(range.collapsed && isCharacterDataNode(ec)){
        const nodes = splitNode(ec, eo);
        const p = ec.parentNode;
        if(nodes[1]){
            _range.setStart(p, getNodeOffset(nodes[1]));
            _range.setEnd(p, getNodeOffset(nodes[1]));
        } else if( nodes[0].nextSibling ){
            _range.setStart(p, getNodeOffset(nodes[0].nextSibling));
            _range.setEnd(p, getNodeOffset(nodes[0].nextSibling));
        } else {
            _range.setStart(p, p.childNodes.length)
            _range.setStart(p, p.childNodes.length);
        }
    } else {
        if (isCharacterDataNode(ec)) {
            const nodes = splitNode(ec, eo);
            const p = ec.parentNode;
            if(nodes[1]){
                _range.setEnd(p, getNodeOffset(nodes[1]));
            } else if( nodes[0].nextSibling ){
                _range.setEnd(p, getNodeOffset(nodes[0].nextSibling));
            } else {
                _range.setEnd(p, p.childNodes.length);
            }
        }

        if (isCharacterDataNode(sc)) {
            const nodes = splitNode(sc, so);
            const p = sc.parentNode;
            if(nodes[1]){
                _range.setStart(p, getNodeOffset(nodes[1]));
            } else if( nodes[0].nextSibling ){
                _range.setStart(p, getNodeOffset(nodes[0].nextSibling));
            } else {
                _range.setStart(p, p.childNodes.length);
            }
        }
    }

    return _range;
}

/**
 * target Node 까지 split
 */
export const splitNodeToTarget = (target, node) => {
    let rtn;
    let curr, next = node.nextSibling;

    if(!next){
        next = node.parentNode;
    }

    while(curr = next){
        next = curr.parentNode;
        if(target === curr){
            break;
        }
        rtn = splitNode(curr.parentNode, getNodeOffset(curr) );
    }

    return rtn;
}

//==================================================
// Node 이동 functions
//==================================================
export const insertAfter = (src, desc) => {
    const nextNode = desc.nextSibling;
    const parent = desc.parentNode;
    if (nextNode) {
        parent.insertBefore(src, nextNode);
    } else {
        parent.appendChild(src);
    }
}

export const insertBefore = (src, desc) => {
    desc.parentNode.insertBefore(src, desc);
}

export const removeNode = (node) => {
    node.parentNode.removeChild(node);
}

export const removeChildNodeAll = (node) => {
    let t;
    while(t = node.firstChild){
        node.removeChild(t);
    }
}

export const removeNodeAndMoveToParent = (node) => {
    let curr;
    while(curr = node.firstChild){
        insertBefore(curr, node);
    }
    node.parentNode.removeChild(node);
}

export const renameTag = (src, nodeName) => {
    if(src.tagName === nodeName.toUpperCase()) return;

    const dest = document.createElement(nodeName);

    while (src.firstChild) {
        dest.appendChild(src.firstChild);
    }

    for (let i = src.attributes.length - 1; i >= 0; --i) {
        dest.attributes.setNamedItem(src.attributes[i].cloneNode());
    }

    src.parentNode.replaceChild(dest, src);
}

//==================================================
// Node Utils
//==================================================
export const removeStyleProperty = (node, property) => {
    if(node.style.removeProperty) {
        node.style.removeProperty(property);
    } else {
        node.style.removeAttribute(property);
    }
}

//==================================================
// Range Utils
//==================================================
export const deleteContents = (range) => {
    const cc = range.commonAncestorContainer;
    const sc = range.startContainer;
    const so = range.startOffset;
    const ec = range.endContainer;
    const eo = range.endOffset;

    let curr, next = sc, p;
    //1. 시작노드 부터 root 까지 삭제
    while(curr = next) {
        p = curr;
        while( p.parentNode != cc && !(next = p.nextSibling) ){
            p = p.parentNode;
        }

        if(curr === sc && isCharacterDataNode(curr)){
            curr.deleteData(so, curr.length);
        } else {
            removeNode(curr);
        }
    }

    //2. p부터 ec가 포함되지 않은 노드 탐색
    next = p;
    while(curr = next){
        next = curr.nextSibling;
        if(next.contains(ec)){ break; }
        removeNode(curr);
    }

    //3.
    next = p.firstChild;
    while( curr = next ){
        while(next = curr.firstChild){

        }

    }
}

window.deleteContents = deleteContents;
