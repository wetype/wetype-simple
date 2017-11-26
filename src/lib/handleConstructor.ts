export interface PageContext {

    /**
     * 页面数据
     */
    data: any

    /**
     * 获取当前页面路径
     */
    route: string

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）
     */
    setData(arg: any, cb?: () => void): void

    /**
     * # wetype
     * data
     */
    [key: string]: any

    /**
     * # wetype
     * setData异步形式
     */
    setDataAsync(arg: any): Promise<void>
}

export const handleConstructor = (Constr: any, lifeCycleMethodNames: string[]) => {
    let ins = new Constr
    let proto = Constr.prototype

    let methods: any = {}
    let lifeCycleMethods: any = {}
    let data: any = {}

    Object.getOwnPropertyNames(proto).forEach(name => {
        if (typeof proto[name] === 'function' && name !== 'constructor') {
            let isLifeCycleMethod = lifeCycleMethodNames.indexOf(name) !== -1
            let key = isLifeCycleMethod ? lifeCycleMethods : methods
            key[name] = function(this: PageContext, ...args) {
                for (let p in this.data) {
                    this[p] = this.data[p]
                }

                // promisify setData
                if (this.setData) {
                    this.setDataAsync = (arg) => {
                        return new Promise(resolve => this.setData(arg, resolve))
                    }
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