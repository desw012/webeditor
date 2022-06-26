import Plugin from "../../core/Plugin";


export default class Shortcut extends Plugin {
    get pluginName() {
        return 'Shortcut';
    }

    get required(){
        return ['UI']
    }

    init(){
        this._handlers = {};

        this.ui = this.pm.get('UI');

        //this.ui.document.addEventListener('keyup', this.dispatch);
        this.ui.document.addEventListener('keydown', this.dispatch);
        this.ui.document.addEventListener('beforeinput', this.dispatch);
    }

    dispatch = (e) => {
        switch (e.type){
            case 'beforeinput' :
                console.log(e.inputType);
                const handlers = this._handlers[e.inputType];
                handlers && (e.preventDefault());
                handlers && handlers.forEach((fn)=>{
                    fn(e);
                });

                break;
            case 'keydown' :
                if(90 === e.keyCode){
                    if(e.ctrlKey || e.metaKey){
                        if(e.shiftKey){
                            const handlers = this._handlers['historyRedo'];
                            handlers && (e.preventDefault());
                            handlers && handlers.forEach((fn)=>{
                                fn(e);
                            });
                        } else {
                            const handlers = this._handlers['historyUndo'];
                            handlers && (e.preventDefault());
                            handlers && handlers.forEach((fn)=>{
                                fn(e);
                            });
                        }
                    }
                }
                break;
            default:
                break;
        }

    }

    on = (inputType, callback) => {
        this._handlers[inputType] = this._handlers[inputType] || [];
        this._handlers[inputType].push(callback);
    }
}