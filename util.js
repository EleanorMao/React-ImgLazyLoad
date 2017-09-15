const _now = Date.now || function () {
    return new Date().getTime()
};

export function throttle(func, wait) {
    var context,
        args,
        result;
    var timeout = null;
    var previous = 0;

    var later = function () {
        previous = _now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null
        }
    };

    return function () {
        var now = _now();

        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result
    }
}

export function getElementTop(element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop
}
