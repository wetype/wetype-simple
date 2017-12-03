import { UserInfo } from './types'

export interface Target {
    dataset: any
    id: string
    offsetLeft: number
    offsetTop: number
}

export interface Touch {
    /**
     * 触摸点的标识符
     */
    identifier: number

    /**
     * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
     */
    pageX: number

    /**
     * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
     */
    pageY: number

    /**
     * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
     */
    clientX: number

    /**
     * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
     */
    clientY: number
}

export interface WxEvent {
    /**
     * 当前组件的一些属性值集合
     */
    currentTarget: Target
    /**
     * 触发事件的组件的一些属性值集合
     */
    target: Target

    /**
     * 事件类型
     */
    type: string

    /**
     * 事件生成时的时间戳
     */
    timeStamp: number

    /**
     * 自定义事件所携带的数据，如表单组件的提交事件会携带用户的输入，媒体的错误事件会携带错误信息，详见组件定义中各个事件的定义。
     * 点击事件的detail 带有的 x, y 同 pageX, pageY 代表距离文档左上角的距离。
     */
    detail: any
}

export interface WxTouchEvent extends WxEvent {
    /**
     * 触摸事件，当前停留在屏幕中的触摸点信息的数组
     */
    touches: Touch[]

    /**
     * 触摸事件，当前变化的触摸点信息的数组
     */
    changedTouches: Touch[] 
}

export interface GetUserInfoEvent extends WxEvent {
    detail: {
        encryptedData: string
        errMsg: string
        iv: string
        rawData: string
        signature: string
    }
    userInfo: UserInfo
}
