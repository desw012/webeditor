import PluginManager from "./PluginManager";
import Command, { Commands } from "./Command";

export default class Context {

    constructor( config ) {
        this.config = config;
        this.root = this.config.root;

    }

    async init(){
        this.command = new Command();
        this.pm = new PluginManager(this);

        this.execCommand = this.command.emit;
    }

    async initPlugins(){
        await this.pm.initPlugins();
        await this.command.emit(Commands.plugin_load_complete);
    }

    static async create( config ) {
        const context = new this( config )

        await context.init();
        await context.initPlugins();
        return context;
    }
}