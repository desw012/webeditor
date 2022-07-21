import {Fieldset, PropertyColor, PropertyInput, PropertySelect} from "./properties";
import {t} from "i18next";

export default class BorderViewer {
    constructor() {
        this.borderStyle = 'solid';
        this.borderWidth = '1';
        this.borderColor = '#000000';

        this.value = {
            borderTopStyle : 'solid',
            borderTopWidth : '1px',
            borderTopColor : 'black',

            borderRightStyle : 'solid',
            borderRightWidth : '1px',
            borderRightColor : 'black',

            borderBottomStyle : 'solid',
            borderBottomWidth : '1px',
            borderBottomColor : 'black',

            borderLeftStyle : 'solid',
            borderLeftWidth : '1px',
            borderLeftColor : 'black',

            borderCenterVerticalEditable : true,
            borderCenterVerticalStyle : 'solid',
            borderCenterVerticalWidth : '1px',
            borderCenterVerticalColor : 'black',

            borderCenterHorizontalEditable : true,
            borderCenterHorizontalStyle : 'solid',
            borderCenterHorizontalWidth : '1px',
            borderCenterHorizontalColor : 'black'
        }

        this.build();
    }

    build = () => {
        const { root, ul } = Fieldset.build({
            className : 'border_viewer'
        });
        this.root = root;

        const borderStyleOptions = BORDER_STYLES.map((style)=>{
            return {text:style, value:style};
        })
        PropertySelect.build({
            parent : ul,
            title : t('border_view.border_style'),
            id : 'BorderViewer_borderStyle',
            name : 'borderStyle',
            options : borderStyleOptions,
            value : this.borderStyle
        });

        PropertyInput.build({
            parent : ul,
            title : t('border_view.border_width'),
            id : 'BorderViewer_borderWidth',
            name : 'borderWidth',
            type : 'number',
            className : 'w_50',
            min : 0,
            max : 5,
            value : this.borderWidth
        });

        PropertyColor.build({
            parent : ul,
            title: t('border_view.border_color'),
            id: 'BorderViewer_borderColor',
            name: 'borderColor',
            value : this.borderColor
        })

        const wrap_viewer = document.createElement('div');
        root.appendChild(wrap_viewer);
        wrap_viewer.className = 'wrap_viewer';

        const wrap_top = document.createElement('div');
        wrap_viewer.appendChild(wrap_top);
        wrap_top.className = 'top';

        const button_border_none = document.createElement('button');
        wrap_top.appendChild(button_border_none);
        button_border_none.className = 'img_cell_border_none';
        button_border_none.type = 'button';
        button_border_none.dataset.target = 'borderNone';
        button_border_none.onclick = this.apply;

        const button_border_outside = document.createElement('button');
        wrap_top.appendChild(button_border_outside);
        button_border_outside.className = 'img_cell_border_outside';
        button_border_outside.type = 'button';
        button_border_outside.dataset.target = 'borderOutSide';
        button_border_outside.onclick = this.apply;

        const button_border_inside = document.createElement('button');
        wrap_top.appendChild(button_border_inside);
        button_border_inside.className = 'img_cell_border_inside';
        button_border_inside.type = 'button';
        button_border_inside.dataset.target = 'borderInSide';
        button_border_inside.onclick = this.apply;

        const wrap_center = document.createElement('div');
        wrap_viewer.appendChild(wrap_center);
        wrap_center.className = 'center';

        const wrap_center_right = document.createElement('div');
        wrap_center.appendChild(wrap_center_right);
        wrap_center_right.className = 'right';

        const button_border_top = document.createElement('button');
        wrap_center_right.appendChild(button_border_top);
        button_border_top.className = 'img_cell_border_top';
        button_border_top.type = 'button';
        button_border_top.dataset.target = 'borderTop';
        button_border_top.onclick = this.apply;

        const button_border_center_horizontal = document.createElement('button');
        wrap_center_right.appendChild(button_border_center_horizontal);
        button_border_center_horizontal.className = 'img_cell_border_center_horizontal';
        button_border_center_horizontal.type = 'button';
        button_border_center_horizontal.dataset.target = 'borderCenterHorizontal';
        button_border_center_horizontal.onclick = this.apply;

        const button_border_bottom = document.createElement('button');
        wrap_center_right.appendChild(button_border_bottom);
        button_border_bottom.className = 'img_cell_border_bottom';
        button_border_bottom.type = 'button';
        button_border_bottom.dataset.target = 'borderBottom';
        button_border_bottom.onclick = this.apply;

        const wrap_center_content = document.createElement('div');
        wrap_center.appendChild(wrap_center_content);
        wrap_center_content.className = 'content';

        const wrap_bottom = document.createElement('div');
        wrap_viewer.appendChild(wrap_bottom);
        wrap_bottom.className = 'bottom';

        const button_border_left = document.createElement('button');
        wrap_bottom.appendChild(button_border_left);
        button_border_left.className = 'img_cell_border_left';
        button_border_left.type = 'button';
        button_border_left.dataset.target = 'borderLeft';
        button_border_left.onclick = this.apply;

        const button_border_center_vertical = document.createElement('button');
        wrap_bottom.appendChild(button_border_center_vertical);
        button_border_center_vertical.className = 'img_cell_border_center_vertical';
        button_border_center_vertical.type = 'button';
        button_border_center_vertical.dataset.target = 'borderCenterVertical';
        button_border_center_vertical.onclick = this.apply;

        const button_border_right = document.createElement('button');
        wrap_bottom.appendChild(button_border_right);
        button_border_right.className = 'img_cell_border_right';
        button_border_right.type = 'button';
        button_border_right.dataset.target = 'borderRight';
        button_border_right.onclick = this.apply;

        //viewer 내부
        const list = [];
        for(let i = 0; i < 5; i++){
            const row = document.createElement('div');
            for(let j = 0; j < 5; j++){
                const col = document.createElement('div');
                row.appendChild(col);
                list.push(col);
            }
            wrap_center_content.appendChild(row);
        }
        this.top1 = list[ 5 * 0 + 1 ];
        this.top2 = list[ 5 * 0 + 3 ];
        this.left1 = list[ 5 * 1 + 0 ];
        this.left2 = list[ 5 * 3 + 0 ];
        this.right1 = list[ 5 * 1 + 4 ];
        this.right2 = list[ 5 * 3 + 4 ];
        this.bottom1 = list[ 5 * 4 + 1 ];
        this.bottom2 = list[ 5 * 4 + 3 ];
        this.centerVertical1 = list[ 5 * 1 + 2 ];
        this.centerVertical2 = list[ 5 * 3 + 2 ];
        this.centerHorizontal1 = list[ 5 * 2 + 1 ];
        this.centerHorizontal2 = list[ 5 * 2 + 3 ];

        this.top1.className = 'cur_p';
        this.top2.className = 'cur_p';
        this.left1.className = 'cur_p';
        this.left2.className = 'cur_p';
        this.right1.className = 'cur_p';
        this.right2.className = 'cur_p';
        this.bottom1.className = 'cur_p';
        this.bottom2.className = 'cur_p';
        this.centerVertical1.className = 'cur_p';
        this.centerVertical2.className = 'cur_p';
        this.centerHorizontal1.className = 'cur_p';
        this.centerHorizontal2.className = 'cur_p';

        this.centerVertical1.appendChild(document.createElement('div'));
        this.centerVertical1.firstElementChild.style.height = '100%';
        this.centerVertical2.appendChild(document.createElement('div'));
        this.centerVertical2.firstElementChild.style.height = '100%';
        this.centerHorizontal1.appendChild(document.createElement('div'));
        this.centerHorizontal1.firstElementChild.style.width = '100%';
        this.centerHorizontal2.appendChild(document.createElement('div'));
        this.centerHorizontal2.firstElementChild.style.width = '100%';

        this.top1.dataset.target = 'borderTop';
        this.top2.dataset.target = 'borderTop';
        this.right1.dataset.target = 'borderRight';
        this.right2.dataset.target = 'borderRight';
        this.bottom1.dataset.target = 'borderBottom';
        this.bottom2.dataset.target = 'borderBottom';
        this.left1.dataset.target = 'borderLeft';
        this.left2.dataset.target = 'borderLeft';
        this.centerVertical1.dataset.target = 'borderCenterVertical';
        this.centerVertical2.dataset.target = 'borderCenterVertical';
        this.centerHorizontal1.dataset.target = 'borderCenterHorizontal';
        this.centerHorizontal2.dataset.target = 'borderCenterHorizontal';

        this.top1.onclick = this.apply;
        this.top2.onclick = this.apply;
        this.right1.onclick = this.apply;
        this.right2.onclick = this.apply;
        this.bottom1.onclick = this.apply;
        this.bottom2.onclick = this.apply;
        this.left1.onclick = this.apply;
        this.left2.onclick = this.apply;
        this.centerVertical1.onclick = this.apply;
        this.centerVertical2.onclick = this.apply;
        this.centerHorizontal1.onclick = this.apply;
        this.centerHorizontal2.onclick = this.apply;
    }

