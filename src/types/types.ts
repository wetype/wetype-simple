import { Options, ErrMsg, ObjectLiteral } from './common'
import { fill } from 'lodash-es'
import { deflateRaw } from 'zlib'

export interface RequestOpts extends Options<RequestRes> {
    url: string
    /**
     * GET 请求自动拼接到url后
     */
    data?: any
    /**
     * 设置请求的 header，header 中不能设置 Referer。
     */
    header?: any
    /**
     * （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     */
    method?:
        | 'OPTIONS'
        | 'GET'
        | 'HEAD'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'TRACE'
        | 'CONNECT'
        | string
    /**
     * 默认：json，如果设为json，会尝试对返回的数据做一次 JSON.parse
     */
    dataType?: string
}
export interface RequestRes {
    /**
     * 开发者服务器返回的数据
     */
    data: any

    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number

    /**
     * 开发者服务器返回的 HTTP Response Header
     */
    header: any
}

export interface UploadFileOpts extends Options<UploadFileRes> {
    /**
     * 开发者服务器 url
     */
    url: string
    /**
     * 要上传文件资源的路径
     */
    filePath: string
    /**
     * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
     */
    name: string
    /**
     * HTTP 请求 Header, header 中不能设置 Referer
     */
    header?: any
    /**
     * HTTP 请求中其他额外的 form data
     */
    formData?: any
}

export interface UploadFileRes {
    /**
     * 开发者服务器返回的数据
     */
    data: any
    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number
}
export interface UploadTask {
    onProgressUpdate(): void
    /**
     * 取消任务
     */
    abort(): void
}
export interface UploadFileResPromisified extends Promise<UploadFileRes> {
    uploadTask: UploadTask
}

export interface DownloadFileOpts extends Options<DownloadFileRes> {
    /**
     * 下载资源的 url
     */
    url: string

    /**
     * HTTP 请求 Header，header 中不能设置 Referer
     */
    header?: ObjectLiteral
}

export interface DownloadFileRes {
    /**
     * 临时文件路径，下载后的文件会存储到一个临时文件
     */
    tempFilePath: string

    /**
     * 临时文件路径，下载后的文件会存储到一个临时文件
     */
    statusCode: number
}

export interface ChooseImageOpts extends Options<ChooseImageRes> {
    /**
     * 最多可以选择的图片张数，默认9
     */
    count?: number

    /**
     * original 原图，compressed 压缩图，默认二者都有
     */
    sizeType?: string[]

    /**
     * album 从相册选图，camera 使用相机，默认二者都有
     */
    sourceType?: string[]
}

export interface ChooseImageRes {
    /**
     * 图片的本地文件路径列表
     */
    tempFilePaths: string[]

    /**
     * 图片的本地文件列表，每一项是一个 File 对象
     */
    tempFiles: File[]
}

export interface File {
    /**
     * 本地文件路径
     */
    path: string

    /**
     * 本地文件大小，单位：B
     */
    size: number
}

export interface PreviewImageOpts extends Options<void> {
    /**
     * 当前显示图片的链接，不填则默认为 urls 的第一张
     */
    current?: string

    /**
     * 需要预览的图片链接列表
     */
    urls: string[]
}

export interface GetImageInfoOpts extends Options<GetImageInfoRes> {
    /**
     * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
     */
    src: string
}

export interface GetImageInfoRes {
    /**
     * 图片宽度，单位px
     */
    width: number

    /**
     * 图片高度，单位px
     */
    height: number

    /**
     * 返回图片的本地路径
     */
    path: string

    /**
     * 返回图片的方向，有效值见下表
     */
    orientation:
        | 'up'
        | 'down'
        | 'left'
        | 'right'
        | 'up-mirrored'
        | 'down-mirrored'
        | 'left-mirrored'
        | 'right-mirrored'

    /**
     * 返回图片的格式
     */
    type: string
}

export interface SaveImageToPhotosAlbumOpts
    extends Options<SaveImageToPhotosAlbumRes> {
    /**
     * 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
     */
    filePath: string
}

export interface SaveImageToPhotosAlbumRes {
    /**
     * 调用结果
     */
    errMsg: string
}

export interface StartRecordRes {
    /**
     * 录音文件的临时路径
     */
    tempFilePath: string
}

export interface RecorderStartOptions {
    /**
     * 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
     */
    duration?: number

    /**
     * 采样率，有效值 8000/16000/44100
     */
    sampleRate?: number

    /**
     * 录音通道数，有效值 1/2
     */
    numberOfChannels?: number

    /**
     * 编码码率，有效值见下表格
     */
    encodeBitRate?: number

    /**
     * 音频格式，有效值 aac/mp3
     */
    format: string

    /**
     * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
     */
    frameSize: number
}

export interface RecorderManager {
    /**
     * 开始录音
     */
    start(options: RecorderStartOptions): void

    /**
     * 暂停录音
     */
    pause(): void

