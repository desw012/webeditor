export default function (target, payload) {
    const fontNode = document.createElement('span');
    fontNode.style.color = payload;

    const _range = new Range();
    _range.selectNode(target);
    _range.surroundContents(fontNode);
    return true;
}