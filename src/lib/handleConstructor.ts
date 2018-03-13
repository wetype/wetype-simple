import * as _ from 'lodash-es'
import { WatchObj, InputObj, PageConfig } from '../types/PageTypes'
import { WxEvent } from '../types/eventTypes'
import { alphabet } from './util'
import { listeners } from './listeners'
import { setDataAsync, emit, applyData } from './pageMethods'

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
     * 表单验证
     */
    abstract $valid: any

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
    // $listener: any

    /**
     * 发射时间
     */
    abstract emit(listenerName: string, path: string, ...args: any[]): any
}

export const handleConstructor = (
    Constr: any,
    lifeCycleMethodNames: string[],
    mixins?: any[]
) => {
    let data: any = {
        $valid: {}
    }
    let mixinOnLoads: any[] = []

    if (mixins) {
        let res = applyMixins(Constr, mixins, lifeCycleMethodNames)
        data = res.data
        mixinOnLoads = res.onLoads
    }

    let ins = new Constr()
    let proto = Constr.prototype

    // 事件、监听方法名
    let { listenerMethodNames, watchObjs, wxEventObjs } = Constr.decors

    let inputObjs: InputObj[] = Constr.decors.inputObjs
    /**
     * app || page || component
     */
    let type = ins.type

    let methods: any = {}
    let lifeCycleMethods: any = {}

    let getters: any = {}

    // let setters: any = {}

    // 加入router
    // router.addPage(path)

    // 遍历属性
    _.each(ins, (v, k) => {
        // 排除route 和 type function 和 getters
        if (!_.isFunction(v) && k !== 'route') {
            data[k] = v
        }
    })

    // 先遍历原型获取getters 和 setters
    Object.getOwnPropertyNames(proto).forEach(k => {
        let descriptor = Object.getOwnPropertyDescriptor(proto, k)
        if (descriptor && descriptor.get && !descriptor.value) {
            getters[k] = descriptor.get
            delete proto[k]
            // setters[k] = descriptor.set
            data[k] = ''
        }
    })

    // 处理inputObj
    _.each(inputObjs, ({ propName, opts, handler }) => {
        if (opts) {
            let { valid } = opts
            if (valid) {
                let value = data[propName]
                let validRes = valid.call(void 0, value)
                data.$valid[propName] = _.isRegExp(validRes)
                    ? validRes.test(value)
                    : !!validRes
            }
        }
        let inputEventHandlerName =
            (opts && opts.eventName) || `${propName}Input`
        methods[inputEventHandlerName] = function(
            this: PageContext,
            e: WxEvent
        ) {
            let value = e.detail.value
            if (/^\d+$/.test(value)) {
                value = parseInt(value)
            }
            if (opts) {
                let { valid } = opts
                // 验证表单
                if (valid) {
                    let res = valid.call(void 0, value)
                    this.$valid[propName] = _.isRegExp(res)
                        ? res.test(value)
                        : !!res
                }
            }
            if (handler) {
                handler.call(this, value, e)
                this.applyData()
                return
            }
            this[propName] = value
            this.applyData()
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
                    // this.$listeners = {}
                    /**
                     * 实现emit
                     */
                    this.emit = emit.bind(this)

                    handleListener.call(this, listenerMethodNames, proto)

                    // promisify setData
                    if (this.setData) {
                        this.setDataAsync = setDataAsync.bind(this)
                    }

                    this.applyData = applyData.bind(this, watchObjs, getters)

                    // 先依次执行mixin中的onLoad事件
                    _.each(mixinOnLoads, (prop, i) => {
                        prop.call(this, ...args)
                    })
                    prop.call(this, ...args)
                    this.applyData('nowatch')
                }
            } else if (k === 'onPreload') {
                // router.addEvent('', key[k])
            } else if (_.includes(wxEventObjs, k)) {
                // 处理wxEventObj
                key[k] = function(this: PageContext, e: WxEvent) {
                    let args: any[] = []
                    _.each(e.currentTarget.dataset, (v, k) => {
                        let last = k.slice(-1)
                        if (/[A-Z]{1}/.test(last)) {
                            let index = alphabet(last)
                            args[index] = v
                        }
                    })
                    prop.call(this, ...args, e)
                    type === 'page' && this.applyData()
                }
            } else {
                key[k] = function(this: PageContext, ...args) {
                    prop.call(this, ...args)
                    type === 'page' && this.applyData()
                }
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
function applyMixins(
    derivedCtor: any,
    baseCtors: any[],
    lifeCycleMethodNames: string[]
) {
    let data = {}
    let onLoads: any[] = []
    baseCtors.forEach(baseCtor => {
        let ins = new baseCtor()
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

function handleListener(
    this: PageContext,
    listenerMethodNames: string[],
    proto: Object
) {
    _.each(proto, (method, k) => {
        if (_.includes(listenerMethodNames, k)) {
            listeners[`${this.route}-${k}`] = {
                method,
                context: this
            }
        }
    })
}
