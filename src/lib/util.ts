declare const process: any

export const isInNode = typeof process === 'object'

export const handleConstructor = (Constr: any, lifeCycleMethodNames: string[]) => {
    let ins = new Constr
    let proto = Constr.prototype

    let methods: any = {}
    let lifeCycleMethods: any = {}
    let data: any = {}

    Object.keys(proto).forEach(name => {
        if (typeof proto[name] === 'function' && name !== 'constructor') {
            let isLifeCycleMethod = lifeCycleMethodNames.indexOf(name) !== -1
            let key = isLifeCycleMethod ? lifeCycleMethods : methods
            key[name] = function(this: any, ...args) {
                for (let p in this.data) {
                    this[p] = this.data[p]
                }
                proto[name].call(this, ...args)
            }
        }
    })

    Object.keys(ins).forEach(name => {
        if (typeof ins[name] !== 'function') {
            data[name] = ins[name]
        }
    })

    return { methods, lifeCycleMethods, data }
}