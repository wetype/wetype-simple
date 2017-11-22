import { Options } from './common'

export declare namespace wx {
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
    export function request(options: RequestOpts): void
    
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
    export interface UploadFileResPromisified extends  Promise<UploadFileRes> {
        uploadTask: UploadTask
    }
    export function uploadFile(options: UploadFileOpts): UploadTask

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

    export function chooseImage(opts: ChooseImageOpts): ChooseImageRes


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

    export function previewImage(opts: PreviewImageOpts): void

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

    export function getImageInfo(opts: GetImageInfoOpts): GetImageInfoRes

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

    export function saveImageToPhotosAlbumave(opts: SaveImageToPhotosAlbumOpts): SaveImageToPhotosAlbumRes
}