    /**
     * 继续录音
     */
    resume(): void

    /**
     * 停止录音
     */
    stop(): void

    /**
     * 录音开始事件
     */
    onStart(cb: () => void): void

    /**
     * 录音暂停事件
     */
    onPause(cb: () => void): void

    /**
     * 录音停止事件，会回调文件地址
     */
    onStop(cb: (res: { tempFilePath: string }) => void): void

    /**
     * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
     */
    onFrameRecorded(cb: ({ frameBuffer: Buffer }) => void): void

    /**
     * 录音错误事件, 会回调错误信息
     */
    onError(cb: (err: any) => void): void
}

export interface ChooseVideoOpts extends Options<ChooseVideoRes> {
    /**
     * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
     */
    sourceType?: string[]

    /**
     * 是否压缩所选的视频源文件，默认值为true，需要压缩
     */
    compressed?: boolean

    /**
     * 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
     */
    maxDuration?: number

    /**
     * 默认调起的为前置还是后置摄像头。front: 前置，back: 后置，默认 back
     */
    camera?: string
}

export interface ChooseVideoRes {
    /**
     * 选定视频的临时文件路径
     */
    tempFilePath: string

    /**
     * 选定视频的时间长度
     */
    duration: number

    /**
     * 选定视频的数据量大小
     */
    size: number

    /**
     * 返回选定视频的长
     */
    height: number

    /**
     * 返回选定视频的宽
     */
    width: number
}

export interface SaveFileRes {
    savedFilePath: string
}

export interface SaveFileOpts extends Options<SaveFileRes> {
    /**
     * 需要保存的文件的临时路径
     */
    tempFilePath: string
}

export interface GetFileInfoRes {
    /**
     * 文件大小，单位：B
     */
    size: number

    /**
     * 按照传入的 digestAlgorithm 计算得出的的文件摘要
     */
    digest: string

    /**
     * 调用结果
     *
     */
    errMsg: string
}
export interface GetFileInfoOpts extends Options<GetFileInfoRes> {
    /**
     * 本地文件路径
     */
    filePath: string

    /**
     * 计算文件摘要的算法，默认值 md5，有效值：md5，sha1
     */
    digestAlgorithm?: string
}

export interface GetSavedFileListRes {
    /**
     * 接口调用结果
     */
    errMsg: string
    /**
     * 文件列表
     */
    fileList: {
        /**
         * 文件的本地路径
         */
        filePath: string
        /**
         * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
         */
        createTime: number
        /**
         * 文件大小，单位B
         */
        size: number
    }[]
}

export interface GetSavedFileInfoRes {
    /**
     * 接口调用结果
     */
    errMsg: string

    /**
     * 文件大小，单位B
     */
    size: number

    /**
     * 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
     */
    createTime: number
}

export interface GetSavedFileInfoOpts extends Options<GetSavedFileInfoRes> {
    /**
     * 文件路径
     */
    filePath: string
}

export interface RemoveSavedFileOpts extends Options<void> {
    /**
     * 需要删除的文件路径
     */
    filePath: string
}

export interface OpenDocumentOpts extends Options<void> {
    /**
     * 文件路径，可通过 downFile 获得
     */
    filePath: string

    /**
     * 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
     */
    fileType?: string
}
export interface SetStorageOpts extends Options<void> {
    key: string
    data: ObjectLiteral | string
}

export interface GetStorageOpts extends Options<GetStorageRes> {
    key: string
}

export interface GetStorageRes {
    data: any
}

export interface GetStorageInfoRes {
    /**
     * 当前storage中所有的key
     */
    keys: string[]

    /**
     * 当前占用的空间大小, 单位kb
     */
    currentSize: number

    /**
     * 限制的空间大小，单位kb
     */
    limitSize: number
}

export interface RemoveStorageOpts extends Options<RemoveStorageRes> {
    key: string
}

export interface RemoveStorageRes {}

export interface GetLocationOpts extends Options<GetLocationRes> {
    /**
     * 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
     */
    type?: string
}

export interface GetLocationRes {
    /**
     * 纬度，浮点数，范围为-90~90，负数表示南纬
     */
    latitude: number

    /**
     * 经度，浮点数，范围为-180~180，负数表示西经
     */
    longitude: number

    /**
     * 速度，浮点数，单位m/s
     */
    speed: number

    /**
     * 位置的精确度
     */
    accuracy: number

    /**
     * 高度，单位 m
     */
    altitude: number

    /**
     * 垂直精度，单位 m（Android 无法获取，返回 0）
     */
    verticalAccuracy: number

    /**
     * 水平精度，单位 m
     */
    horizontalAccuracy: number
}

export interface ChooseLocationRes {
    /**
     * 位置名称
     */
    name: string

    /**
     * 详细地址
     */
    address: string

    /**
     * 纬度，浮点数，范围为-90~90，负数表示南纬
     */
    latitude: number

