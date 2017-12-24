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
