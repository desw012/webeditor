
export const optimizedResize = ( win ) => {
    let running = false;

    const delayFn = () => {
        running = false;
    }

    const runCallbacks = () => {
        let event = new Event("optimizedResize");
        win.dispatchEvent(event);
        setTimeout(delayFn);
    }

    const resize = () => {
        if (!running) {
            running = true;
            if (win.requestAnimationFrame) {
                win.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }
    }
    win.addEventListener('resize', resize);
}