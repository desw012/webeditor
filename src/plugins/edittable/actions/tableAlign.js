
export default function (table, align) {
    if(align === 'none'){
        table.removeAttribute('align');
    } else {
        table.align = align;
    }

}