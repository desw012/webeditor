import {
    BLOCK_CANDIDATE_NODE,
    BLOCK_NODE,
    INLINE_NODE_STYLE_DISPLAY,
    NOT_SPLIT_NODE,
    TABLE_NODE
} from "../config/constant";

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





export const getBlockNode = (node, offset) => {
    if(!isCharacterDataNode(node) && isNaN(offset)){
        const _node = node.childNodes[offset];
        node && (node = _node);
    }

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

export const createBlockNode = (node) => {
    let p;
    if(node) {
        p = node.cloneNode(false);
    } else {
        p = document.createElement('p');
        p.style.margin = '0px';
        p.style.lineHeight = '1.5'
    }

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

export const getNextElementSibling = (node, selector) => {
    let curr, next = node.nextElementSibling;
    while(curr = next){
        next = node.nextElementSibling;

        if(curr.matches(selector)){
            break
        }
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
    const {
        commonAncestorContainer : cc,
        startContainer : sc,
        startOffset : so,
        endContainer : ec,
        endOffset : eo
    } = range;

    const scBlockNode = getBlockNode(sc, so);
    const ccBlockNode = getBlockNode(cc);
    const ecBlockNode = getBlockNode(ec);

    const blockNodes = new Array();
    const nodes = cc.querySelectorAll('*');
    let find = false;
    for( const curr of nodes ) {
        if(!find && curr.contains(sc)){ find = true; }
        if(!isBlockNode(curr)) continue;
        if(find){ blockNodes.push(curr); }
        if(curr === ecBlockNode){
            break;
        }
    }

    if(blockNodes.length === 0){
        ccBlockNode && (blockNodes.push(ccBlockNode));
    }
    return blockNodes;

    // const scBlockNode = getBlockNode(sc);
    // const ccBlockNode = getBlockNode(cc);
    // const ecBlockNode = getBlockNode(ec);
    //
    //
    //
    // if(ccBlockNode === scBlockNode){
    //     blockNodes.push(scBlockNode);
    // } else {
    //     const p = cc.closest('body, td, th');
    //     const nodes = p.querySelectorAll('*');
    //
    //     let find = false;
    //     for(const curr of nodes){
    //         if(!isBlockNode(curr)) continue;
    //         if(curr === scBlockNode){ find = true; }
    //         if(find){ blockNodes.push(curr); }
    //         if(curr === ecBlockNode){ break; }
    //     }
    // }
    //
    // return blockNodes;
}

/**
 * range를 포함한 같은 레벨의 블럭 노드만 리턴한다.
 */
export const getSiblingBlockNodes = ( range ) => {
    const {
        commonAncestorContainer : cc,
        startContainer : sc,
        startOffset : so,
        endContainer : ec,
        endOffset : eo
    } = range;

    const blockNodes = new Array();

    const scBlockNode = getBlockNode(sc);
    const ccBlockNode = getBlockNode(cc);

    if(ccBlockNode === scBlockNode){
        blockNodes.push(scBlockNode);
    } else {
        const p = cc.closest('body, td, th');

        let curr, next = p.firstChild, find = false;
        while(curr = next){
            next = curr.nextSibling;
            if(!isBlockNode(curr)) continue;
            if(curr.contains(sc)){ find = true; }
            if(find){ blockNodes.push(curr); }
            if(curr.contains(ec)){ break; }
        }
    }

    return blockNodes;
}

export const getTextNodes = (range) => {
    const cc = range.commonAncestorContainer;
    let sc = range.startContainer;
    let so = range.startOffset;
    let ec = range.endContainer;
    let eo = range.endOffset;

    const startNode = isCharacterDataNode(sc) ? sc : sc.childNodes[so];
    const endNode = isCharacterDataNode(ec) ? ec : ec.childNodes[eo];

    const textNodes = new Array();
    let curr, next = startNode;
    while(curr = next){
        next = curr.firstChild;
        if(!next) { next = curr.nextSibling; }
        if(!next) {
            let p = curr.parentNode;
            while(p && p !== cc && !(next = p.nextSibling)){
                p = p.parentNode;
            }
        }
        if(isCharacterDataNode(curr)) {
            if(curr.data.trim() !== '') textNodes.push(curr);
        }

        if(curr === endNode || (!endNode && ec === curr.parentNode && !curr.nextSibling)){
            break;
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
        if( offset >= node.childNodes.length ) {
            return [node, undefined];
        } else {
            const child = node.childNodes[offset + 1];
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

export const removeNodeAndMoveToParent = (node) => {
    let curr;
    while(curr = node.firstChild){
        insertBefore(curr, node);
    }
    node.parentNode.removeChild(node);
}
export const wrap = (node, wrapNodeName) => {
    const wrap = document.createElement(wrapNodeName);
    insertBefore(wrap, node);
    wrap.appendChild(node);
    return wrap;
}

/**
 * 노드의 이름을 변경.
 * algorithm https://w3c.github.io/editing/docs/execCommand/#common-algorithms
 */
export const renameTag = (node, nodeName) => {
    if(node.tagName === nodeName.toUpperCase()) return node;
    if(!node.parentNode) return node;

    const newNode = document.createElement(nodeName);
    node.parentNode.insertBefore(newNode, node);

    for (let i = node.attributes.length - 1; i >= 0; --i) {
        newNode.attributes.setNamedItem(node.attributes[i].cloneNode());
    }

    while (node.firstChild) {
        newNode.appendChild(node.firstChild);
    }

    node.parentNode.removeChild(node);

    return newNode;
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

export const removeChildNodeAll = (node) => {
    let t;
    while(t = node.firstChild){
        node.removeChild(t);
    }
}

export const removeChild = (p, so, eo) => {
    let curr, next = p.childNodes[so], end = p.childNodes[eo];
    while(curr = next){
        next = curr.nextSibling;
        if(curr === end) break;

        p.removeChild(curr);
    }
}

export const scrollParent = (node) => {
    const regex = /(auto|scroll)/;
    let curr, next = node;
    while(curr = next){
        if(!(curr instanceof HTMLElement)){ return undefined }

        next = curr.parentNode;

        if(regex.test(getComputedStyle(curr).overflow)){
            return curr;
        }
        if(regex.test(getComputedStyle(curr).overflowY)){
            return curr;
        }
        if(regex.test(getComputedStyle(curr).overflowX)){
            return curr;
        }
    }
    return curr;
}

//==================================================
// Range Utils
//==================================================
/**
 * @deprecated Table Node와 본문은 같이 selection 불가하도록 수정
 *
 * Range 범위에 해당 되는 노드는 제거한다.
 * Table 관련 노드는 유지.
 * Process
 * 1. collapsed 인 경우 range를 리턴한다.
 * 2. TextNode 인경우. range.deleteContents() 수행
 * 3. Table 노드를 함하지 않은 경우. range.deleteContents() 수행
 * 4. commonAncestorContainer로 부터 전체 Loop
 * 4.1. 현재 노드가 startContainer와 같으면 이후 노드는 삭제
 * 4.2. 현재 노드가 endContainer와 같으면 이전 노드는 삭제
 * 4.3. 현재 노드에 startContainer 또는 endContainer를 포함한 경우 skip
 * 4.4. 테이블 노드가 아닌 테이블 관련 노드인 경우 Skip
 * 4.5. 그 외에 삭제한다.
 */
export const deleteContents = (range) => {
    const cc = range.commonAncestorContainer;
    const sc = range.startContainer;
    const so = range.startOffset;
    const ec = range.endContainer;
    const eo = range.endOffset;

    if(range.collapsed){
        return range;
    }
    if(isCharacterDataNode(cc)){
        range.deleteContents();
        return range;
    }
    if(cc.querySelectorAll('table, tr, th, td').length === 0){
        range.deleteContents();
        return range;
    }

    const iterator = document.createNodeIterator(
        cc
        , NodeFilter.SHOW_ALL
        , (node) => {
            return NodeFilter.FILTER_ACCEPT;
        });

    let curr, find = false;

    while(curr = iterator.nextNode()){
        if(curr === sc) { find = true; }
        if(!find) continue;

        if(curr === sc){
            if(isCharacterDataNode(curr)){
                curr.deleteData(so, curr.length);
            } else {
                removeChild(curr, so, curr.childNodes.length);
            }
        } else if(curr === ec){
            if(isCharacterDataNode(curr)){
                curr.deleteData(0, eo);
            } else {
                removeChild(curr, 0, eo);
            }
        } else if(curr.contains(sc) || curr.contains(ec) ){
            //skip
        } else if('TABLE' !== curr.nodeName && TABLE_NODE.indexOf(curr.nodeName) > -1){

        } else {
            if(!curr.nextSibling
                && ['TD', 'TH'].indexOf(curr.parentNode.nodeName)
                && curr.parentNode.childNodes.length === 1){
                const blockNode = createBlockNode();
                curr.parentNode.insertBefore(blockNode, curr);
            }

            removeNode(curr);
        }

        if( curr == ec ) { break; }
    }

    const _range = new Range()
    _range.setStart(sc, so);
    _range.setEnd(sc, so);
    return _range;
}

//==================================================
// Table Utils
//==================================================
export const calcTableMatrix = (table) => {
    const matrix = new Array();
    for(let row = 0 ; row < table.rows.length; row++){
        matrix[row] = new Array();
    }

    for(let row = 0 ; row < table.rows.length; row++){
        for(let col = 0; col < table.rows[row].cells.length; col++){
            const node = table.rows[row].cells[col];
            const rowSpan = node.rowSpan;
            const colSpan = node.colSpan;

            let _row = row;
            let _col = col;

            if(matrix[_row][_col]){
                while(matrix[_row][++_col]){ }
            }

            const info = {
                node : node,
                row : _row,
                cell : _col,
                col : _col,
                rowSpan : rowSpan,
                colSpan : colSpan
            }

            for( let i = 0; i < rowSpan; i++){
                for(let j = 0; j < colSpan; j++){
                    if(!matrix[_row+i][_col+j]) matrix[_row+i][_col+j] = info;
                }
            }
        }
    }

    matrix.getRowIndex = function(node) {
        return node.parentNode.rowIndex;
    }
    matrix.getColIndex = function(node) {
        for( const info of this[this.getRowIndex(node)]){
            if(info.node === node){
                return info.cell;
            }
        }
    }
    matrix.getPosition = function(nodes) {
        let sRowIdx = matrix.length;
        let eRowIdx = -1;
        let sColIdx = matrix[0].length;
        let eColIdx = -1;

        for(const node of nodes){
            const cellInfo = this[this.getRowIndex(node)][this.getColIndex(node)];
            sRowIdx = Math.min(sRowIdx, cellInfo.row);
            eRowIdx = Math.max(eRowIdx, cellInfo.row + cellInfo.rowSpan - 1);
            sColIdx = Math.min(sColIdx, cellInfo.col);
            eColIdx = Math.max(eColIdx, cellInfo.col + cellInfo.colSpan - 1);
        }

        return {
            sRowIdx: sRowIdx,
            eRowIdx: eRowIdx,
            sColIdx: sColIdx,
            eColIdx: eColIdx
        }
    }

    return matrix;
}

export const calcTableSize = (table) => {
    const iterator = document.createNodeIterator(table
        , NodeFilter.SHOW_ELEMENT
        , node => {
            if(['TABLE', 'TD', 'TH'].indexOf(node.nodeName) > -1) return NodeFilter.FILTER_ACCEPT;
            else if(['TD', 'TH'].indexOf(node.parentNode.nodeName) > -1) return NodeFilter.FILTER_REJECT;
            else return NodeFilter.FILTER_SKIP;
        });

    let node;
    while(node = iterator.nextNode()){
        const rect = node.getBoundingClientRect()
        node.style.width = `${rect.width}px`;
        node.style.height = `${rect.height}px`;
        node.style.boxSizing = 'border-box';
    }
}

//==================================================
// Style Utils
//==================================================
export const getTextAlign = (node) => {
    const textAlign = getComputedStyle(node).textAlign;
    switch (textAlign){
        case 'start':
        case 'left':
            return 'left';
        case 'center':
            return 'center';
        case 'end':
        case 'right':
            return 'right';
        default:
            return '';
    }
}