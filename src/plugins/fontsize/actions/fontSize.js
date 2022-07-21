export default function (target, payload) {
    const fontNode = document.createElement('span');
    fontNode.style.fontSize = payload;

    const _range = new Range();
    _range.selectNode(target);
    _range.surroundContents(fontNode);

    //FIXME 중첨 노드 제거, textNode
    return true;
}