    /**
     * 经度，浮点数，范围为-180~180，负数表示西经
     */
    longitude: number
}

export interface OpenLocationOpts extends Options<void> {
    /**
     * 纬度，范围为-90~90，负数表示南纬
     */
    latitude: number

    /**
     * 经度，范围为-180~180，负数表示西经
     */
    longitude: number

    /**
     * 缩放比例，范围5~18，默认为18
     */
    scale?: number

    /**
     * 位置名
     */
    name?: string

    /**
     * 地址的详细说明
     */
    address?: string
}

export interface Coordinate {
    /**
     * 经度
     */
    longitude: number

    /**
     * 纬度
     */
    latitude: number
}

export interface TranslateMarker {
    /**
     * 指定marker
     */
    markerId: string

    /**
     * 指定marker移动到的目标点
     */
    destination: ObjectLiteral

    /**
     * 移动过程中是否自动旋转marker
     */
    autoRotate: boolean

    /**
     * marker的旋转角度
     */
    rotate: number

    /**
     * 动画持续时长，默认值1000ms，平移与旋转分别计算
     */
    duration?: number

    /**
     * 动画结束回调函数
     */
    animationEnd?(cb: () => void): void

    /**
     * 接口调用失败的回调函数
     */
    fail?(cb: () => void): void
}

export interface IncludePoints {
    /**
     * 要显示在可视区域内的坐标点列表，[{latitude, longitude}]
     */
    points: Coordinate[]

    /**
     * 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。
     */
    padding?: number[]
}

export interface CoordinateSouthwestNorthEast {
    /**
     * 西南角与东北角的经纬度
     */
    southwest: Coordinate

    northeast: Coordinate
}

export interface Scale {
    scale: number
}

export interface MapContext {
    /**
     * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation
     */
    getCenterLocation(cb: Options<Coordinate>): void

    /**
     * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
     */
    moveToLocation(): void

    /**
     * 平移marker，带动画
     */
    translateMarker: TranslateMarker

    /**
     * 缩放视野展示所有经纬度
     */
    includePoints: IncludePoints

    /**
     * 获取当前地图的视野范围
     */
    getRegion: Options<CoordinateSouthwestNorthEast>

    /**
     * 获取当前地图的缩放级别
     */
    getScale: Options<Scale>
}

export interface GetSystemInfoRes {
    /**
     * 手机品牌
     */
    brand: string

    /**
     * 手机型号
     */
    model: string

    /**
     * 设备像素比
     */
    pixelRatio: number | string

    /**
     * 屏幕宽度
     */
    screenWidth: number

    /**
     * 屏幕高度
     */
    screenHeight: number

    /**
     * 可使用窗口宽度
     */
    windowWidth: number

    /**
     * 可使用窗口高度
     */
    windowHeight: number

    /**
     * 微信设置的语言
     */
    language: string

    /**
     * 微信版本号
     */
    version: string | number

    /**
     * 操作系统版本
     */
    system: string

    /**
     * 状态栏的高度
     */
    statusBarHeight: number

    /**
     * 客户端平台
     */
    platform: string

    /**
     * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
     */
    fontSizeSetting: number

    /**
     * 客户端基础库版本
     */
    SDKVersion: string | number

    /**
     * 电池剩余电量百分比
     */
    batteryLevel: number
}

export type NetworkType = 'wifi' | '2g' | '3g' | '4g' | 'unknown' | 'none'

export interface GetNetworkTypeRes {
    /**
     * 网络类型
     * wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
     */
    networkType: NetworkType
}

export interface AccelerometerChangeRes {
    x: number
    y: number
    z: number
}

export interface CompassChangeRes {
    /**
     * 面对的方向度数
     */
    direction: number
}

export interface SetScreenBrightnessOpts extends Options<void> {
    /**
     * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
     */
    value: number
}

export interface GetScreenBrightnessRes {
    /**
     * 	屏幕亮度值，范围 0~1，0 最暗，1 最亮
     */
    value: number
}

export interface MakePhoneCallOpts extends Options<void> {
    /**
     * 需要拨打的电话号码
     */
    phoneNumber: string
}

export interface ScanCodeOpts extends Options<ScanCodeRes> {
    /**
     * 是否只能从相机扫码，不允许从相册选择图片
     */
    onlyFromCamera?: boolean
}

export interface ScanCodeRes {
    /**
     * 所扫码的内容
     */
    result: string

    /**
     * 所扫码的类型
     */
    scanType: string

    /**
     * 所扫码的字符集
     */
    charSet: string

    /**
     * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
     */
    path: string
}

export interface SetClipboardDataOpts extends Options<void> {
    /**
     * 需要设置的内容
     */
    data: string
}

export interface SetClipboardDataRes {
    /**
     * 剪贴板的内容
     */
    data: string
}

