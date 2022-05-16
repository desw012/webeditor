export default class Toolbar {
    constructor(plugin) {
        this.plugin = plugin;
        this.build();
    }

    getItems = () => {
        return [this.root];
    }

    onClick = async (e) => {
        const el = e.currentTarget;
        const value = JSON.parse(el.value);

        await this.plugin.insertTable(value);
        await this.plugin.ui.focus();
    }

    build(){
        this.root = document.createElement('li');

        const button = document.createElement('button');
        this.root.append(button);
        button.className = 'toolbar-item';
        button.type = 'button';
        button.title = 'InsertTable';
        button.value = 'InsertTable';
        button.onclick = this.showSelectDiv;

        const text = document.createElement("span");
        button.appendChild(text);
        text.innerText = 'T';
    }

    showSelectDiv = () => {
        const tableSelect = this.buildSelectDiv();
        this.root.appendChild(tableSelect);

        tableSelect.addEventListener('focusout', (e)=>{
            if(!(e.relatedTarget && tableSelect.contains(e.relatedTarget)) ){
                this.root.removeChild(tableSelect);
            }
        });
        tableSelect.focus();
    }

    buildSelectDiv = () => {
        const divLayer = document.createElement("div");
        divLayer.className = 'div_layer';
        divLayer.tabIndex = -1;

        const wrap = document.createElement("div");
        divLayer.appendChild(wrap);
        wrap.className = 'layer_table_select';

        const labelWrap = document.createElement("div");
        divLayer.appendChild(labelWrap);

        const label = document.createElement("span");
        label.innerText = '0 x 0';
        labelWrap.appendChild(label);

        const mouseover = (e) => {
            const json = JSON.parse(e.currentTarget.value);
            label.innerText = `${json.row} x ${json.col}`;

            const gridItemList = wrap.querySelectorAll('div');

            for( let row  = 0; row < 10; row++ ){
                for( let col  = 0; col < 10; col++ ){
                    const gridItem = gridItemList[row * 10 + col]
                    if(row < json.row && col < json.col){
                        if(!gridItem.classList.contains('active')){
                            gridItem.classList.add('active');
                        }
                    }else {
                        if(gridItem.classList.contains('active')) {
                            gridItem.classList.remove('active');
                        }
                    }
                }
            }
        }

        for(let row = 1; row <= 10; row++){
            for(let col = 1; col <= 10; col++){
                const item = document.createElement("div");
                wrap.appendChild(item);

                const button = document.createElement("button");
                button.value = JSON.stringify({row:row, col:col});
                button.onmouseover = mouseover;
                button.onclick = this.onClick;

                item.appendChild(button);
            }
        }

        return divLayer;
    }
}