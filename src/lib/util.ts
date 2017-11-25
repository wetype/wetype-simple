declare const process: any

export const isInNode = typeof process === 'object'

export const promisify = <T>(options, func) => {
    return new Promise<T>((resolve, reject) => {
        options.success = resolve
        options.fail = reject
        func(options)
    })
}