export interface AddPhoneContactOpts {
    /**
     * 头像本地文件路径
     */
    photoFilePath?: string

    /**
     * 昵称
     */
    nickName?: string

    /**
     * 姓氏
     */
    lastName?: string

    /**
     * 中间名
     */
    middleName?: string

    /**
     * 名字
     */
    firstName: string

    /**
     * 备注
     */
    remark?: string

    /**
     * 手机号
     */
    mobilePhoneNumber?: string

    /**
     * 微信号
     */
    weChatNumber?: string

    /**
     * 联系地址国家
     */
    addressCountry?: string

    /**
     * 联系地址省份
     */
    addressState?: string

    /**
     * 联系地址城市
     */
    addressCity?: string

    /**
     * 联系地址街道
     */
    addressStreet?: string

    /**
     * 联系地址邮政编码
     */
    addressPostalCode?: string

    /**
     * 公司
     */
    organization?: string

    /**
     * 职位
     */
    title?: string

    /**
     * 工作传真
     */
    workFaxNumber?: string

    /**
     * 工作电话
     */
    workPhoneNumber?: string

    /**
     * 公司电话
     */
    hostNumber?: string

    /**
     * 电子邮件
     */
    email?: string

    /**
     * 网站
     */
    url?: string

    /**
     * 工作地址国家
     */
    workAddressCountry?: string

    /**
     * 工作地址省份
     */
    workAddressState?: string

    /**
     * 工作地址城市
     */
    workAddressCity?: string

    /**
     * 工作地址街道
     */
    workAddressStreet?: string

    /**
     * 工作地址邮政编码
     */
    workAddressPostalCode?: string

    /**
     * 住宅传真
     */
    homeFaxNumber?: string

    /**
     * 住宅电话
     */
    homePhoneNumber?: string

    /**
     * 住宅地址国家
     */
    homeAddressCountry?: string

    /**
     * 住宅地址省份
     */
    homeAddressState?: string

    /**
     * 住宅地址城市
     */
    homeAddressCity?: string

    /**
     * 住宅地址街道
     */
    homeAddressStreet?: string

    /**
     * 住宅地址邮政编码
     */
    homeAddressPostalCode?: string

    /**
     * 接口调用成功
     */
    success?(cb: (res: ErrMsg<'ok'>) => void): void

    /**
     *
     */
    fail?(cb: (res: ErrMsg<string>) => void): void

    /**
     *
     */
    complete?(cb: () => void): void
}

export interface StartPullDownRefreshRes {
    errMsg: ErrMsg<string>
}

export interface SelectorQuery {
    /**
     * 将选择器的选取范围更改为自定义组件component内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。）
     */
    in(): any

    /**
     * 在当前页面下选择第一个匹配选择器selector的节点，返回一个NodesRef对象实例，可以用于获取节点信息。
     * @param selector
     */
    select(selector: string): NodeRef

    selectAll(selector: string): NodeRef

    selectViewport(): NodeRef

    exec(callback?: () => void): void
}

export interface NodeRef {
    boundingClientRect(callback: (rect: Rect | Rect[]) => void): SelectorQuery

    scrollOffset(callback: (res: ScrollOffsetRes) => void): SelectorQuery

    fields(
        fields: FieldsOpts,
        callback: (res: FieldsRes | FieldsRes[]) => void
    ): SelectorQuery
}

export interface Rect {
    id: string

    dataset: any

    left: number

    right: number

    top: number

    bottom: number

    width: number

    height: number
}

export interface ScrollOffsetRes {
    id: string
    dataset: any
    scrollLeft: number
    scrollTop: number
}

export interface FieldsOpts {
    id?: string
    dataset?: boolean
    size?: boolean
    rect?: boolean
    scrollOffset?: boolean
    properties?: string[]
}

export interface FieldsRes {
    dataset: any
    width: number
    height: number
    scrollLeft: number
    scrollTop: number
    scrollX: number
    scrollY: number
}

export interface ShowToastOpts extends Options<void> {
    /**
     * 提示的内容
     */
    title: string

    /**
     * 图标，有效值 "success", "loading"
     */
    icon?: string

    /**
     * 自定义图标的本地路径，image 的优先级高于 icon
     */
    image?: string

    /**
     * 提示的延迟时间，单位毫秒
     * 默认：1500
     */
    duration?: number

    /**
     * 是否显示透明蒙层，防止触摸穿透
     * 默认：false
     */
    mask?: boolean
}

export interface ShowLoadingOpts extends Options<void> {
    /**
     * 提示的内容
     */
    title: string

    /**
     * 是否显示透明蒙层，防止触摸穿透
     * 默认：false
     */
    mask?: boolean
}

export interface ShowModalOpts extends Options<ShowModalRes> {
    /**
     * 提示的标题
     */
    title: string

    /**
     * 提示的内容
     */
    content: string

    /**
     * 是否显示取消按钮，默认为 true
     */
    showCancel?: boolean

