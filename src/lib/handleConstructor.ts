import * as _ from 'lodash-es'
import { WatchObj, InputObj, PageConfig } from '../types/PageTypes'
// import { queue } from './queue'
import { WxEvent } from '../types/eventTypes'

export abstract class PageContext {

    /**
     * 页面数据
     */
    readonly data: any

    /**
     * 获取当前页面路径
     */
    abstract route: string

    /**
     * 
     */
    applyDataState: 'pending' | 'idle'

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）
     */
    abstract setData(arg: any, cb?: () => void): void

    /**
     * # wetype
     * data
     */
    [key: string]: any

    /**
     * # wetype
     * setData异步形式
     */
    abstract setDataAsync(arg: any): Promise<void>

    /**
     * setData缓存
     */
    dataCache: any

    /**
     * 使dataCache中的数据生效
     */
    abstract applyData(isHandleWatcher?: string): Promise<void>

    /**
     * listener
     */
    $listener: any

    /**
     * 发射时间
     */
    abstract emit(listenerName: string, ...args: any[]): any
}

export const handleConstructor = (Constr: any, lifeCycleMethodNames: string[], mixins?: any[]) => {

    let data: any = {}
    let mixinOnLoads: any[] = []

    if (mixins) {
        let res = applyMixins(Constr, mixins, lifeCycleMethodNames)
        data = res.data
        mixinOnLoads = res.onLoads
    }

    let ins = new Constr
    let proto = Constr.prototype

    // 事件、监听方法名
    let { listenerMethodNames, watchObjs, inputObjs } = Constr.decors
    /**
     * app || page || component
     */
    let type = ins.type

    let methods: any = {}
    let lifeCycleMethods: any = {}

    let getters: any = {}
    let setters: any = {}

    // 先遍历原型获取getters 和 setters
    _.each(proto, (v, k) => {
        if (!_.isFunction(v)) {
            let descriptor = Object.getOwnPropertyDescriptor(proto, k)
            if (descriptor) {
                getters[k] = descriptor.get
                setters[k] = descriptor.set
                data[k] = v
            }
        }
    })

    _.each(proto, (prop, k) => {
        if (_.isFunction(prop) && k !== 'constructor') {
            let isLifeCycleMethod = _.includes(lifeCycleMethodNames, k)
            let key = isLifeCycleMethod ? lifeCycleMethods : methods
            if (k === 'onLoad') {
                key['onLoad'] = function(this: PageContext, ...args) {

                    // 初始化data
                    _.extend(this, this.data)
                    // 初始化getters
                    _.extend(this, _.mapValues(getters, v => v.call(this)))
                    // 初始化$listener
                    this.$listeners = {}
                    /**
                     * 实现emit
                     */
                    this.emit = (listenerName: string, ...args: any[]) => {
                        let listener = this.$listeners[listenerName]
                        if (listener) {
                            listener.call(this, ...args)
                        } else {
                            throw Error(`no such listener ${listenerName} registered!`)
                        }
                    }

                    handleListener.call(this, listenerMethodNames, proto)

                    // promisify setData
                    if (this.setData) {
                        this.setDataAsync = (arg) => {
                            return new Promise(resolve => this.setData(arg, resolve))
                        }
                    }
                    this.applyData = (isHandleWatcher: string = '') => {
                        let toSetData: any = {}
                        _.each(this.data, (v, k) => {
                            if (!_.isEqual(v, this[k])) {
                                toSetData[k] = _.cloneDeep(this[k])
                            }
                        })
                        if (!_.isEmpty(toSetData)) {
                            // TODO: 可能有bug
                            if (!/nowatch/i.test(isHandleWatcher)) {
                                handleWatcher.call(this, watchObjs, toSetData)
                            }

                            // if (!/nosetter/i.test(isHandleWatcher)) {
                            //     handleSetters.call(this, setters)
                            // }

                            let getterChanges = handleGetters.call(this, getters, toSetData)

                            return this.setDataAsync({ ...toSetData, ...getterChanges })
                        }
                        return Promise.resolve()
                    }

                    // 先依次执行mixin中的onLoad事件
                    _.each(mixinOnLoads, (prop, i) => {
                        prop.call(this, ...args)
                    })
                    prop.call(this, ...args)
                    this.applyData('nowatch')
                }
            } 
            else {
                key[k] = function(this: PageContext, ...args) {
                    prop.call(this, ...args)
                    type === 'page' && this.applyData()
                }
            }
        }
    })

    _.each(ins, (v, k) => {
        // 排除route 和 type function
        if (!_.isFunction(v) && k !== 'route') {
            data[k] = v
        }
    })
    
    _.each(data, (v, k) => {
        // input
        let foundInput = _.find(inputObjs, { propName: k })
        if (foundInput) {
            let { propName, inputEventHandlerName, opts } = foundInput
            methods[inputEventHandlerName] = function(this: PageContext, e: WxEvent) {
                let value = e.detail.value
                this[propName] = value
                this.applyData()
            }
        }
    })

    return { methods, lifeCycleMethods, data }
}

/**
 * 
 * @param derivedCtor 
 * @param baseCtors 
 * @param lifeCycleMethodNames 
 * @returns 返回data
 */
function applyMixins(derivedCtor: any, baseCtors: any[], lifeCycleMethodNames: string[]) {
    let data = {}
    let onLoads: any[] = []
    baseCtors.forEach(baseCtor => {
        let ins = new baseCtor
        _.each(ins, (v, k) => {
            if (!_.isFunction(v) && k !== 'route') {
                data[k] = v
            }
        })
        _.each(baseCtor.prototype, (v, k) => {
            if (!_.includes(lifeCycleMethodNames, k)) {
                derivedCtor.prototype[k] = v
            }
        })

        if (baseCtor.prototype.onLoad) {
            onLoads.push(baseCtor.prototype.onLoad)
        }

    })
    return {
        data,
        onLoads
    }
}

function handleWatcher(this: PageContext, watchObj: WatchObj[], toSetData: any) {
    _.each(watchObj, ({ dataName, func }) => {
        if (dataName in toSetData) {
            func.call(this, toSetData[dataName], this.data[dataName])
            this.applyData('nowatch')
        }
    })
}

function handleListener(this: PageContext, listenerMethodNames: string[], proto: Object) {
    _.each(proto, (method, k) => {
        if (_.includes(listenerMethodNames, k)) {
            this.$listeners[k] = method
        }
    })
}

function handleGetters(this: PageContext, getters: any, toSetData: any, setters: any) {
    let changes: any = {}
    _.each(getters, (func, k) => {
        let computed = func.call(this)
        if (!_.isEqual(computed, this[k])) {
            changes[k] = computed
            this[k] = computed
        }
    })
    return changes
}

// function handleSetters(this: PageContext, setters: any) {
//     _.each(setters, (func, k) => {
//         func.call(this)
//     })
//     return _.filter(this, o => _.isEqual())
// }

