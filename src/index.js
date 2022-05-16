import { default as xClickEditor } from './core/Context'
import { default as defaultConfig } from './config';

const contextMap = new Map();
if(!window.xClickEditor){
    window.xClickEditor = {
        create : ( config ) => {
            if( contextMap.get(config.id) ){
                return contextMap.get(config.id);
            }

            const _config = {...defaultConfig, ...config};

            xClickEditor.create(_config).then(r => {
                contextMap.set(r.config.id, r);
            });
        },
        get : ( id ) => {
            return contextMap.get(id);
        }
    }
}