    /**
     * 取消按钮的文字，默认为"取消"，最多 4 个字符
     */
    cancelText?: string

    /**
     * 取消按钮的文字颜色，默认为"#000000"
     */
    cancelColor?: string

    /**
     * 确定按钮的文字，默认为"确定"，最多 4 个字符
     */
    confirmText?: string

    /**
     * 确定按钮的文字颜色，默认为"#3CC51F"
     */
    confirmColor?: string
}

export interface ShowModalRes {
    /**
     * 为 true 时，表示用户点击了确定按钮
     */
    confirm: boolean

    /**
     * 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
     */
    cancel: boolean
}

export interface ShowActionSheetOpts extends Options<ShowActionSheetRes> {
    /**
     * 按钮的文字数组，数组长度最大为6个
     */
    itemList: string[]

    /**
     * 按钮的文字颜色，默认为"#000000"
     */
    itemColor?: string
}

export interface ShowActionSheetRes {
    /**
     * 用户点击的按钮，从上到下的顺序，从0开始
     */
    tapIndex: number
}

export interface SetNavigationBarTitleOpts extends Options<void> {
    /**
     * 页面标题
     */
    title: string
}
export interface AnimationObj {
    /**
     * 动画变化时间，默认0，单位：毫秒
     */
    duration?: number

    /**
     * 动画变化方式，默认 linear
     */
    timingFunc?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
}
export interface SetNavigationBarColorOpts extends Options<void> {
    /**
     * 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
     */
    frontColor: string

    /**
     * 背景颜色值，有效值为十六进制颜色
     */
    backgroundColor: string

    /**
     * 是否有动画效果
     */
    animation?: AnimationObj
}

export interface SetTabBarBadgeOpts extends Options<void> {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number

    /**
     * 显示的文本，超过 3 个字符则显示成“…”
     */
    text: string
}

export interface RemoveTabBarBadgeOpts extends Options<void> {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number
}

export interface SetTabBarStyleOpts extends Options<void> {
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
     */
    borderStyle: string
}

export interface SetTabBarItemOpts extends Options<void> {
    /**
     * tabBar 的哪一项，从左边算起
     */
    index: number
    /**
     * tab 上按钮文字
     */
    text?: string
    /**
     * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
     */
    iconPath?: string
    /**
     * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
     */
    selectedIconPath?: string
}

export interface ShowTabBarOpts extends Options<void> {
    /**
     * 是否需要动画效果，默认无
     */
    animation?: boolean
}

export interface HideTabBarOpts extends Options<void> {
    /**
     * 是否需要动画效果，默认无
     */
    animation?: boolean
}

export interface SetTopBarTextOpts extends Options<SetTopBarTextRes> {
    /**
     * 置顶栏文字内容
     */
    text: string
}

export interface SetTopBarTextRes {}

export interface NavigateToOpts extends Options<void> {
    /**
     * 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
     */
    url: string
}

export interface RedirectToOpts extends Options<void> {
    /**
     * 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
     */
    url: string
}

export interface SwitchTabOpts extends Options<void> {
    /**
     * 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
     */
    url: string
}

export interface NavigateBackOpts extends Options<void> {
    /**
     * 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
     * 默认 1
     */
    delta?: number
}

export interface LoginRes {
    /**
     * 调用结果
     */
    errMsg: string

    /**
     * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
     */
    code: string
}

export interface AuthorizeRes {
    /**
     * 调用结果
     */
    errMsg: string
}

export interface AuthorizeOpts extends Options<AuthorizeRes> {
    /**
     * 需要获取权限的scope，详见 scope 列表
     */
    scope: string
}

export interface GetUserInfoOpts extends Options<GetUserInfoRes> {
    /**
     * 是否带上登录态信息
     */
    withCredentials?: boolean

    /**
     * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en
     */
    lang?: string
}

export interface UserInfo {
    /**
     * 用户昵称
     */
    nickName: string

    /**
     * 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
     */
    avatarUrl: string

    /**
     * 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
     */
    gender: string

    /**
     * 用户所在城市
     */
    city: string

    /**
     * 用户所在省份
     */
    province: string

    /**
     * 用户所在国家
     */
    country: string

    /**
     * 用户的语言，简体中文为zh_CN
     */
    language: string
}

export interface GetUserInfoRes {
    /**
     * 用户信息对象，不包含 openid 等敏感信息
     */
    userInfo: UserInfo

    /**
     * 不包括敏感信息的原始数据字符串，用于计算签名。
     */
    rawData: string

    /**
     * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 signature。
     */
    signature: string

    /**
     * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
     */
    encryptedData: string

    /**
     * 加密算法的初始向量，详细见加密数据解密算法
     */
    iv: string
}

export interface RequestPaymentOpts {
    /**
     * 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
     */
    timeStamp: string

    /**
     * 随机字符串，长度为32个字符以下。
     */
    nonceStr: string

