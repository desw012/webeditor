import { COMPONENT_CLASS } from "../constants";

export default function RootContainer( uiPlugin ) {
    const root = document.createElement('div');;
    root.className = COMPONENT_CLASS.ROOT_CONTAINER;

    return root;
}