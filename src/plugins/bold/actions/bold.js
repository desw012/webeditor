export default function (target) {
    const fontNode = document.createElement('b');

    const _range = new Range();
    _range.selectNode(target);
    _range.surroundContents(fontNode);
    return true;
}