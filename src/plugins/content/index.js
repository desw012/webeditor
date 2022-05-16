import { _webapp } from "../../config";
import Plugin from "../../core/Plugin";

export default class Content extends Plugin {
    get pluginName() {
        return 'Content';
    }

    get required() {
        return ['UI'];
    }

    init(){
        this.ui = this.pm.get('UI');

        this.context.getContent = this.getContent.bind(this);
        this.context.setContent = this.setContent.bind(this);
    }

    getContent = () => {
        return replaceHost(this.ui.document.body.innerHTML);
    }

    setContent = ( strContent ) => {
        this.ui.document.body.innerHTML = strContent;
    }
}

const replaceHost = (strContent) => {
    strContent = strContent.replace(/[\u200B-\u200D\uFEFF]/g, '');

    strContent = strContent.replace(new RegExp("http://"+location.host+":80"+_webapp+"/DownController", "g"), _webapp+"/DownController");
    strContent = strContent.replace(new RegExp("https://"+location.host+":80"+_webapp+"/DownController", "g"), _webapp+"/DownController");
    strContent = strContent.replace(new RegExp("http://"+location.host+_webapp+"/DownController", "g"), _webapp+"/DownController");
    strContent = strContent.replace(new RegExp("https://"+location.host+_webapp+"/DownController", "g"), _webapp+"/DownController");

    return strContent;
}