    apply = (e) => {
        this.borderStyle = this.root.querySelector('[name=borderStyle]').value;
        this.borderWidth = this.root.querySelector('[name=borderWidth]').value;
        this.borderColor = this.root.querySelector('[name=borderColor]').value;

        const target = e.currentTarget.dataset.target;
        const value = {};
        switch (target){
            case 'borderTop':
            case 'borderRight':
            case 'borderBottom':
            case 'borderLeft':
            case 'borderCenterVertical':
            case 'borderCenterHorizontal':
                if(this.value[`${target}Style`] === 'none'){
                    value[`${target}Style`] = this.borderStyle;
                    value[`${target}Width`] = `${this.borderWidth}px`;
                    value[`${target}Color`] = this.borderColor;
                } else {
                    value[`${target}Style`] = 'none';
                    value[`${target}Width`] = '';
                    value[`${target}Color`] = '';
                }
                break;
            case 'borderNone' :
                value.borderTopStyle = 'none';
                value.borderTopWidth = '';
                value.borderTopColor = '';
                value.borderRightStyle = 'none';
                value.borderRightWidth = '';
                value.borderRightColor = '';
                value.borderBottomStyle = 'none';
                value.borderBottomWidth = '';
                value.borderBottomColor = '';
                value.borderLeftStyle = 'none';
                value.borderLeftWidth = '';
                value.borderLeftColor = '';
                value.borderCenterVerticalStyle = 'none';
                value.borderCenterVerticalWidth = '';
                value.borderCenterVerticalColor = '';
                value.borderCenterHorizontalStyle = 'none';
                value.borderCenterHorizontalWidth = '';
                value.borderCenterHorizontalColor = '';
                break;
            case 'borderOutSide' :
                value.borderTopStyle = this.borderStyle;
                value.borderTopWidth = `${this.borderWidth}px`;
                value.borderTopColor = this.borderColor;
                value.borderRightStyle = this.borderStyle;
                value.borderRightWidth = `${this.borderWidth}px`;
                value.borderRightColor = this.borderColor;
                value.borderBottomStyle = this.borderStyle;
                value.borderBottomWidth = `${this.borderWidth}px`;
                value.borderBottomColor = this.borderColor;
                value.borderLeftStyle = this.borderStyle;
                value.borderLeftWidth = `${this.borderWidth}px`;
                value.borderLeftColor = this.borderColor;
                break;
            case 'borderInSide' :
                value.borderCenterVerticalStyle = this.borderStyle;
                value.borderCenterVerticalWidth = `${this.borderWidth}px`;
                value.borderCenterVerticalColor = this.borderColor;
                value.borderCenterHorizontalStyle = this.borderStyle;
                value.borderCenterHorizontalWidth = `${this.borderWidth}px`;
                value.borderCenterHorizontalColor = this.borderColor;
                break;
            default :
                break
        }
        this.update(value);
        this.isChnage = true;
    }

