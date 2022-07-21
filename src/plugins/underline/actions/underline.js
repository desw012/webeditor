export default function (target) {
    const fontNode = document.createElement('u');

    const _range = new Range();
    _range.selectNode(target);
    _range.surroundContents(fontNode);
    return true;
}