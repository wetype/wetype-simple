import { WindowConfig } from './common'

export interface OnLaunchOptions {
    
    /**
     * 打开小程序的路径
     */
    path: string

    /**
     * 打开小程序的query
     */
    query: any

    /**
     * 打开小程序的场景值
     */
    scene: number

    /**
     * shareTicket
     */
    shareTicket: string

    /**
     * 当场景为由从另一个小程序或公众号或App打开时，返回此字段
     */
    referrerInfo?: {
        /**
         * 来源小程序或公众号或App的 appId，详见下方说明
         */
        appId: string

        /**
         * 来源小程序传过来的数据，scene=1037或1038时支持
         */
        extraData: any
    }
}

export interface App {

    onLaunch(options: OnLaunchOptions): void

    onShow?(options: OnLaunchOptions): void
    
    onHide?(): void
    
    onError?(): void
}

export interface AppOptions {
    config: AppConfig
}

export interface AppConfig {
    /**
     * 接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成。每一项代表对应页面的【路径+文件名】信息，数组的第一项代表小程序的初始页面。小程序中新增/减少页面，都需要对 pages 数组进行修改。
     *  文件名不需要写文件后缀，因为框架会自动去寻找路径下 .json, .js, .wxml, .wxss 四个文件进行整合。
     */
    pages: string[]

    /**
     * 用于设置小程序的状态栏、导航条、标题、窗口背景色。
     */
    window?: WindowConfig

    /**
     * 如果小程序是一个多 tab 应用（客户端窗口的底部或顶部有 tab 栏可以切换页面），可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。
     * 当设置 position 为 top 时，将不会显示 icon
     * tabBar 中的 list 是一个数组，只能配置最少2个、最多5个 tab，tab 按数组的顺序排序。
     */
    tabBar?: {
        /**
         * tab 上的文字默认颜色
         */
        color: string

        /**
         * tab 上的文字选中时的颜色
         */
        selectedColor: string
        
        /**
         * tab 的背景色
         */
        backgroundColor: string

        /**
         * tabbar上边框的颜色， 仅支持 black/white
         * default: black
         */
        borderStyle?: string

        /**
         * tab 的列表，详见 list 属性说明，最少2个、最多5个 tab
         */
        list: tabBarList[]

        /**
         * 可选值 bottom、top
         * default: bottom
         */
        position: string
    }

    /**
     * 可以设置各种网络请求的超时时间。
     */
    networkTimeout?: {
        /**
         * wx.request的超时时间，单位毫秒，默认为：60000
         */
        request?: number

        /**
         * wx.connectSocket的超时时间，单位毫秒，默认为：60000
         */
        connectSocket?: number

        /**
         * wx.uploadFile的超时时间，单位毫秒，默认为：60000
         */
        uploadFile?: number

        /**
         * wx.downloadFile的超时时间，单位毫秒，默认为：60000
         */
        downloadFile?: number
    }

    /**
     * 可以在开发者工具中开启 debug 模式，在开发者工具的控制台面板，调试信息以 info 的形式给出，其信息有Page的注册，页面路由，数据更新，事件触发 。 可以帮助开发者快速定位一些常见的问题。
     */
    debug?: boolean
}

export interface tabBarList {
    /**
     * 页面路径，必须在 pages 中先定义
     */
    pagePath: string

    /**
     * tab 上按钮文字
     */
    text: string

    /**
     * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效
     */
    iconPath?: string

    /**
     * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
     */
    selectedIconPath?: string
}
