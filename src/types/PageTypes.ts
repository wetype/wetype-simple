import { ErrMsg, WindowConfig, ObjectLiteral } from './common'

export interface Page {
    
    /**
     * 生命周期函数--监听页面初次渲染完成
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

export interface OnloadOptions {
    /**
     * 
     */
    query?: any
}

export interface ShareAppMessageOptions {
    /**
     * 转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
     */
    from: string

    /**
     * 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
     */
    target?: any
}

export interface ShareAppMessageRes {
    /**
     * 转发标题	
     * 默认：当前小程序名称
     */
    title?: string

    /**
     * 转发路径
     * 当前页面 path ，必须是以 / 开头的完整路径
     */
    path?: string

    /**
     * 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。iOS 显示图片长宽比是 5:4，Android 显示图片长宽比是 215:168。高度超出部分会从底部裁剪。推荐使用 Android 图片长宽比，可保证图片在两个平台都完整显示，其中 iOS 底部会出现一小段白色
     */
    imageUrl?: string

    /**
     * shareTicket 数组，每一项是一个 shareTicket ，对应一个转发对象
     */
    success?(cb: (shareTickets: string[]) => void): void

    fail?(cb: (msg: ErrMsg<string>) => void): void
}

export interface PageOptions {
    config?: PageConfig
}

export interface PageConfig extends WindowConfig {

    /**
     * 设置为 true 则页面整体不能上下滚动；只在 page.json 中有效，无法在 app.json 中设置该项
     * default: false
     */
    disableScroll?: boolean

    /**
     * 使用已注册的自定义组件前，首先要在页面的 json 文件中进行引用声明。此时需要提供每个自定义组件的标签名和对应的自定义组件文件路径
     */
    usingComponents?: ObjectLiteral
}