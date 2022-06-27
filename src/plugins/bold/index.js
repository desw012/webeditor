import Plugin from "../../core/Plugin";
import Toolbar from "./Toolbar";

import {
    getBlockNode, getNodePath,
    getTextNodes, insertBefore,
    isCharacterDataNode, removeNode, removeStyleProperty, removeWrapNode, renameTag,
    splitNode, splitNodeToTarget,
    splitTextNode
} from "../../utils/domUtils";
import {Commands} from "../../core/Command";


export default class Bold extends Plugin {
    get pluginName() {
        return 'Bold';
    }

    get required(){
        return ['UI', 'Selection', 'Undo', 'Shortcut']
    }

    init() {
        this.ui = this.pm.get('UI');
        this.selection = this.pm.get('Selection');
        this.undo = this.pm.get('Undo');
        this.shortcut = this.pm.get('Shortcut');

        this.shortcut.on('formatBold', this.action);
        this.command.on(Commands.bold, this.action);
        this.command.on(Commands.update_selection, this.updateSelection);
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
                const rtn = this.unBold(textNode);
                !rtn && removeNode(textNode);

                this.toolbar && (this.toolbar.active = false);
                rtn && this.selection.collapse(textNode, 1);
            } else {
                const rtn = this.bold(textNode);

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
                    if(target) this.unBold(target);
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
                    if(target) this.bold(target);
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

    unBold = ( textNode ) => {
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

            const fontNode = document.createElement('b');

            const _range = new Range();
            _range.selectNode(node);
            _range.surroundContents(fontNode);
        });

        removeStyleProperty(appliedNode, 'font-weight');
        if (appliedNode.style.length === 0 && ['B', 'STRONG', 'SPAN', 'FONT'].indexOf(appliedNode.tagName) > -1) {
            removeWrapNode(appliedNode);
        } else {
            renameTag(appliedNode, 'span');
        }

        return true;
    }

    bold = (textNode) => {
        const fontNode = document.createElement('b');

        const _range = new Range();
        _range.selectNode(textNode);
        _range.surroundContents(fontNode);
        return true;
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
    const fontWeight = getComputedStyle(el).fontWeight;
    if(fontWeight === 'bold' || fontWeight === 'bolder'){
        return true;
    } else if(fontWeight === 'normal' || fontWeight === 'lighter'){
        return false;
    } else {
        const weightNum = parseInt("" + fontWeight);
        if(isNaN(weightNum)){ return false; }
        return weightNum > 400 ? true : false;
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