    /**
     * 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
     */
    package: string

    /**
     * 签名算法，暂支持 MD5
     */
    signType: string

    /**
     * 签名,具体签名方案参见小程序支付接口文档;
     */
    paySign: string

    /**
     *
     */
    success(cb: (res: RequestPaymentRes) => void): void

    fail(cb: (res: RequestPaymentRes) => void): void

    complete(cb: () => void): void
}

export interface RequestPaymentRes {
    errMsg: 'requestPayment:ok' | 'requestPayment:fail cancel' | string
}

export interface ShowShareMenuOpts extends Options<void> {
    /**
     * 是否使用带 shareTicket 的转发
     */
    withShareTicket?: boolean
}

export interface GetShareInfoOpts extends Options<GetShareInfoRes> {
    /**
     * shareTicket
     */
    shareTicket: string
}

export interface GetShareInfoRes {
    /**
     * 错误信息
     */
    errMsg: string

    /**
     * 包括敏感数据在内的完整转发信息的加密数据，详细见加密数据解密算法
     */
    encryptedData: string

    /**
     * 加密算法的初始向量，详细见加密数据解密算法
     */
    iv: string
}

export type Scope =
    | 'scope.userInfo'
    | 'scope.userLocation'
    | 'scope.address'
    | 'scope.invoiceTitle'
    | 'scope.werun'
    | 'scope.record'
    | 'scope.writePhotosAlbum'
export interface OpenSettingRes {
    /**
     * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，详见 scope 列表
     */
    authSetting: {
        [key: string]: boolean
    }
}

export interface NavigateToMiniProgramOpts
    extends Options<NavigateToMiniProgramRes> {
    /**
     * 要打开的小程序 appId
     */
    appId: string

    /**
     * 打开的页面路径，如果为空则打开首页
     */
    path?: string

    /**
     * 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据
     */
    extraData?: ObjectLiteral

    /**
     * 要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） ，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是体验版或正式版，则打开的小程序必定是正式版。默认值 release
     */
    envVersion?: string
}

export interface NavigateToMiniProgramRes {
    /**
     * 调用结果
     */
    errMsg: string
}

export interface NavigateBackMiniProgramOpts
    extends Options<NavigateToMiniProgramRes> {
    /**
     * 需要返回给上一个小程序的数据，上一个小程序可在 App.onShow() 中获取到这份数据。
     */
    extraData?: ObjectLiteral
}

export type SupportMode = 'fingerPrint' | 'facial' | 'speech' | string
export interface CheckIsSupportSoterAuthenticationRes {
    /**
     * 该设备支持的可被SOTER识别的生物识别方式
     */
    supportMode: SupportMode[]

    /**
     * 接口调用结果
     */
    errMsg: string
}

export interface SetEnableDebugOpts extends Options<ErrMsg<string>> {
    /**
     * 是否打开调试
     */
    enableDebug: boolean
}

export interface UpdateManager {
    /**
     * 当向微信后台请求完新版本信息，会进行回调
     * hasUpdate: 是否有新的版本
     */
    onCheckForUpdate: (callback: (res: { hasUpdate: boolean }) => void) => void

    /**
     * 当新版本下载完成，会进行回调
     */
    onUpdateReady: (callback: () => void) => void

    /**
     * 当新版本下载失败，会进行回调
     */
    onUpdateFailed: (callback: () => void) => void

    /**
     * 当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
     */
    applyUpdate: () => void
}

export interface Worker {
    /**
     * 向 Worker 线程发送的消息。
     */
    postMessage: (message: ObjectLiteral) => void

    /**
     * 监听 Worker 线程向当前线程发送的消息
     */
    onMessage: (callback: (obj: ObjectLiteral) => void) => void

    /**
     * 结束当前 Worker 线程，仅限在主线程 Worker 实例上调用。
     */
    terminate: () => void
}

export interface CanvasToTempFilePathRes {
    tempFilePath: string
}

export interface CanvasToTempFilePathOpts
    extends Options<CanvasToTempFilePathRes> {
    /**
     * 画布x轴起点（默认0）
     */
    x?: number
    /**
     * 画布y轴起点（默认0）
     */
    y?: number
    /**
     * 画布宽度（默认为canvas宽度-x）
     */
    width?: number
    /**
     * 画布高度（默认为canvas高度-y）
     */
    height?: number
    /**
     * 输出图片宽度（默认为width）
     */
    destWidth?: number
    /**
     * 输出图片高度（默认为height）
     */
    destHeight?: number
    /**
     * 画布标识，传入 <canvas/> 的 canvas-id
     */
    canvasId: string
    /**
     * 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'png'
     */
    fileType?: string
    /**
     * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
     */
    quality?: number
}

export interface CanvasGetImageDataRes {
    errMsg: string
    /**
     * 图像数据矩形的宽度
     */
    width: number

