import applyCellProperties from "./applyCellProperties";
import {removeStyleProperty} from "../../../utils/domUtils";
import tableAlign from "./tableAlign";

export default function(table, properties){
    removeStyleProperty(table, "background");
    removeStyleProperty(table, "background-color");

    let selected = table.querySelectorAll('td, th');

    !!properties.align && (tableAlign(table, properties.align));

    applyCellProperties(table, selected, properties);
}