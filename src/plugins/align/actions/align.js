
export default function (target, align) {
    if(['TD', 'TH', 'TABLE'].indexOf(target.tagName) > -1){
        return;
    }

    target.style.textAlign = align;
}