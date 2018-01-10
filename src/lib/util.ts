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

export const alphabet = function(str: string | number) {
    str = (str + '').toLowerCase()
    let map = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6
    }
    let aa = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    if (/\d/.test(str)) {
        return aa[str].toLowerCase()
    } else {
        return map[str]
    }
}