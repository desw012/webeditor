import {t} from "i18next";
import { Properties, PropertySelect, PropertyInput, PropertyColor, Fieldset } from "../../../components/properties"
import BorderViewer from "../../../components/BorderViewer";
import {calcTableMatrix} from "../../../utils/domUtils";

export default class CellProperties {

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
            className : 'popup cell_properties focus-visible-none',
            titleName : t('properties.cell.title')
        });

        this.root = root;
        this.form = form;
        button_apply.onclick = this.apply;
        button_cancel.onclick = this.close;

        //셀 사이즈
        const div_size = this._build_size();
        form.appendChild(div_size);

        //구분선
        form.appendChild(document.createElement('hr'));

        //세로 정렬
        const div_verticalAlign = this._build_verticalAlign();
        form.appendChild(div_verticalAlign);

        //구분선
        form.appendChild(document.createElement('hr'));

        //배경색
        const div_backgroundColor = this._build_backgroundColor();
        form.appendChild(div_backgroundColor);

        //구분선
        form.appendChild(document.createElement('hr'));

        //여백
        const div_padding = this._build_padding();
        form.appendChild(div_padding);

        //구분선
        form.appendChild(document.createElement('hr'));

        //Border Viewer;
        this.borderViewer.show(form);
    }

    _build_size = () => {
        const { root, ul } = Fieldset.build();

        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.width'),
            id : 'cell_properties_height',
            name : 'height',
            value : 0,
            disabled : true
        });

        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.height'),
            id : 'cell_properties_width',
            name : 'width',
            value : 0,
            disabled : true
        });

        return root;
    }

    _build_verticalAlign = () => {
        const { root, ul } = Fieldset.build();

        PropertySelect.build({
            parent : ul,
            title: t('properties.cell.vertical_align'),
            id: 'cell_properties_vertical_align',
            name: 'verticalAlign',
            options: [
                {text: t('properties.cell.vertical_align.top'), value:'top'},
                {text: t('properties.cell.vertical_align.middle'), value:'middle'},
                {text: t('properties.cell.vertical_align.bottom'), value:'bottom'}
            ]
        });

        return root;
    }

    _build_backgroundColor = () => {
        const { root, ul } = Fieldset.build();

        PropertyColor.build({
            parent : ul,
            title: t('properties.cell.background_color'),
            id: 'cell_properties_background_color',
            name: 'backgroundColor',
        })

        return root;
    }

    _build_padding = () => {
        const { root, ul } = Fieldset.build();

        //상단 여백
        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.padding_top'),
            id : 'cell_properties_padding_top',
            name : 'paddingTop',
            type : 'number',
            className : 'w_50',
            min : 0,
            max : 5,
            value : '0'
        });

        //하단 여백
        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.padding_bottom'),
            id : 'cell_properties_padding_bottom',
            name : 'paddingBottom',
            type : 'number',
            className : 'w_50',
            min : 0,
            max : 5,
            value : '0'
        });

        //좌측 여백
        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.padding_left'),
            id : 'cell_properties_padding_left',
            name : 'paddingLeft',
            type : 'number',
            className : 'w_50',
            min : 0,
            max : 5,
            value : '0'
        });

        //우측 여백
        PropertyInput.build({
            parent : ul,
            title : t('properties.cell.padding_right'),
            id : 'cell_properties_padding_right',
            name : 'paddingRight',
            type : 'number',
            className : 'w_50',
            min : 0,
            max : 5,
            value : '0'
        });

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

    update = (nodes) => {
        const style = getComputedStyle(nodes[0]);
        const hasSelected = nodes[0].hasAttribute('selected')

        if(hasSelected){
            nodes[0].removeAttribute('selected');
        }

        //사이즈
        this.form.width && (this.form.width.value = style.width);
        this.form.height && (this.form.height.value = style.height);

        //여백
        this.form.paddingTop && (this.form.paddingTop.value = style.paddingTop.replace('px', ''));
        this.form.paddingRight && (this.form.paddingRight.value = style.paddingRight.replace('px', ''));
        this.form.paddingBottom && (this.form.paddingBottom.value = style.paddingBottom.replace('px', ''));
        this.form.paddingLeft && (this.form.paddingLeft.value = style.paddingLeft.replace('px', ''));

        //세로 정렬
        this.form.verticalAlign && (this.form.verticalAlign.value = style.verticalAlign);

        //배경색
        this.form.backgroundColor && (this.form.backgroundColor.value = style.backgroundColor);
        this.form.backgroundColor && (this.form.backgroundColor.style.backgroundColor = style.backgroundColor);

        //border
        const table = nodes[0].closest('table');
        const matrix = calcTableMatrix(table);

        const borderStyle = {}
        borderStyle.borderTopStyle = style.borderTopStyle;
        borderStyle.borderTopWidth = style.borderTopWidth;
        borderStyle.borderTopColor = style.borderTopColor;
        borderStyle.borderRightStyle = style.borderRightStyle;
        borderStyle.borderRightWidth = style.borderRightWidth;
        borderStyle.borderRightColor = style.borderRightColor;
        borderStyle.borderBottomStyle = style.borderBottomStyle;
        borderStyle.borderBottomWidth = style.borderBottomWidth;
        borderStyle.borderBottomColor = style.borderBottomColor;
        borderStyle.borderLeftStyle = style.borderLeftStyle;
        borderStyle.borderLeftWidth = style.borderLeftWidth;
        borderStyle.borderLeftColor = style.borderLeftColor;
        borderStyle.borderCenterVerticalStyle = style.borderRightStyle;
        borderStyle.borderCenterVerticalWidth = style.borderRightWidth;
        borderStyle.borderCenterVerticalColor = style.borderRightColor;
        borderStyle.borderCenterHorizontalStyle = style.borderBottomStyle;
        borderStyle.borderCenterHorizontalWidth = style.borderBottomWidth;
        borderStyle.borderCenterHorizontalColor = style.borderBottomColor;
        borderStyle.borderCenterVerticalEditable = false;
        borderStyle.borderCenterHorizontalEditable = false;

        if(nodes.length > 1){
            const { sRowIdx, eRowIdx, sColIdx, eColIdx } = matrix.getPosition(nodes);
            const sCellInfo = matrix[sRowIdx][sColIdx];
            const eCellInfo = matrix[eRowIdx][eColIdx];

            for(let i = sRowIdx; i <= eRowIdx; i++){
                for(let j = sColIdx; j <= eColIdx; j++){
                    if(!borderStyle.borderCenterHorizontalEditable
                        && sCellInfo.row !== matrix[i][j].row){
                        borderStyle.borderCenterHorizontalEditable = true;
                    }
                    if(!borderStyle.borderCenterVerticalEditable
                        && sCellInfo.col !== matrix[i][j].col){
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


            const endNodeStyle = getComputedStyle(eCellInfo.node);
            borderStyle.borderRightStyle = endNodeStyle.borderRightStyle;
            borderStyle.borderRightWidth = endNodeStyle.borderRightWidth;
            borderStyle.borderRightColor = endNodeStyle.borderRightColor;
            borderStyle.borderBottomStyle = endNodeStyle.borderBottomStyle;
            borderStyle.borderBottomWidth = endNodeStyle.borderBottomWidth;
            borderStyle.borderBottomColor = endNodeStyle.borderBottomColor;
        }

        this.borderViewer.update(borderStyle);

        if(hasSelected){
            nodes[0].setAttribute('selected', '');
        }
    }

    apply = () => {
        let properties = {};

        //여백
        this.form.paddingTop && ( properties.paddingTop = `${this.form.paddingTop.value}px`);
        this.form.paddingBottom && ( properties.paddingBottom = `${this.form.paddingBottom.value}px`);
        this.form.paddingLeft && ( properties.paddingLeft = `${this.form.paddingLeft.value}px`);
        this.form.paddingRight && ( properties.paddingRight = `${this.form.paddingRight.value}px`);
        //세로 정렬
        this.form.verticalAlign && ( properties.verticalAlign = this.form.verticalAlign.value );
        //배경색
        this.form.backgroundColor && ( properties.backgroundColor = this.form.backgroundColor.value );

        //border
        if(this.borderViewer.isChnage) {
            properties = {...properties, ...this.borderViewer.getValue()}
        }

        this.close(properties);
    }

}