    show = (target) => {
        target.append(this.root);
    }

    update = ( value ) => {
        const prevValue = this.value;
        this.value = {...prevValue, ...value};

        this.top1.style.borderTopStyle = this.value.borderTopStyle;
        this.top1.style.borderTopWidth = this.value.borderTopWidth;
        this.top1.style.borderTopColor = this.value.borderTopColor;

        this.top2.style.borderTopStyle = this.value.borderTopStyle;
        this.top2.style.borderTopWidth = this.value.borderTopWidth;
        this.top2.style.borderTopColor = this.value.borderTopColor;

        this.right1.style.borderRightStyle = this.value.borderRightStyle;
        this.right1.style.borderRightWidth = this.value.borderRightWidth;
        this.right1.style.borderRightColor = this.value.borderRightColor;

        this.right2.style.borderRightStyle = this.value.borderRightStyle;
        this.right2.style.borderRightWidth = this.value.borderRightWidth;
        this.right2.style.borderRightColor = this.value.borderRightColor;

        this.bottom1.style.borderBottomStyle = this.value.borderBottomStyle;
        this.bottom1.style.borderBottomWidth = this.value.borderBottomWidth;
        this.bottom1.style.borderBottomColor = this.value.borderBottomColor;

        this.bottom2.style.borderBottomStyle = this.value.borderBottomStyle;
        this.bottom2.style.borderBottomWidth = this.value.borderBottomWidth;
        this.bottom2.style.borderBottomColor = this.value.borderBottomColor;

        this.left1.style.borderLeftStyle = this.value.borderLeftStyle;
        this.left1.style.borderLeftWidth = this.value.borderLeftWidth;
        this.left1.style.borderLeftColor = this.value.borderLeftColor;

        this.left2.style.borderLeftStyle = this.value.borderLeftStyle;
        this.left2.style.borderLeftWidth = this.value.borderLeftWidth;
        this.left2.style.borderLeftColor = this.value.borderLeftColor;

        this.centerVertical1.firstElementChild.style.borderLeftStyle = this.value.borderCenterVerticalStyle;
        this.centerVertical1.firstElementChild.style.borderLeftWidth = this.value.borderCenterVerticalWidth;
        this.centerVertical1.firstElementChild.style.borderLeftColor = this.value.borderCenterVerticalColor;

        this.centerVertical2.firstElementChild.style.borderLeftStyle = this.value.borderCenterVerticalStyle;
        this.centerVertical2.firstElementChild.style.borderLeftWidth = this.value.borderCenterVerticalWidth;
        this.centerVertical2.firstElementChild.style.borderLeftColor = this.value.borderCenterVerticalColor;

        this.centerHorizontal1.firstElementChild.style.borderTopStyle = this.value.borderCenterHorizontalStyle;
        this.centerHorizontal1.firstElementChild.style.borderTopWidth = this.value.borderCenterHorizontalWidth;
        this.centerHorizontal1.firstElementChild.style.borderTopColor = this.value.borderCenterHorizontalColor;

        this.centerHorizontal2.firstElementChild.style.borderTopStyle = this.value.borderCenterHorizontalStyle;
        this.centerHorizontal2.firstElementChild.style.borderTopWidth = this.value.borderCenterHorizontalWidth;
        this.centerHorizontal2.firstElementChild.style.borderTopColor = this.value.borderCenterHorizontalColor;

        const borderCenterVerticalWidth = Number(this.value.borderCenterVerticalWidth.replace('px', ''));
        const borderCenterHorizontalWidth = Number(this.value.borderCenterHorizontalWidth.replace('px', ''));
        if(!isNaN(borderCenterVerticalWidth)){
            this.centerVertical1.firstElementChild.style.transform = `translateX(${(5-borderCenterVerticalWidth)/2}px)`;
            this.centerVertical2.firstElementChild.style.transform = `translateX(${(5-borderCenterVerticalWidth)/2}px)`;
        }
        if(!isNaN(borderCenterHorizontalWidth)){
            this.centerHorizontal1.firstElementChild.style.transform = `translateY(${(5-borderCenterHorizontalWidth)/2}px)`;
            this.centerHorizontal2.firstElementChild.style.transform = `translateY(${(5-borderCenterHorizontalWidth)/2}px)`;
        }

        if(prevValue.borderCenterVerticalEditable !== this.value.borderCenterVerticalEditable
            || prevValue.borderCenterHorizontalEditable !== this.value.borderCenterHorizontalEditable){

            if(this.value.borderCenterVerticalEditable || this.value.borderCenterHorizontalEditable) {
                this.root.querySelector('button[data-target=borderInSide]').disabled = false;
            } else {
                this.root.querySelector('button[data-target=borderInSide]').disabled = true;
            }

            if(this.value.borderCenterVerticalEditable) {
                this.root.querySelector('button[data-target=borderCenterVertical]').disabled = false;
                this.root.querySelectorAll('div[data-target=borderCenterVertical]').forEach((node)=>{
                    node.removeAttribute('disabled');
                });
            } else {
                this.root.querySelector('button[data-target=borderCenterVertical]').disabled = true;
                this.root.querySelectorAll('div[data-target=borderCenterVertical]').forEach((node)=>{
                    node.setAttribute('disabled', '');
                });
            }

            if(this.value.borderCenterHorizontalEditable) {
                this.root.querySelector('button[data-target=borderCenterHorizontal]').disabled = false;
                this.root.querySelectorAll('div[data-target=borderCenterHorizontal]').forEach((node)=>{
                    node.removeAttribute('disabled');
                });
            } else {
                this.root.querySelector('button[data-target=borderCenterHorizontal]').disabled = true;
                this.root.querySelectorAll('div[data-target=borderCenterHorizontal]').forEach((node)=>{
                    node.setAttribute('disabled', '');
                });
            }

        }
    }

    getValue = () => {
        return this.value;
    }

}

export const BORDER_STYLES = ['solid', 'double', 'dashed', 'dotted', 'none'];

