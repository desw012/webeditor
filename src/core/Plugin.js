export default class Plugin {
    _status = PLUGIN_STATUS.READY;

    constructor( context ) {
        this.context = context;
        this.pm = context.pm;
        this.command = context.command;
        this._status = PLUGIN_STATUS.LOADING;
    }

    get status() {
        return this._status;
    }

    get pluginName() {
        return 'Plugin';
    }

    get required(){
        return [];
    }

    async load( pm ) {
        if (this.required) {
            const required = this.required.some(
                pluginName => !pm.plugin.get(pluginName)
            );

            if (required) {
                this._status = PLUGIN_STATUS.WAIT;
                return false;
            }
        }

        try {
            await this.init();
            this._status = PLUGIN_STATUS.LOADED;
            return true;
        } catch(e) {
            console.error(e)
            this._status = PLUGIN_STATUS.FAIL;
        }
        return false;
    }

    async init () {

    }

    getToolbarItems () {
        return [];
    }
}

export const PLUGIN_STATUS = {
    READY : 'READY',
    LOADING : 'LOADING',
    WAIT : 'WAIT',
    LOADED : 'LOADED',
    FAIL : 'FAIL'
}