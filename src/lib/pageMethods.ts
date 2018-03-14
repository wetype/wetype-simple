import { PageContext } from './handleConstructor'
import { listeners } from './listeners'
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

export const emit = (listenerName: string, path: string, ...args: any[]) => {
    let listener = listeners[`${path}-${listenerName}`]
    if (listener) {
        listener.method.call(listener.context, ...args)
        listener.context.applyData()
    } else {
        throw Error(
            `no such listener ${listenerName} in page ${path} registered!`
        )
    }
}

export const applyData = function(
    this: PageContext,
    watchObjs: any,
    getters: any,
    isHandleWatcher: string = ''
) {
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

        let getterChanges = handleGetters.call(this, getters, toSetData)

        return this.$setDataAsync({
            ...toSetData,
            ...getterChanges
        })
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

function handleGetters(
    this: PageContext,
    getters: any,
    toSetData: any,
    setters: any
) {
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
