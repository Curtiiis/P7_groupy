// FONCTIONS
export function debounce(callback, delay) {
    var timer = null;

    return function () {
        var context = this;
        var args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback.apply(context, args)
        }, delay)
    }
}