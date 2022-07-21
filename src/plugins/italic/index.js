import Plugin from "../../core/Plugin";
import {
    getBlockNode,
    getTextNodes,
    isCharacterDataNode, removeNode,
    removeStyleProperty,
    removeWrapNode, renameTag, splitNode,
    splitRange
} from "../../utils/domUtils";
import Toolbar from "./Toolbar";
import {Commands} from "../../core/Command";

export default class Italic extends Plugin {
    get pluginName() {
        return 'Italic';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        this.shortcut.on('formatItalic', this.action );
        this.command.on(Commands.italic, this.action )
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    italic = (textNode) => {
        const fontNode = document.createElement('i');

        const _range = new Range();
        _range.selectNode(textNode);
        _range.surroundContents(fontNode);
        return true;
    }

    unItalic = (textNode) => {
        const appliedNode = getAppliedNode(textNode);
        if(!appliedNode) return false;

        if(appliedNode.offsetWidth === 0) {
            return false;
        }

        const _range = new Range();
        _range.selectNodeContents(appliedNode);

        const textNodes = getTextNodes(_range);
        textNodes.forEach((node) => {
            if (textNode === node) return;

            this.italic(node);
        });

        removeStyleProperty(appliedNode, 'font-style');
        if (appliedNode.style.length === 0 && ['I', 'SPAN', 'FONT'].indexOf(appliedNode.tagName) > -1) {
            removeWrapNode(appliedNode);
        } else {
            renameTag(appliedNode, 'span');
        }

    }

    action = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if(range.collapsed){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const isApplied = isAppliedToElement(textNode);
            if(isApplied){
                const rtn = this.unItalic(textNode);
                !rtn && removeNode(textNode);

                this.toolbar && (this.toolbar.active = false);
                rtn && this.selection.collapse(textNode, 1);
            } else {
                const rtn = this.italic(textNode);

                this.toolbar && (this.toolbar.active = true);
                rtn && this.selection.collapse(textNode, 1);
            }
        } else {
            const textNodes = getTextNodes(range);
            let sc = textNodes[0];
            let so = sc === range.startContainer ? range.startOffset : 0;
            let ec = textNodes[textNodes.length - 1];
            let eo = ec === range.endContainer ? range.endOffset : ec.length;

            const NOTAppliedNodes = textNodes.filter( node => {
                return !isAppliedToElement(node);
            });

            const isApplied = NOTAppliedNodes.length === 0;

            if(isApplied){
                textNodes.forEach((target)=>{
                    if(target === range.startContainer){
                        const nodes = splitNode(target, range.startOffset);
                        target = nodes[1];
                        sc = target;
                        so = 0;
                    }
                    if(target === range.endContainer){
                        const nodes = splitNode(target, range.endOffset);
                        target = nodes[0];
                        ec = target;
                        eo = target.length
                    }
                    if(target) this.unItalic(target);
                });
            } else {
                NOTAppliedNodes.forEach((target)=>{
                    if(target === range.startContainer){
                        const nodes = splitNode(target, range.startOffset);
                        target = nodes[1];
                        sc = target
                        so = 0;
                    }
                    if(target === range.endContainer){
                        const nodes = splitNode(target, range.endOffset);
                        target = nodes[0];
                        ec = target;
                        eo = target.length
                    }
                    if(target) this.italic(target);
                });
            }

            const _range = new Range()
            _range.setStart(sc, so);
            _range.setEnd(ec, eo);
            this.selection.removeAllRanges();
            this.selection.addRange(_range);

            this.toolbar && (this.toolbar.active = !isApplied);
        }
    }

    _italic = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            const fontNode = document.createElement('font');
            fontNode.style.fontStyle = 'italic';

            const _range = new Range();
            _range.selectNode(textNode);
            _range.surroundContents(fontNode);

            this.selection.removeAllRanges();
            this.selection.collapse(textNode, 1);
            this.command.emit(Commands.UIUpdateItalicToolBar, true);
        } else {
            range = splitRange(range);
            const textNodes = getTextNodes(range);

            let isApplied = !(textNodes.some( node => {
                return !isAppliedToElement(node);
            }));

            textNodes.forEach((textNode)=>{
                const fontNode = document.createElement('font');
                fontNode.style.fontStyle = isApplied ? 'normal' : 'italic' ;

                const _range = new Range();
                _range.selectNode(textNode);
                _range.surroundContents(fontNode);
            });

            this.selection.removeAllRanges();
            const _range = new Range();
            if(textNodes.length > 1){
                _range.setStart(textNodes[0], 0);
                _range.setEnd(textNodes[textNodes.length - 1], textNodes[textNodes.length - 1].length);
            } else {
                _range.selectNode(textNodes[0]);
            }
            this.selection.addRange(_range);
            this.command.emit(Commands.update_selection, !isApplied);
        }
    }

    updateSelection = () => {
        if(!this.toolbar) return;

        let range = this.selection.getCurrentRange();
        if(!range) return;

        const textNodes = getTextNodes(range);
        let isApplied = false;
        if(textNodes.length > 0) {
            isApplied = !(textNodes.some(node => {
                return !isAppliedToElement(node);
            }));
        }

        this.toolbar.active = isApplied;
    }

    getToolbarItems () {
        if(!this.toolbar){
            this.toolbar = new Toolbar(this);
        }

        return this.toolbar.getItems();
    }
}


const isAppliedToElement = (el) => {
    if(isCharacterDataNode(el)){
        el = el.parentNode;
    }
    const fontStyle = getComputedStyle(el).fontStyle;
    if(fontStyle === 'italic'){
        return true;
    } else {
        return false;
    }
}

const getAppliedNode = (el) => {
    const blockNode = getBlockNode(el);

    let curr, next = el;
    while(curr = next){
        next = curr.parentNode;
        if(blockNode === curr) {
            curr = undefined;
            break;
        }

        if(!isAppliedToElement(next)){
            break;
        }
    }

    return curr;
}