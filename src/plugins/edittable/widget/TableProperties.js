import {
    Fieldset,
    Properties,
    PropertyColor,
    PropertyInput,
    PropertySelect,
    Separator
} from "../../../components/properties";
import {t} from "i18next";
import BorderViewer from "../../../components/BorderViewer";
import {calcTableMatrix, getTextAlign, isBlockNode} from "../../../utils/domUtils";

export default class TableProperties {
    constructor( context ) {
        this.context = context;

        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });

        this.borderViewer = new BorderViewer();
        this.render();
    }

    render = () => {
        const { root, form, button_apply, button_cancel} = Properties.build({
            className : 'popup table_properties focus-visible-none',
            titleName : t('properties.table.title')
        });

        this.root = root;
        this.form = form;
        button_apply.onclick = this.apply;
        button_cancel.onclick = this.close;

        const { ul : wrapTableSize } = Fieldset.build({ parent: form});

        PropertyInput.build({
            parent : wrapTableSize,
            title : t('properties.table.width'),
            id : 'table_properties_height',
            name : 'height',
            value : 0,
            disabled : true
        });

        PropertyInput.build({
            parent : wrapTableSize,
            title : t('properties.table.height'),
            id : 'table_properties_width',
            name : 'width',
            value : 0,
            disabled : true
        });

        Separator.build({
            parent : form
        });

        const { ul : wrapAlign } = Fieldset.build({ parent: form });
        PropertySelect.build({
            parent : wrapAlign,
            title: t('properties.table.align'),
            id: 'table_properties_align',
            name: 'align',
            options: [
                {text: t('properties.table.align.none'), value:'none'},
                {text: t('properties.table.align.left'), value:'left'},
                {text: t('properties.table.align.center'), value:'center'},
                {text: t('properties.table.align.right'), value:'right'}
            ]
        });

        Separator.build({
            parent : form
        });

        const { ul : wrapBackgroundColor } = Fieldset.build({ parent: form });
        PropertyColor.build({
            parent : wrapBackgroundColor,
            title: t('properties.table.background_color'),
            id: 'table_properties_background_color',
            name: 'backgroundColor',
        })

        Separator.build({
            parent : form
        });

        //Border Viewer;
        this.borderViewer.show(form);

        return root;
    }

    show = () => {
        this.context.pm.get('UI').contentContainer.appendChild(this.root);

        this.root.addEventListener('focusout', this.focusout);
        this.root.focus();
    }

    close = (rtn) => {
        this.root.removeEventListener('focusout', this.focusout);
        setTimeout(()=>{this.context.pm.get('UI').contentContainer.removeChild(this.root)});
        this.resolve(rtn);
    }

    getReturn = () => {
        return this.promise;
    }

    focusout = (e) => {
        if(!(e.relatedTarget && this.root.contains(e.relatedTarget)) ){
            this.close();
        }
    }

    update = (table) => {
        const style = getComputedStyle(table);

        //정렬
        const align = table.align || 'none';
        this.form.align && (this.form.align.value = align);

        const matrix = calcTableMatrix(table);

        const sRowIdx = 0;
        const eRowIdx = matrix.length - 1;
        const sColIdx = 0;
        const eColIdx = matrix[0].length - 1;


        const sCellInfo = matrix[sRowIdx][sColIdx];
        const eCellInfo = matrix[eRowIdx][eColIdx];

        const startNodeStyle = getComputedStyle(sCellInfo.node);
        const endNodeStyle = getComputedStyle(eCellInfo.node);

        const hasSelected = sCellInfo.node.hasAttribute('selected')

        if(hasSelected){
            sCellInfo.node.removeAttribute('selected');
        }

        //배경색
        this.form.backgroundColor && (this.form.backgroundColor.value = startNodeStyle.backgroundColor);
        this.form.backgroundColor && (this.form.backgroundColor.style.backgroundColor = startNodeStyle.backgroundColor)

        //border
        const borderStyle = {}
        borderStyle.borderTopStyle = startNodeStyle.borderTopStyle;
        borderStyle.borderTopWidth = startNodeStyle.borderTopWidth;
        borderStyle.borderTopColor = startNodeStyle.borderTopColor;
        borderStyle.borderRightStyle = startNodeStyle.borderRightStyle;
        borderStyle.borderRightWidth = startNodeStyle.borderRightWidth;
        borderStyle.borderRightColor = startNodeStyle.borderRightColor;
        borderStyle.borderBottomStyle = startNodeStyle.borderBottomStyle;
        borderStyle.borderBottomWidth = startNodeStyle.borderBottomWidth;
        borderStyle.borderBottomColor = startNodeStyle.borderBottomColor;
        borderStyle.borderLeftStyle = startNodeStyle.borderLeftStyle;
        borderStyle.borderLeftWidth = startNodeStyle.borderLeftWidth;
        borderStyle.borderLeftColor = startNodeStyle.borderLeftColor;
        borderStyle.borderCenterVerticalStyle = startNodeStyle.borderRightStyle;
        borderStyle.borderCenterVerticalWidth = startNodeStyle.borderRightWidth;
        borderStyle.borderCenterVerticalColor = startNodeStyle.borderRightColor;
        borderStyle.borderCenterHorizontalStyle = startNodeStyle.borderBottomStyle;
        borderStyle.borderCenterHorizontalWidth = startNodeStyle.borderBottomWidth;
        borderStyle.borderCenterHorizontalColor = startNodeStyle.borderBottomColor;
        borderStyle.borderCenterVerticalEditable = false;
        borderStyle.borderCenterHorizontalEditable = false;

        for(let i = sRowIdx; i <= eRowIdx; i++){
            for(let j = sColIdx; j <= eColIdx; j++){
                if(!borderStyle.borderCenterHorizontalEditable
                    && sCellInfo.row != matrix[i][j].row){
                    borderStyle.borderCenterHorizontalEditable = true;
                }
                if(!borderStyle.borderCenterVerticalEditable
                    && sCellInfo.col != matrix[i][j].col){
                    borderStyle.borderCenterVerticalEditable = true;
                }

                if(borderStyle.borderCenterVerticalEditable
                    && borderStyle.borderCenterHorizontalEditable ){
                    break;
                }
            }
            if(borderStyle.borderCenterVerticalEditable
                && borderStyle.borderCenterHorizontalEditable ){
                break;
            }
        }


        borderStyle.borderRightStyle = endNodeStyle.borderRightStyle;
        borderStyle.borderRightWidth = endNodeStyle.borderRightWidth;
        borderStyle.borderRightColor = endNodeStyle.borderRightColor;
        borderStyle.borderBottomStyle = endNodeStyle.borderBottomStyle;
        borderStyle.borderBottomWidth = endNodeStyle.borderBottomWidth;
        borderStyle.borderBottomColor = endNodeStyle.borderBottomColor;

        this.borderViewer.update(borderStyle);

        if(hasSelected){
            sCellInfo.node.setAttribute('selected', '');
        }
    }

    apply = () => {
        let properties = {};

        //정렬
        this.form.align && ( properties.align = this.form.align.value );

        //배경색
        this.form.backgroundColor && ( properties.backgroundColor = this.form.backgroundColor.value );

        if(this.borderViewer.isChnage) {
            properties = {...properties, ...this.borderViewer.getValue()};
        }

        this.close(properties);
    }
}