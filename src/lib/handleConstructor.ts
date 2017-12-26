import * as _ from 'lodash-es'
import { WatchObj } from '../types/PageTypes'
import { queue } from './queue'

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
    let { eventMethodNames, watchObjs } = Constr
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
                        let toSetData: any = {}
                        _.each(this.data, (v, k) => {
                            if (!_.isEqual(v, this[k])) {
                                toSetData[k] = _.cloneDeep(this[k])
                            }
                        })
                        if (!_.isEmpty(toSetData)) {
                            // TODO: 可能有bug
                            isHandleWatcher !== false &&
                                handleWatcher.call(this, watchObjs, toSetData)
                            return this.setDataAsync(toSetData)
                        }
                        return Promise.resolve()
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

function handleWatcher(this: PageContext, watchObj: WatchObj[], toSetData: any) {
    _.each(watchObj, ({ dataName, func }) => {
        if (dataName in toSetData) {
            func.call(this, toSetData[dataName], this.data[dataName])
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
