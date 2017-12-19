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

    /**
     * setData缓存
     */
    dataCache: any

    /**
     * 使dataCache中的数据生效
     */
    applyData(): Promise<void>
}

export interface AppOnLaunchParams {

    

}

export const handleConstructor = (Constr: any, lifeCycleMethodNames: string[]) => {
    let ins = new Constr
    let proto = Constr.prototype

    /**
     * app || page || component
     */
    let type = ins.type

    let methods: any = {}
    let lifeCycleMethods: any = {}
    let data: any = {}

    Object.getOwnPropertyNames(proto).forEach(name => {
        if (typeof proto[name] === 'function' && name !== 'constructor') {
            let isLifeCycleMethod = lifeCycleMethodNames.indexOf(name) !== -1
            let key = isLifeCycleMethod ? lifeCycleMethods : methods

            if (name === 'onLoad') {
                
                key['onLoad'] = function(this: PageContext, ...args) {
                    // 初始化 dataCache
                    this.dataCache = {}
    
                    for (let p in this.data) {
    
                        Object.defineProperty(this, p, {
                            set: (v) => {
                                this.dataCache[p] = v
                            },
                            get: () => this.data[p]
                        })
    
                    }
    
                    // promisify setData
                    if (this.setData) {
                        this.setDataAsync = (arg) => {
                            return new Promise(resolve => this.setData(arg, resolve))
                        }
                    }

                    this.applyData = () => {
                        if (Object.keys(this.dataCache).length) {
                            let promise = this.setDataAsync(this.dataCache)
                            this.dataCache = {}
                            return promise
                        }
                        return Promise.resolve()
                    }

                    proto[name].call(this, ...args)

                    this.applyData()
    
                }

            } else {

                key[name] = function(this: PageContext, ...args) {
    
                    proto[name].call(this, ...args)
    
                    type === 'page' && this.applyData()
                }
            }

        }
    })

    Object.keys(ins).forEach(name => {
        // 排除route 和 type function
        if (typeof ins[name] !== 'function' && name !== 'route') {
            data[name] = ins[name]
        }
    })

    return { methods, lifeCycleMethods, data }
}