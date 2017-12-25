import * as _ from 'lodash-es'
import { WatchObj } from '../types/PageTypes'
import { queue } from './queue'

export abstract class PageContext {

    /**
     * 页面数据
     */
    data: any

    /**
     * 获取当前页面路径
     */
    abstract route: string

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
    abstract applyData(isHandleWatcher?: boolean): Promise<void>

    /**
     * events
     */
    $events: any

    /**
     * 发射时间
     */
    abstract emit(eventName: string, ...args: any[]): any
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
    let { eventMethodNames, watchMethodNames } = Constr
    /**
     * app || page || component
     */
    let type = ins.type

    let methods: any = {}
    let lifeCycleMethods: any = {}

    _.each(proto, (method, k) => {
        if (_.isFunction(method) && k !== 'constructor') {
            let isLifeCycleMethod = _.includes(lifeCycleMethodNames, k)
            let key = isLifeCycleMethod ? lifeCycleMethods : methods
            if (k === 'onLoad') {
                key['onLoad'] = function(this: PageContext, ...args) {
                    // 初始化 dataCache
                    this.dataCache = {}
                    for (let p in this.data) {
                        Object.defineProperty(this, p, {
                            // set: (v) => {
                            //     _.extend(this.dataCache, { [p]: v })
                            // },
                            get: () => this.data[p],
                            value: null
                        })
                    }
                    _.extend(this, this.data)
                    // 初始化$event
                    this.$events = {}
                    /**
                     * 实现emit
                     */
                    this.emit = (eventName: string, ...args: any[]) => {
                        let event = this.$events[eventName]
                        if (event) {
                            event.call(this, ...args)
                        } else {
                            throw Error(`no such event ${eventName} registered!`)
                        }
                    }

                    handleEvent.call(this, eventMethodNames, proto)

                    // promisify setData
                    if (this.setData) {
                        this.setDataAsync = (arg) => {
                            return new Promise(resolve => this.setData(arg, resolve))
                        }
                    }
                    this.applyData = (isHandleWatcher?: boolean) => {
                        // if (!_.isEmpty(this.dataCache)) {
                        //     // 处理监听数据
                        //     isHandleWatcher !== false &&
                        //         handleWatcher.call(this, watchMethodNames)
                        //     let promise = this.setDataAsync(this.dataCache)
                        //     this.dataCache = {}
                        //     // return queue.push(promise)
                        //     return promise
                        // }
                        // return Promise.resolve()
                        let dataCache: any = {}
                        _.keys(this.data).map(k => {
                            let obj = this[k]
                            if (obj) {
                                if (_.isArray(obj)) {
                                    dataCache[k] = 
                                }
                                if (_.isObject(obj)) {
                                    _.extend(dataCache, obj)
                                } else {

                                }
                            }
                        })
                    }

                    // 先依次执行mixin中的onLoad事件
                    _.each(mixinOnLoads, (method, i) => {
                        method.call(this, ...args)
                    })

                    method.call(this, ...args)

                    this.applyData(false)
                }
            } else {
                key[k] = function(this: PageContext, ...args) {
                    method.call(this, ...args)
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

function handleWatcher(this: PageContext, watchObj: WatchObj[]) {
    _.each(watchObj, ({ dataName, func }) => {
        if (dataName in this.dataCache) {
            func.call(this, this.dataCache[dataName], this.data[dataName])
            this.applyData(false)
        }
    })
}

function handleEvent(this: PageContext, eventMethodNames: string[], proto: Object) {
    _.each(proto, (method, k) => {
        if (_.includes(eventMethodNames, k)) {
            this.$events[k] = method
        }
    })
}
