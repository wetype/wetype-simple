import { promisify } from '../lib/util'
import { wx } from './wx'

/**
 * 发起网络请求
 * @param options 
 */
export const request = (options: wx.RequestOpts): Promise<wx.RequestRes> => 
    promisify<wx.RequestRes>(options, wx.request)


/**
 * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
 * @param options 
 */
export const uploadFile = (options: wx.UploadFileOpts): wx.UploadFileResPromisified => {
    let uploadTask: wx.UploadTask
    let promise: any = new Promise((resolve, reject) => {
        options.success = resolve
        options.fail = reject
        promise.uploadTask = wx.uploadFile(options)
    })
    return promise
}