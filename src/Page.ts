import { Page as nativePage } from './lib/wx'
import { global } from './global'
import { handleConstructor } from './lib/handleConstructor'
import {
    PageOptions,
    ShareAppMessageOptions,
    ShareAppMessageRes,
    OnloadOptions,
    WatchObj,
    InputObj,
    PageDecors,
    InputObjOpts
} from './types/PageTypes'
import * as _ from 'lodash-es'

export abstract class Page {
    readonly $type = 'page'

    /**
     * 获取到当前页面的路径
     */
    readonly $route: {
        path: string
        query: any
    } = { path: '', query: {} }

    /**
     * 数据
     */
    readonly data: any

    /**
     * 表单验证
     */
    readonly $valid: {
        [key: string]: boolean
    } = {}

    readonly $pages: {
        [key: string]: any
    } = {}

    /**
     * 初始化Page
     */
    static decor(pageOptions: PageOptions) {
        return function(pageConstructor: any) {
            let lifeCycleMethodNames = ['onLoad', 'onShow', 'onUnload']
            let pageProperties = handleConstructor(
                pageConstructor,
                lifeCycleMethodNames,
                pageOptions && pageOptions.isMixin,
                pageOptions && pageOptions.mixins
            )
            if (!pageOptions.isMixin) {
                nativePage(pageProperties)
            }
        }
    }

    private static decors: PageDecors = {
        listenerMethodNames: [],
        watchObjs: [],
        inputObjs: [],
        wxEventNames: [],
        pureProps: []
    }

    static on(proto: Object, methodName: string) {
        Page.decors.listenerMethodNames.push(methodName)
    }

    static watch(func: (val: any, old?: any) => void) {
        return function(proto: Object, dataName: string) {
            Page.decors.watchObjs.push({
                dataName,
                func
            })
        }
    }

    static input(arg1?: Function | InputObjOpts, arg2?: InputObjOpts) {
        let handler = typeof arg1 === 'function' ? arg1 : void 0
        let opts = typeof arg1 === 'function' ? arg2 : arg1
        return function(proto: Object, propName: string) {
            Page.decors.inputObjs.push({
                propName,
                opts,
                handler
            })
        }
    }

    static event(pro: Object, methodName: string) {
        Page.decors.wxEventNames.push(methodName)
    }

    static pure(prop, name: string) {
        Page.decors.pureProps.push(name)
    }

    /**
     * 生命周期函数--监听页面加载
     */
    abstract onLoad(options: OnloadOptions): void
}

export interface Page {
    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
     */
    $setData(arg: any): void

    /**
     * 异步setData
     */
    $setDataAsync(arg: any): Promise<void>

    /**
     *
     */
    $applyData(): Promise<void>

    /**
     * 发射事件
     */
    $emit(eventName: string, path: string, ...args: any[]): any

    /**
     * 生命周期函数--监听页面初次渲染完成
    /**
     *
     *
     * @memberof Page
     */
    onReady?(): void

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload?(): void

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh?(): void

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom?(): void

    /**
     * 用户点击右上角转发
     */
    onShareAppMessage?(options: ShareAppMessageOptions): ShareAppMessageRes

    /**
     * 页面滚动触发事件的处理函数
     */
    onPageScroll?(): void

    /**
     * 生命周期函数--监听页面显示
     */
    onShow?(): void

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide?(): void

    /**
     * wetype事件
     */
    onPreload?(): void

    /**
     * 点击 tab 时触发，见 链接
     */
    onTabItemTap?(): void
}