    /**
     * 图像数据矩形的高度
     */
    height: number

    /**
     * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
     */
    data: string[]
}
export interface CanvasGetImageDataOpts extends Options<CanvasGetImageDataRes> {
    /**
     * 画布标识，传入 <canvas /> 的 canvas-id
     */
    canvasId: string
    /**
     * 将要被提取的图像数据矩形区域的左上角 x 坐标
     */
    x: number
    /**
     * 将要被提取的图像数据矩形区域的左上角 y 坐标
     */
    y: number
    /**
     * 将要被提取的图像数据矩形区域的宽度
     */
    width: number
    /**
     * 将要被提取的图像数据矩形区域的高度
     */
    height: number
}

export interface CanvasPutImageDataOpts extends Options<void> {
    /**
     * 画布标识，传入 <canvas /> 的 canvas-id
     */
    canvasId: string
    /**
     * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
     */
    data: string[]
    /**
     * 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
     */
    x: number
    /**
     * 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
     */
    y: number
    /**
     * 源图像数据矩形区域的宽度
     */
    width: number
    /**
     * 源图像数据矩形区域的高度
     */
    height: number
}

export interface Grd {
    /**
     * 用于指定颜色渐变点的位置和颜色，位置必须位于0到1之间。
     */
    addColorStop(postion: number, color: string)
}
export interface CanvasIns {
    /**
     * 设置填充色。
     */
    fillStyle: string
    setFillStyle(color: string | Grd): void

    /**
     * 设置边框颜色。
     */
    strokeStyle: string
    setStrokeStyle(color: string): void

    /**
     * 设置阴影样式。
     * Tip: 如果没有设置，offsetX 默认值为0， offsetY 默认值为0， blur 默认值为0，color 默认值为 black。
     */
    shadowOffsetX: number
    shadowOffsetY: number
    shadowColor: string
    shadowBlur: number
    setShadow(
        /**
         * 阴影相对于形状在水平方向的偏移
         */
        offsetX: number,
        /**
         * 阴影相对于形状在竖直方向的偏移
         */
        offsetY: number,
        /**
         * 阴影的模糊级别，数值越大越模糊
         * 范围：0~100
         */
        blur: number,
        /**
         * 阴影的颜色
         */
        color: string
    ): void

    createLinearGradient(
        /**
         * 起点的x坐标
         */
        x0: number,
        /**
         * 起点的y坐标
         */
        y0: number,
        /**
         * 终点的x坐标
         */
        x1: number,
        /**
         * 终点的y坐标
         */
        y: number
    ): CanvasIns

    createCircularGradient(
        /**
         * 圆心的x坐标
         */
        x: number,
        /**
         * 圆心的y坐标
         */
        y: number,
        /**
         * 圆的半径
         */
        r: number
    ): CanvasIns

    /**
     * 用于指定颜色渐变点的位置和颜色，位置必须位于0到1之间。
     */
    addColorStop(postion: number, color: string): void

    /**
     * 设置线条的宽度。
     */
    lineWidth: number
    setLineWidth(lineWidth: number): void

    /**
     * 设置线条的端点样式。
     */
    lineCap: 'butt' | 'round' | 'square'
    setLineCap(lineCap: 'butt' | 'round' | 'square'): void

    /**
     * 设置线条的交点样式。
     */
    lineJoin: 'bevel' | 'round' | 'miter'
    setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void

    /**
     * 设置线条的宽度。
     */
    setLineDash(pattern: number[], offset: number): void

    /**
     * 设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。 当 setLineJoin() 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示
     */
    miterLimit: number
    setMiterLimit(miterLimit: number): void

    /**
     * 创建一个矩形。
     */
    rect(
        /**
         * 矩形路径左上角的x坐标
         */
        x: number,
        /**
         * 矩形路径左上角的y坐标
         */
        y: number,
        /**
         * 矩形路径的宽度
         */
        width: number,
        /**
         * 矩形路径的高度
         */
        height: number
    ): void

    /**
     * 填充一个矩形。
     */
    fillRect(
        /**
         * 矩形路径左上角的x坐标
         */
        x: number,
        /**
         * 矩形路径左上角的y坐标
         */
        y: number,
        /**
         * 矩形路径的宽度
         */
        width: number,
        /**
         * 矩形路径的高度
         */
        height: number
    ): void

    /**
     * 画一个矩形(非填充)。
     */
    strokeRect: (
        /**
         * 矩形路径左上角的x坐标
         */
        x: number,
        /**
         * 矩形路径左上角的y坐标
         */
        y: number,
        /**
         * 矩形路径的宽度
         */
        width: number,
        /**
         * 矩形路径的高度
         */
        height: number
    ) => void

    /**
     * 清除画布上在该矩形区域内的内容。
     */
    clearRect(
        /**
         * 矩形路径左上角的x坐标
         */
        x: number,
        /**
         * 矩形路径左上角的y坐标
         */
        y: number,
        /**
         * 矩形路径的宽度
         */
        width: number,
        /**
         * 矩形路径的高度
         */
        height: number
    )

