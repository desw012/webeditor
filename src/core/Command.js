import EventEmitter from "eventemitter3";

export default class Command {
    constructor() {
        this.command = new EventEmitter();
    }

    on = (type, callback) => {
        this.command.on(type, callback);
    }

    emit = async (type, payload) => {
        console.info(`command : ${type}`);
        this.command.emit(type, payload);
    }
}

export const Commands = {

    bold : 'bold',//bold on/off, impl: plugin/bold
    contentReadOnly : 'contentReadOnly',//미구현
    copy : 'copy',//미구현
    createLink : 'createLink',
    cut : 'cut',//미구현
    decreaseFontSize : 'decreaseFontSize',//미구현
    delete : 'delete',//미구현
    enableInlineTableEditing : 'enableInlineTableEditing',//미구현
    enableObjectResizing : 'enableObjectResizing',//미구현
    fontName : 'fontName',//폰트 변경, impl : plugins/fontname
    fontSize : 'fontSize',//폰트 사이즈 변경, impl : plugins/fontsize
    foreColor : 'foreColor',//텍스트 색상, impl : plugins/fontcolor
    formatBlock : 'formatBlock',//미구현
    forwardDelete : 'forwardDelete',//미구현
    heading : 'heading',//미구현
    hiliteColor : 'hiliteColor', //[미구현]배경색
    increaseFontSize : 'increaseFontSize', //[미구현], Big 태그 추가
    indent : 'indent',//들여쓰기 impl : plugins/indent
    insertBrOnReturn : 'insertBrOnReturn',//[미구현]
    insertHorizontalRule : 'insertHorizontalRule',//가로줄 삽입, impl : plugins/inserthorizontalrule
    insertHTML : 'insertHTML',//[미구현]
    insertImage : 'insertImage',//[미구현]
    insertOrderedList : 'insertOrderedList',//
    insertUnorderedList : 'insertUnorderedList',//
    insertParagraph : 'insertParagraph',//[미구현]
    insertText : 'insertText',//텍스트 삽입, impl : plugins/insertext
    italic : 'italic',//이탤릭 on/off impl : plugins/italic
    justifyCenter : 'justifyCenter',//가운데정렬 impl :  plugins/align
    justifyFull : 'justifyFull',//[미구현]
    justifyLeft : 'justifyLeft',//좌측정렬 impl :  plugins/align
    justifyRight : 'justifyRight',//우측정렬 impl :  plugins/align
    outdent : 'outdent',//내어쓰기 impl : plugins/indent
    paste : 'paste',//[미구현]
    redo : 'redo',//history undo, impl : plugins/undo
    removeFormat : 'removeFormat',//[미구현]
    selectAll : 'selectAll',//[미구현] 기본 사용
    strikeThrough : 'strikeThrough',//[미구현] 가로줄 on/off
    subscript : 'subscript',//[미구현] 아래첨자 on/off
    superscript : 'superscript',//[미구현] 윗첨자 on/off
    underline : 'underline',//unserline on/off, impl : plugins/underline
    undo : 'undo',//history undo, impl : plugins/undo
    unlink : 'unlink',//링크 노드 제거, impl : plugins/InsertLink
    useCSS : 'useCSS',//[미구현], CSS 사용 제어
    styleWithCSS : 'styleWithCSS',//[미구현], 스타일 속성 제어
    

    focus : 'focus',
    plugin_load_complete : 'plugin_load_complete',
    update_selection : 'update_selection',
}

//FIXME
Commands.backColor = 'backColor'