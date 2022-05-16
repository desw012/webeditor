import Plugin from "../../core/Plugin";
import {insertAfter, insertBefore} from "../../utils/domUtils";

export default class Undo extends Plugin {
    _buff = [];
    _undo = [];
    _redo = [];

    get pluginName() {
        return 'Undo';
    }

    get required(){
        return ['UI', 'Shortcut', 'Selection']
    }

    init () {
        this.ui = this.context.pm.get('UI');
        this.shortcut = this.context.pm.get('Shortcut');
        this.selection = this.context.pm.get('Selection');

        this.shortcut.on('historyUndo', (e)=>{ this.undo(); });
        this.shortcut.on('historyRedo', (e)=>{ this.redo(); });

        this.observer = new MutationObserver((e)=>{ this.record(e) });
        this.start();
    }

    record = (mutations) => {
        if(this._buff.length > 0) {
            const lastMutation = this._buff[this._buff.length - 1];
            if(lastMutation.type !== 'characterData') {
                this.flush();
            }
        }

        this._buff.push(...mutations)
    }

    save = (mutations) => {
        const currRange = this.selection.getCurrentRange();
        this._redo.splice(0, this._redo.length);

        this._undo.push({
            mutations: mutations,
            range : {
                startContainer : currRange.startContainer,
                startOffset : currRange.startOffset,
                endContainer : currRange.endContainer,
                endOffset : currRange.endOffset
            }
        });
    }

    undo = () => {
        this.flush();
        this.stop();
        const task = this._undo.pop();
        if(task){
            this._redo.push(task);

            const mutations = task.mutations;
            for(let i = mutations.length - 1; i >= 0; i--){
                const mutation = mutations[i];

                switch (mutation.type){
                    case 'characterData':
                        mutation.newValue = mutation.target.data;
                        mutation.target.data = mutation.oldValue;
                        break;
                    case 'childList':
                        mutation.addedNodes.forEach((node)=>{
                            mutation.target.removeChild(node);
                        });
                        mutation.removedNodes.forEach((node)=>{
                            if(mutation.nextSibling){
                                insertBefore(node, mutation.nextSibling)
                            } else if(mutation.previousSibling) {
                                insertAfter(node, mutation.previousSibling);
                            } else {
                                mutation.target.appendChild(node)
                            }
                        });
                        break;
                    case 'attributes':
                        mutation.newValue = mutation.target.getAttribute(mutation.attributeName);
                        mutation.target.setAttribute(mutation.attributeName, mutation.oldValue || '');
                        break;
                    default:
                        break;
                }
            }

            if(this._undo.length > 0){
                const _task = this._undo[this._undo.length - 1];
                const range = new Range();
                range.setStart(_task.range.startContainer, _task.range.startOffset);
                range.setStart(_task.range.endContainer, _task.range.endOffset);

                this.selection.removeAllRanges();
                this.selection.addRange(range);
            }
        }

        this.start();
    }

    redo = () => {
        this.flush();
        this.stop();
        const task = this._redo.pop();
        if(task){
            this._undo.push(task);
            const mutations = task.mutations;
            for(let i = 0; i < mutations.length; i++){
                const mutation = mutations[i];

                switch (mutation.type){
                    case 'characterData':
                        mutation.target.data = mutation.newValue;
                        break;
                    case 'childList':
                        mutation.addedNodes.forEach((node)=>{
                            if(mutation.nextSibling){
                                insertBefore(node, mutation.nextSibling)
                            } else if(mutation.previousSibling) {
                                insertAfter(node, mutation.previousSibling);
                            } else {
                                mutation.target.appendChild(node)
                            }
                        });
                        mutation.removedNodes.forEach((node)=>{
                            mutation.target.removeChild(node)
                        });
                        break;
                    case 'attributes':
                        mutation.target.setAttribute(mutation.attributeName, mutation.newValue || '');
                        break;
                    default:
                        break;
                }
            }

            if(task.range){
                const range = new Range();
                range.setStart(task.range.startContainer, task.range.startOffset);
                range.setStart(task.range.endContainer, task.range.endOffset);

                this.selection.removeAllRanges();
                this.selection.addRange(range);
            }
        }

        this.start();
    }

    flush = () => {
        if(this._buff.length === 0) {
            return;
        }
        const temp = this._buff.splice(0, this._buff.length);

        if(temp[temp.length - 1].type === 'characterData'){
            const prevMutation = temp[temp.length - 1];
            temp.push({
                addedNodes : [],
                attributeName : null,
                attributeNamespace : null,
                nextSibling : null,
                oldValue : prevMutation.target.data,
                previousSibling : null,
                removedNodes : [],
                target: prevMutation.target,
                type : 'characterData',
            });
        }

        this.save(temp);
    }

    start = () => {
        const config = {
            childList: true,	            // 타겟의 하위 요소 추가 및 제거 감지
            attributes: true,	            // 타켓의 속성 변경를 감지
            characterData: true,	        // 타겟의 데이터 변경 감지
            subtree: true,	                // 타겟의 자식 노드 아래로도 모두 감지
            attributeOldValue: true,	    // 타겟의 속성 변경 전 속성 기록
            characterDataOldValue: true	    // 타겟의 데이터 변경 전 데이터 기록
        };
        this.observer.observe(this.ui.document.body, config);
    }

    stop = () => {
        this.observer.disconnect();
    }
}