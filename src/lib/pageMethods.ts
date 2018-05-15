import { PageContext } from './handleConstructor'
import { listeners } from './globalObjs'
import * as _ from 'lodash-es'
import { WatchObj, InputObj, PageConfig } from '../types/PageTypes'

export const setDataAsync = function(this: PageContext, arg) {
    return new Promise(resolve => {
        try {
            this.$setData(arg, resolve)
        } catch (e) {
            console.error('setData error')
        }
    })
}

export const emit = (listenerName: string, ...args: any[]) => {
    let listener = listeners[`${listenerName}`]
    if (listener) {
        let res = listener.method.call(listener.context, ...args)
        res instanceof Promise
            ? res.then(() => listener.context.$applyData())
            : listener.context.$applyData()
    } else {
        throw Error(`no such listener ${listenerName} registered!`)
    }
}

const deleteProps = (obj, arr) => {
    for (let p in obj) {
        if (_.includes(arr, p)) {
            delete obj[p]
        }
    }
    return obj
}

export const applyData = function(
    this: PageContext,
    watchObjs: any,
    getters: any,
    pureProps: string[],
    InputObjs: InputObj[],
    isHandleWatcher: string = ''
) {
    let toSetData: any = {}
    _.each(this.data, (v, k) => {
        if (!_.includes(pureProps, k)) {
            if (!_.isEqual(v, this[k])) {
                toSetData[k] = _.cloneDeep(this[k])
            }
        }
    })
    if (!_.isEmpty(toSetData)) {
        // TODO: 可能有bug
        if (!/nowatch/i.test(isHandleWatcher)) {
            handleWatcher.call(this, watchObjs, toSetData)
        }

        // 处理inputObjs其中验证部分
        InputObjs.forEach(el => {
            if (el.propName in toSetData) {
                if (el.opts && el.opts.valid) {
                    let value = toSetData[el.propName]
                    let valiRes = validate(el.opts.valid, value)
                    let $valid = this.$valid || {}
                    $valid[el.propName] = valiRes
                    toSetData.$valid = $valid
                }
            }
        })

        // 处理computed getters
        let getterChanges = handleGetters.call(this, getters, toSetData)

        // 删除pureProps
        let data = deleteProps(
            {
                ...toSetData,
                ...getterChanges
            },
            pureProps
        )

        return this.$setDataAsync(data)
    }
    return Promise.resolve()
}

function handleWatcher(
    this: PageContext,
    watchObj: WatchObj[],
    toSetData: any
) {
    _.each(watchObj, ({ dataName, func }) => {
        if (dataName in toSetData) {
            func.call(this, toSetData[dataName], this.data[dataName])
            this.applyData('nowatch')
        }
    })
}

function handleGetters(this: PageContext, getters: any, toSetData: any) {
    let changes: any = {}
    _.each(getters, (func, k) => {
        let computed = func.call(this)
        if (computed !== void 0) {
            if (!_.isEqual(computed, this[k])) {
                changes[k] = computed
                this[k] = computed
            }
        } else {
            throw Error('computed property cannot return a value of undefined')
        }
    })
    return changes
}

/**
 *
 * @param derivedCtor
 * @param baseCtors
 * @param lifeCycleMethodNames
 * @returns 返回data
 */
export function applyMixins(
    derivedCtor: any,
    baseCtors: any[],
    lifeCycleMethodNames: string[]
) {
    let data = {}
    let onLoads: any[] = []
    let getters = {}
    baseCtors.forEach(baseCtor => {
        let ins = new baseCtor()
        let proto = baseCtor.prototype
        _.each(ins, (v, k) => {
            if (!_.isFunction(v) && k !== 'route') {
                data[k] = v
            }
        })
        Object.getOwnPropertyNames(proto).forEach(k => {
            let descriptor = Object.getOwnPropertyDescriptor(proto, k)
            if (descriptor && descriptor.get && !descriptor.value) {
                getters[k] = descriptor.get
                // delete proto[k]
                data[k] = ''
            } else if (!_.includes(lifeCycleMethodNames, k)) {
                let v = proto[k]
                derivedCtor.prototype[k] = v
            }
        })

        if (baseCtor.prototype.onLoad) {
            onLoads.push(baseCtor.prototype.onLoad)
        }
    })
    return {
        data,
        getters,
        onLoads
    }
}

export function handleListener(
    this: PageContext,
    listenerMethodNames: string[],
    proto: Object
) {
    _.each(proto, (method, k) => {
        if (_.includes(listenerMethodNames, k)) {
            listeners[`${k}`] = {
                method,
                context: this
            }
        }
    })
}

export const validate = (valid, value) => {
    let validRes = valid.call(void 0, value)
    return _.isRegExp(validRes) ? validRes.test(value) : !!validRes
}

export function handleRes(this: PageContext, res) {
    if (this.$applyData) {
        res && res.then
            ? res.then(() => this.$applyData())
            : this.$applyData('nowatch')
    }
}
