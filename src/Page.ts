import { Page as nativePage } from './lib/wx'
import { global } from './global'
import { isInNode } from './lib/util'
import { handleConstructor } from './lib/handleConstructor'
import { PageOptions, ShareAppMessageOptions, ShareAppMessageRes, OnloadOptions } from './types/PageTypes'


export abstract class Page {

    type = 'page'

    /**
     * 获取到当前页面的路径
     */
    route: any

    /**
     * 数据
     */
    data: any

    /**
     * 初始化Page
     */
    static decor(pageOptions?: PageOptions) {
        return function(pageConstructor: any) {
            if (isInNode) {
                pageConstructor.config = pageOptions && pageOptions.config
            } else {
                let lifeCycleMethodNames = ['onLoad', 'onShow', 'onUnload']
                let { methods, lifeCycleMethods, data } = handleConstructor(pageConstructor, lifeCycleMethodNames, pageOptions && pageOptions.mixins)
                nativePage({
                    data,
                    ...methods,
                    ...lifeCycleMethods
                })
            } 
        }
    }

    static eventMethodNames: string[] = []

    static event(proto: Object, methodName: string) {
        Page.eventMethodNames.push(methodName)
    }

    static watchMethodNames: string[] = []

    static watch(proto: Object, methodName: string) {
        Page.watchMethodNames.push(methodName)
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
    setData(arg: any): void
    
    /**
     * 异步setData
     */
    setDataAsync(arg: any): Promise<void>

    /**
     * 
     */
    applyData(): Promise<void>
    
    
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
}
