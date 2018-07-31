import * as _ from 'lodash-es'
import {
    WatchObj,
    InputObj,
    PageConfig,
    ControlMethod
} from '../types/PageTypes'
import { WxEvent } from '../types/eventTypes'
import { alphabet, decodeParam } from './util'
// import { listeners } from './globalObjs'
import {
    setDataAsync,
    emit,
    applyData,
    handleListener,
    applyMixins,
    validate,
    handleRes
} from './pageMethods'
// import { getCurrentPages } from './wx'
import { getDecorName } from './DecorMethods'

export abstract class PageContext {
    /**
     * 页面数据
     */
    readonly data: any

    /**
     * 获取当前页面路径
     */
    abstract $route: {
        path: string
        query: any
        id: string
    }

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）
     */
    abstract $setData(arg: any, cb?: () => void): void

    /**
     * 表单验证
     */
    abstract $valid: any

    // abstract $pages: any[]

    /**
     * # wetype
     * data
     */
    [key: string]: any

    /**
     * # wetype
     * setData异步形式
     */
    abstract $setDataAsync(arg: any): Promise<void>

    /**
     * setData缓存
     */
    dataCache: any

    /**
     * 使dataCache中的数据生效
     */
    abstract $applyData(isHandleWatcher?: string): Promise<void>

    /**
     * 发射时间
     */
    abstract $emit(listenerName: string, path: string, ...args: any[]): any
}

