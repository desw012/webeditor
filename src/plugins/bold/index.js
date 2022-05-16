import Plugin from "../../core/Plugin";
import Toolbar from "./Toolbar";

import {
    getBlockNode, getNodePath,
    getTextNodes, insertBefore,
    isCharacterDataNode, removeStyleProperty, removeWrapNode,
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

        this.shortcut.on('formatBold', this.bold);
        this.command.on(Commands.bold, this.bold);
        this.command.on(Commands.update_selection, this.updateSelection);
    }

    bold = () => {
        let range = this.selection.getCurrentRange();
        if(!range) return;

        this.undo.flush();
        debugger;
        range = splitTextNode(range);

        if( range.collapsed ){
            const textNode = document.createTextNode('\u200B');
            range.insertNode(textNode);

            if(isAppliedToElement(textNode)){
                const appliedNode = getAppliedNode(textNode);
                if(!appliedNode) return;

                const _range = new Range();
                _range.setStart(appliedNode, 0);
                _range.setEnd(appliedNode, appliedNode.childNodes.length);
                const textNodes = getTextNodes(_range);

                textNodes.forEach((node) => {
                    if( textNode === node ) return;

                    const fontNode = document.createElement('b');

                    const _range = new Range();
                    _range.selectNode(node);
                    _range.surroundContents(fontNode);
                });

                removeStyleProperty(appliedNode, 'font-weight');
                if(appliedNode.style.length === 0) {
                    removeWrapNode(appliedNode);
                } else if( appliedNode.tagName === 'B' || appliedNode.tagName === 'STRONG' ){
                    const node = document.createElement('span');

                }

                this.toolbar && (this.toolbar.active = false);
            } else {
                const fontNode = document.createElement('b');

                const _range = new Range();
                _range.selectNode(textNode);
                _range.surroundContents(fontNode);

                this.selection.collapse(textNode, 1);

                this.toolbar && (this.toolbar.active = true);
            }

            this.selection.collapse(textNode, 1);
        } else {
            const textNodes = getTextNodes(range);
            const NOTAppliedNodes = textNodes.filter( node => {
                return !isAppliedToElement(node);
            })

            const isApplied = NOTAppliedNodes.length === 0;

            if(isApplied){
                textNodes.forEach((target)=>{
                    if(NOTAppliedNodes.indexOf(target) > -1) return;

                    let appliedNode = getAppliedNode(target);
                    splitNodeToTarget(appliedNode, target);
                    if(target.previousSibling){
                        appliedNode = getAppliedNode(target);
                        splitNodeToTarget(appliedNode, target.previousSibling);
                    }

                    appliedNode = getAppliedNode(target);
                    removeWrapNode(appliedNode);
                });
            } else {
                NOTAppliedNodes.forEach((textNode)=>{
                    const fontNode = document.createElement('b');

                    const _range = new Range();
                    _range.selectNode(textNode);
                    _range.surroundContents(fontNode);
                });
            }

            const _range = new Range();
            if(textNodes.length > 1){
                _range.setStart(textNodes[0], 0);
                _range.setEnd(textNodes[textNodes.length - 1], textNodes[textNodes.length - 1].length);
            } else {
                _range.selectNode(textNodes[0]);
            }

            this.selection.removeAllRanges();
            this.selection.addRange(_range);

            this.toolbar && (this.toolbar.active = !isApplied);
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