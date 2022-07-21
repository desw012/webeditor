export default class CellSplitInput {
    constructor( context ) {
        this.context = context;

        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });

        this.render();
    }

    render = () => {
        const root = document.createElement('div');
        this.root = root;
        root.tabIndex = -1;
        root.className = 'popup cell_split_input focus-visible-none';

        //header
        const header = document.createElement('div');
        root.appendChild(header);
        header.className = 'header';
        header.innerText = '셀 속성';

        //content
        const content = document.createElement('ul');
        root.appendChild(content);
        content.className = 'content';

        const form = document.createElement('form');
        content.appendChild(form);

        const ul = document.createElement('ul');
        form.appendChild(ul);

        const wrap_row = document.createElement('li');
        ul.appendChild(wrap_row);

        const label_row = document.createElement('label');
        wrap_row.appendChild(label_row);
        label_row.innerText = '행';
        label_row.htmlFor = 'cell_split_input_row';

        const input_row = document.createElement('input');
        wrap_row.appendChild(input_row);
        input_row.id = 'cell_split_input_row';
        input_row.name = 'row';
        input_row.value = '2'
        input_row.type = 'number';

        const wrap_col = document.createElement('li');
        ul.appendChild(wrap_col);

        const label_col = document.createElement('label');
        wrap_col.appendChild(label_col);
        label_col.innerText = '열';
        label_col.htmlFor = 'cell_split_input_col';

        const input_col = document.createElement('input');
        wrap_col.appendChild(input_col);
        input_col.id = 'cell_split_input_col';
        input_col.name = 'col';
        input_col.value = '1'
        input_col.type = 'number';

        //footer
        const footer = document.createElement('div');
        root.appendChild(footer);
        footer.className = 'footer';

        const button_apply = document.createElement('button');
        footer.appendChild(button_apply);
        button_apply.type = 'button';
        button_apply.onclick = this.apply;
        button_apply.innerText = '적용';

        const button_cancel = document.createElement('button');
        footer.appendChild(button_cancel);
        button_cancel.type = 'button';
        button_cancel.onclick = this.close;
        button_cancel.innerText = '닫기';
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

    apply = () => {
        const form = this.root.querySelector('form');
        const row = form.row.value;
        const col = form.col.value;

        this.close({row : row, col : col});
    }

}