import { wx } from './wx'
import { promisify } from '../lib/util'
import * as wxTypes from '../types/types'

/**
 * rpx 转 px
 * @param rpx 
 * @param screenWidthInPx 
 */
export const rpx2px = (rpx: number, screenWidthInPx: number) => {
    // 所有屏幕的宽都为750rpx
    let ratio = screenWidthInPx / 750
    return ratio * rpx
}

/**
 * px 转 rpx
 * @param px 
 * @param screenWidthInPx 
 */
export const px2rpx = (px: number, screenWidthInPx: number) => {
    let ratio = screenWidthInPx / 750
    return px / ratio
}

/**
 * promisify showModal
 */
export const showModal = (opts: wxTypes.ShowModalOpts): Promise<wxTypes.ShowModalRes> =>
    promisify<wxTypes.ShowModalRes>(opts, wx.showModal)

/**
 * 弹出提示框
 */
export const alert = (
    content: string,
    title?: string
) => {
    return showModal({
        content,
        title: title || '提示',
        showCancel: false
    })
}

/**
 * 弹出确认对话框
 */
export const confirm = (
    content: string,
    title?: string
) => {
    return showModal({
        content,
        title: title || '提示',
        showCancel: true
    })
}

/**
* 发起网络请求
* @param options 
*/
export const request = (options: wxTypes.RequestOpts): Promise<wxTypes.RequestRes> => 
   promisify<wxTypes.RequestRes>(options, wx.request)


/**
* 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
* @param options 
*/
export const uploadFile = (options: wxTypes.UploadFileOpts): wxTypes.UploadFileResPromisified => {
   let uploadTask: wxTypes.UploadTask
   let promise: any = new Promise((resolve, reject) => {
       options.success = resolve
       options.fail = reject
       promise.uploadTask = wx.uploadFile(options)
   })
   return promise
}

export const chooseImage = (opts: wxTypes.ChooseImageOpts): Promise<wxTypes.ChooseImageRes> => 
    promisify<wxTypes.ChooseImageRes>(opts, wx.chooseImage)

export const getLocation = (opts?: wxTypes.GetLocationOpts): Promise<wxTypes.GetLocationRes> =>
    promisify<wxTypes.GetLocationRes>(opts || {}, wx.getLocation)

export const getStorage = (opts: wxTypes.GetStorageOpts): Promise<wxTypes.GetStorageRes> =>
    promisify<wxTypes.GetStorageRes>(opts, wx.getStorage)

export const setStorage = (opts: wxTypes.SetStorageOpts): Promise<void> =>
    promisify<void>(opts, wx.setStorage)

export const login = (): Promise<wxTypes.LoginRes> =>
    promisify<wxTypes.LoginRes>({}, wx.login)

export const showToast = (opts: wxTypes.ShowToastOpts): Promise<void> =>
    promisify<void>(opts, wx.showtToast)

export const showLoading = (opts: wxTypes.ShowLoadingOpts): Promise<void> =>
    promisify<void>(opts, wx.showLoading)

export const getUserInfo = (opts: wxTypes.GetUserInfoOpts): Promise<wxTypes.GetUserInfoRes> =>
    promisify<wxTypes.GetUserInfoRes>(opts, wx.getUserInfo)

export const showActionSheet = (opts: wxTypes.ShowActionSheetOpts): Promise<wxTypes.ShowActionSheetRes> =>
    promisify<wxTypes.ShowActionSheetRes>(opts, wx.showActionSheet)