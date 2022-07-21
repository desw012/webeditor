export const getBrowserName = () => {
    const agent = window.navigator.userAgent.toLowerCase();

}

export const isSafari = () => {
    const agent = window.navigator.userAgent.toLowerCase();
    return agent.indexOf('chrome/') === -1 && agent.indexOf('safari/') > -1;
}