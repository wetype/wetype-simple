declare const process: any

export const isInNode = typeof process === 'object'

export const promisify = <T>(options, func) => {
    return new Promise<T>((resolve, reject) => {
        options.success = resolve
        options.fail = reject
        func(options)
    })
}

export const inArray = (arr: any[], str: string) => {
    return arr.indexOf(str) !== -1
}

export const isFunc = (obj: any) => {
    return typeof obj === 'function'
}

export const getFlatObject = function(object) {
    function iter(o, p) {
        if (Array.isArray(o) ){
            o.forEach(function (a, i) {
                iter(a, p.concat(i));
            });
            return;
        }
        if (o !== null && typeof o === 'object') {
            Object.keys(o).forEach(function (k) {
                iter(o[k], p.concat(k));
            });
            return;
        }
        let pathStr = p.map((el, i) => {
            if (i === 0) {
                return el
            }
            if (!isNaN(el)) {
                return `[${el}]`
            }
            return `.${el}`
        }).join('')
        path[pathStr] = o
    }

    var path = {};
    iter(object, []);
    return path;
}