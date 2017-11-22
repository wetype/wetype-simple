import { Options } from './common'

export interface ObjectLiteral {
    [key: string]: any
}

/**
 * #网络
 */
namespace wx {
    /**
     * 发起网络请求
     */
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
        method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
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
    export declare function request(options: RequestOpts): void
    
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
    export declare function uploadFile(options: UploadFileOpts): UploadTask
    
    export interface DownloadFileOpts extends Options<DownloadFileRes> {
        /**
         * 下载资源的 url
         */
        url: string
    
        /**
         * HTTP 请求 Header，header 中不能设置 Referer
         */
        header: ObjectLiteral
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
    
    /**
     * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
     */
    export declare function downloadFile(options: DownloadFileOpts): void
}

/**
 * # 媒体
 */
namespace wx {

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
    /**
     * 从本地相册选择图片或使用相机拍照。
    */
    export declare function chooseImage(opts: ChooseImageOpts): ChooseImageRes


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

    export declare function previewImage(opts: PreviewImageOpts): void

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
    }

    export declare function getImageInfo(opts: GetImageInfoOpts): GetImageInfoRes

    export interface SaveImageToPhotosAlbumOpts extends Options<SaveImageToPhotosAlbumRes> {
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

    /**
     * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
     * 基础库 1.2.0 开始支持，低版本需做兼容处理
     */
    export declare function saveImageToPhotosAlbumave(opts: SaveImageToPhotosAlbumOpts): SaveImageToPhotosAlbumRes


    export interface StartRecordOpts extends Options<StartRecordRes> {

    }

    export interface StartRecordRes {
        /**
         * 录音文件的临时路径
         */
        tempFilePath: string
    }

    /**
     * 注意：1.6.0 版本开始，本接口不再维护。
     * 建议使用能力更强的 wx.getRecorderManager 接口开始录音。当主动调用wx.stopRecord，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
     * 需要用户授权 scope.record
     */
    export declare function startRecord(options: StartRecordOpts): void

    export interface StopRecordRes {}

    /**
     * ​主动调用停止录音
     */
    export declare function stopRecord(options: Options<StopRecordRes>): void

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

    export declare function getRecorderManager(): RecorderManager


    /**
     *  视频
     */

    export interface ChooseVideoOpts {
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
    /**
     * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
     */
    export declare function chooseVideo(): void
    
}

/**
 * # 文件
 */
namespace wx {

}

/**
 * # 数据缓存
 */
namespace wx {

}

/**
 * # 位置
 */
namespace wx {

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

    /**
     * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用。
     */
    export declare function getLocation(opts: GetLocationOpts): void

    
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
    /**
     * 打开地图选择位置。
     * 需要用户授权 scope.userLocation
     */
    export declare function chooseLocation(opts: Options<ChooseLocationRes>): void

    export interface OpenLocationOpts extends Options<OpenLocationRes> {
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

    export interface OpenLocationRes {

    }

    /**
     * 使用微信内置地图查看位置。
     * 需要用户授权 scope.userLocation
     */
    export declare function openLocation(opts: OpenLocationOpts): void

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

    /**
     * 创建并返回 map 上下文 mapContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <map/> 组件
     * @param mapId map组件的id
     * @param context 组件实例this
     */
    export declare function createMapContext(mapId: string, context?: any): MapContext
}

export {
    wx
}

// export namespace wx {}