export default function (target, payload) {
    const fontNode = document.createElement('span');
    fontNode.style.backgroundColor = payload;

    const _range = new Range();
    _range.selectNode(target);
    _range.surroundContents(fontNode);
    return true;
}