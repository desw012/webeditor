import plugins from "../plugins";
import { PLUGIN_STATUS } from "./Plugin";

export default class PluginManager {
    constructor( context ) {
        this.context = context;
        this.plugin = new Map();

        this.loadingPlugins = new Map();
        this.waitingPlugins = new Map();
    }

    loadPlugin = async ( pluginName ) => {
        const plugin = this.loadingPlugins.get(pluginName);
        const status = plugin.status;
        const loaded = await plugin.load(this);

        if( loaded ){
            this.plugin.set( pluginName, plugin );
            this.loadingPlugins.delete( pluginName );

            if(this.waitingPlugins.get(pluginName)){
                for(const _pluginName of this.waitingPlugins.get(pluginName)){
                    await this.loadPlugin(_pluginName);
                }
                this.waitingPlugins.delete(pluginName)
            }
        } else if(status !== PLUGIN_STATUS.WAIT) {
            const required = plugin.required.filter( pluginName => !this.plugin.get(pluginName) );

            if(required.length > 0) {
                for(const _pluginName of required){
                    this.waitingPlugins.set(_pluginName, [...this.waitingPlugins.get(_pluginName) || [], pluginName]);
                }
            }
        }
    }

    async initPlugins(){
        const pluginNames = this.context.config.plugins;

        //instance 생성
        for( const pluginName of pluginNames){
            const constructor =  plugins[pluginName];
            if(!constructor){
                console.log(`NOT FOUND PLUGIN : ${pluginName}`)
                continue;
            }

            const inst = new constructor( this.context );
            this.loadingPlugins.set(pluginName, inst);
        }

        for( const [pluginName, plugin] of this.loadingPlugins ) {
            await this.loadPlugin(pluginName);
        }

        for(const [key, value] of this.waitingPlugins){
            console.error(`require plugin : ${key}, fail plugin: ' + ${value.join(', ')}`);
        }
    }

    get( pluginName ){
        return this.plugin.get(pluginName);
    }
}