export const handleConstructor = (
    constrType: 'page' | 'component',
    Constr: any,
    lifeCycleMethodNames: string[],
    isMixin?: boolean,
    mixins?: any[]
) => {
    let mixinOnLoads: any[] = []
    let data: any = {
        $valid: {}
    }
    // 实例化
    let ins = new Constr()
    let constrName = Constr.name
    let type = ins.type
    let proto = Constr.prototype

    // 初始化methods
    let methods: any = {}
    // 初始化生命周期函数对象
    let lifeCycleMethods: any = {}
    // 初始化计算属性 getters
    let getters: any = {}
    // 初始化普通data
    let purePropsObj: any = {}

    // 处理mixin
    if (mixins) {
        let res = applyMixins(Constr, mixins, lifeCycleMethodNames)
        data = res.data
        mixinOnLoads = res.onLoads
        getters = res.getters
    }
    // 事件、监听方法名
    let decors = getDecorName(constrName)
    let wxEventNames: string[] = decors ? decors.wxEventNames : []
    let watchObjs: WatchObj[] = decors ? decors.watchObjs : []
    let listenerMethodNames: string[] = decors ? decors.listenerMethodNames : []
    let inputObjs: InputObj[] = decors ? decors.inputObjs : []
    let pureProps: string[] = decors ? decors.pureProps : []
    let controlMethods: ControlMethod[] = decors ? decors.controlMethods : []

    const excludedProperties = ['route'].concat(pureProps)
    // 遍历属性
    _.each(ins, (v, k) => {
        // 排除route 和 type function 和 getters
        if (!_.isFunction(v) && !_.includes(excludedProperties, k)) {
            data[k] = v
        } else if (_.includes(pureProps, k)) {
            purePropsObj[k] = v
        }
    })

    // 先遍历原型获取getters
    Object.getOwnPropertyNames(proto).forEach(k => {
        let descriptor = Object.getOwnPropertyDescriptor(proto, k)
        if (descriptor && descriptor.get && !descriptor.value) {
            getters[k] = descriptor.get
            if (!isMixin) {
                delete proto[k]
                data[k] = ''
            }
        }
    })

    // 处理inputObj
    _.each(inputObjs, ({ propName, opts, handler }) => {
        if (opts) {
            if (opts.valid) {
                let value = data[propName]
                data.$valid[propName] = validate(opts.valid, value)
            }
            // if (opts.isProp) {
            //     data[`${propName}$prop`] = data[propName]
            // }
        }
        let inputEventHandlerName =
            (opts && opts.eventName) || `${propName}Input`
        let eventHandler = function(this: PageContext, e: WxEvent) {
            let value = opts && opts.isProp ? e.detail : e.detail.value
            if (/^\d+$/.test(value) && opts && opts.isParseInt !== false) {
                value = parseInt(value)
            }
            if (opts) {
                if (opts.valid) {
                    // 验证表单
                    this.$valid[propName] = validate(opts.valid, value)
                }
            }
            if (handler) {
                handleRes.call(this, handler.call(this, value, e))
                return
            }
            this[propName] = value
            this.$applyData()
            // this.$applyData().then(() => {
            //     if (opts && opts.isProp) {
            //         // 同步prop
            //         this[`${propName}$prop`] = value
            //         this.$applyData()
            //     }
            // })
        }
        if (opts && opts.debounce) {
            methods[inputEventHandlerName] = _.debounce(
                eventHandler,
                opts.debounce
            )
        } else {
            methods[inputEventHandlerName] = eventHandler
        }
    })

    Object.getOwnPropertyNames(proto).forEach(k => {
        if (!(k in getters)) {
            let prop = proto[k]
            if (_.isFunction(prop) && k !== 'constructor') {
                let isLifeCycleMethod = _.includes(lifeCycleMethodNames, k)
                let key = isLifeCycleMethod ? lifeCycleMethods : methods
                let controlMethodsNames = controlMethods.map(
                    el => el.methodName
                )
                let controlMethodIndex = controlMethodsNames.indexOf(k)
                let initialMethod =
                    constrType === 'page' ? 'onLoad' : 'attached'
                if (k === initialMethod) {
                    key[initialMethod] = function(this: PageContext, ...args) {
                        // 初始化data
                        _.extend(this, _.cloneDeep(this.data))
                        // 初始化getters
                        _.extend(
                            this,
                            _.cloneDeep(_.mapValues(getters, v => v.call(this)))
                        )
                        // 设置router
                        const query = _.mapValues(args[0], v => {
                            const val = decodeURIComponent(v)
                            try {
                                const json = JSON.parse(val)
                                return typeof json === 'object'
                                    ? json
                                    : String(json)
                            } catch (e) {
                                return val
                            }
                        })
                        _.extend(query, { scene: decodeParam(query.scene) })
                        _.extend(this, {
                            $route: {
                                path: this.route,
                                query,
                                id: query.id || query.scene.id || ''
                            }
                        })

                        // 保存全局pages
                        // this.$pages = getCurrentPages()
                        // 设置普通data
                        _.extend(this, purePropsObj)
                        // 实现emit
                        this.$emit = emit.bind(this)
                        // 处理监听器
                        handleListener.call(this, listenerMethodNames, proto)
                        // promisify setData
                        if (this.setData) {
                            this.$setData = this.setData
                            this.$setDataAsync = setDataAsync.bind(this)
                            delete this.setData
                        }
                        // 实现applyData
                        this.$applyData = applyData.bind(
                            this,
                            watchObjs,
                            getters,
                            pureProps,
                            inputObjs
                        )
                        // 先依次执行mixin中的onLoad事件
                        _.each(mixinOnLoads, (prop, i) => {
                            handleRes.call(this, prop.call(this, ...args))
                        })
                        handleRes.call(this, prop.call(this, ...args))
                    }
                } else if (controlMethodIndex > -1) {
                    let method = controlMethods[controlMethodIndex]
                    let options = {
                        ...{ leading: true, trailing: false },
                        ...(method.options || {})
                    }
                    let wait = options.wait || 100
                    delete options.wait
                    let handler = function(this: PageContext, ...args: any[]) {
                        handleRes.call(this, prop.call(this, ...args))
                    }
                    key[k] =
                        method.method === 'debounce'
                            ? _.debounce(handler, wait, options)
                            : _.throttle(handler, wait, options)
                } else if (k === 'onPreload') {
                    // router.addEvent('', key[k])
                } else if (k === 'onShareAppMessage') {
                    key[k] = function(...args) {
                        let res = prop.call(this, ...args)
                        handleRes.call(this, res)
                        return res
                    }
                } else if (_.includes(wxEventNames, k)) {
                    // 处理wxEvent
                    // 类似于html属性 data-arg-a=""
                    key[k] = function(this: PageContext, e: WxEvent) {
                        let dataset = e.currentTarget.dataset
                        let args = Object.keys(dataset)
                            .sort(
                                (x, y) =>
                                    alphabet(x.slice(-1)) >
                                    alphabet(y.slice(-1))
                                        ? 1
                                        : -1
                            )
                            .map(el => dataset[el])
                        !isMixin &&
                            handleRes.call(this, prop.call(this, ...args, e))
                    }
                } else {
                    let handler = function(this: PageContext, ...args) {
                        if (!isMixin) {
                            if (/.+\$$/.test(k)) {
                                prop.call(this, ...args)
                            } else {
                                handleRes.call(this, prop.call(this, ...args))
                            }
                        }
                    }
                    key[k] =
                        isLifeCycleMethod || k[0] === '_'
                            ? handler
                            : _.debounce(handler, 50, {
                                  leading: true,
                                  trailing: false
                              })
                }
            }
        }
    })
    return constrType === 'page'
        ? { ...methods, ...lifeCycleMethods, data }
        : { methods, ...lifeCycleMethods, data }
}