    /**
     * 对当前路径中的内容进行填充。默认的填充色为黑色。
     */
    fill(): void

    /**
     * 画出当前路径的边框。默认颜色色为黑色。
     */
    stroke(): void

    /**
     * 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边。
     */
    beginPath(): void

    /**
     * 关闭一个路径
     */
    closePath(): void

    /**
     * 把路径移动到画布中的指定点，不创建线条。
     */
    moveTo(x: number, y: number): void

    /**
     * lineTo 方法增加一个新点，然后创建一条从上次指定点到目标点的线。
     */
    lineTo(x: number, y: number): void

    /**
     * 画一条弧线。
     */
    arc(
        x: number,
        y: number,
        r: number,
        sAngle: number,
        eAngle: number,
        counterclockwise?: boolean
    ): void

    /**
     * 创建三次方贝塞尔曲线路径。
     */
    bezierCurveTo(
        cp1x: number,
        cp1y: number,
        cp2x: number,
        cp2y: number,
        x: number,
        y: number
    ): void

    /**
     * 创建二次贝塞尔曲线路径。
     */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void

    /**
     * 在调用scale方法后，之后创建的路径其横纵坐标会被缩放。多次调用scale，倍数会相乘。
     */
    scale(scaleWidth: number, scaleHeight: number): void

    /**
     * 以原点为中心，原点可以用 translate方法修改。顺时针旋转当前坐标轴。多次调用rotate，旋转的角度会叠加。
     */
    rotate(rotate: number): void

    /**
     * 对当前坐标系的原点(0, 0)进行变换，默认的坐标系原点为页面左上角。
     */
    translate(x: number, y: number): void

    /**
     * clip() 方法从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
     */
    clip(): void

    /**
     * 设置字体的字号。
     */
    setFontSize(fontSize: number): void

    /**
     * 在画布上绘制被填充的文本。
     */
    fillText(text: string, x: number, y: number, maxWidth?: number): void

    /**
     * 用于设置文字的对齐
     */
    textAlign: 'left' | 'center' | 'right'
    setTextAlign(align: 'left' | 'center' | 'right'): void

    /**
     * 用于设置文字的水平对齐
     */
    textBaseline: 'top' | 'bottom' | 'middle' | 'normal'
    setTextBaseline(textBaseline: 'top' | 'bottom' | 'middle' | 'normal'): void

    /**
     * 绘制图像到画布。
     */
    drawImage(
        imageResource: string,
        dx: number,
        dy: number,
        dWidth?: number,
        dHeight?: number,
        sx?: number,
        sy?: number,
        sWidth?: number,
        sHeight?: number
    ): void

    /**
     * 设置全局画笔透明度。
     */
    globalAlpha: number
    setGlobalAlpha(alpha: number): void

    /**
     * 保存当前绘图的上下文
     */
    save(): void

    /**
     * 恢复当前绘图的上下文
     */
    restore(): void

    /**
     * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
     */
    draw: (reserveOrCallback?: boolean | (() => void)) => void

    /**
     * 测量文本尺寸信息，目前仅返回文本宽度。同步接口。
     */
    measureText(text: string): { width: number }

    /**
     * 该属性是设置要在绘制新形状时应用的合成操作的类型。
     */
    globalCompositeOperation: number

    /**
     * 根据控制点和半径绘制圆弧路径。
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void

    /**
     * 给定的 (x, y) 位置绘制文本描边的方法
     */
    strokeText(text: number, x: number, y: number, maxWidth?: number): void

    /**
     * 设置虚线偏移量的属性
     */
    lineDashOffset: number

    /**
     * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
     *
     * @param {string} image
     * @param {('repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat')} repetition
     * @memberof CanvasIns
     */
    createPattern(
        /**
         * 重复的图像源，仅支持包内路径和临时路径
         */
        image: string,
        /**
         * 指定如何重复图像
         */
        repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
    ): void

    /**
     * 设置当前字体样式的属性
     *
     * @type {string} 符合 CSS font 语法的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif
     * @memberof CanvasIns
     */
    font: string

    /**
     * 使用矩阵重新设置（覆盖）当前变换的方法
     *
     * @param {number} scaleX
     * @param {number} skewX
     * @param {number} skewY
     * @param {number} scaleY
     * @param {number} translateX
     * @param {number} translateY
     * @memberof CanvasIns
     */

    setTransform(
        scaleX: number,
        skewX: number,
        skewY: number,
        scaleY: number,
        translateX: number,
        translateY: number
    ): void
}

export interface IPageScrollToOpts {
    /**
     * 滚动到页面的目标位置（单位px）
     */
    scrollTop: number
    /**
     * 滚动动画的时长，默认300ms，单位 ms
     */
    duration?: number
}
