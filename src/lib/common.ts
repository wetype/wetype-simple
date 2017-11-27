export interface Options<T> {
    success?(res: T): void
    fail?(): void
    complete?(): void
}

export interface ObjectLiteral {
    [key: string]: any
}

export interface ErrMsg<T> {
    /**
     * 调用结果
     */
    errMsg: T
}

export interface WindowConfig {
    /**
     * 导航栏背景颜色，如"#000000"
     * default: #000000
     */
    navigationBarBackgroundColor?: string
    
    /**
     * 导航栏标题颜色，仅支持 black/white
     * default: white
     */
    navigationBarTextStyle?: string

    /**
     * 导航栏标题文字内容
     */
    navigationBarTitleText?: string

    /**
     * 窗口的背景色
     * default: #fff
     */
    backgroundColor?: string

    /**
     * 下拉背景字体、loading 图的样式，仅支持 dark/light
     * default: dark
     */
    backgroundTextStyle?: string

    /**
     * 是否开启下拉刷新，详见页面相关事件处理函数。
     * default: false
     */
    enablePullDownRefresh?: boolean

     /**
     * 页面上拉触底事件触发时距页面底部距离，单位为px
     * default: 50
     */
    onReachBottomDistance?: number
}