import { COMPONENT_CLASS } from "../constants";


export default function ContentContainer( ) {
    const contentContainer = document.createElement('div');
    contentContainer.className = COMPONENT_CLASS.CONTENT_CONTAINER;

    const iframe = document.createElement('iframe');
    contentContainer.appendChild(iframe);

    return contentContainer;
}
