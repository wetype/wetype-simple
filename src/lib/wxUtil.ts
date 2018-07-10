import { wx } from './wx'
import { promisify } from '../lib/util'
import * as wxTypes from '../types/types'

let wxUtilConfig: any = {}

export const setWxUtilConfig = (type, params) => {
    wxUtilConfig[type] = params
}

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
export const showModal = (
    opts: wxTypes.ShowModalOpts
): Promise<wxTypes.ShowModalRes> =>
    promisify<wxTypes.ShowModalRes>(opts, wx.showModal)

/**
 * 弹出提示框
 */
export const alert = (
    content: string,
    title?: string,
    confirmColor?: string
) => {
    return showModal({
        content,
        title: title || wxUtilConfig.alert.title || '提示',
        showCancel: false,
        confirmColor: confirmColor || wxUtilConfig.alert.confirmColor
    })
}

/**
 * 弹出确认对话框
 */
export const confirm = (
    content: string,
    title?: string,
    confirmColor?: string,
    cancelColor?: string
) => {
    return showModal({
        content,
        title: title || '提示',
        showCancel: true,
        confirmColor: confirmColor || wxUtilConfig.confirm.confirmColor,
        cancelColor: cancelColor || wxUtilConfig.confirm.cancelColor
    })
}

/**
 * 发起网络请求
 * @param options
 */
export const request = (
    options: wxTypes.RequestOpts
): Promise<wxTypes.RequestRes> =>
    promisify<wxTypes.RequestRes>(options, wx.request)

/**
 * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
 * @param options
 */
export const uploadFile = (
    options: wxTypes.UploadFileOpts
): wxTypes.UploadFileResPromisified => {
    let uploadTask: wxTypes.UploadTask
    let promise: any = new Promise((resolve, reject) => {
        options.success = resolve
        options.fail = reject
        promise.uploadTask = wx.uploadFile(options)
    })
    return promise
}

export const chooseImage = (
    opts: wxTypes.ChooseImageOpts
): Promise<wxTypes.ChooseImageRes> =>
    promisify<wxTypes.ChooseImageRes>(opts, wx.chooseImage)

export const getLocation = (
    opts?: wxTypes.GetLocationOpts
): Promise<wxTypes.GetLocationRes> =>
    promisify<wxTypes.GetLocationRes>(opts || {}, wx.getLocation)

export const getStorage = (
    opts: wxTypes.GetStorageOpts
): Promise<wxTypes.GetStorageRes> =>
    promisify<wxTypes.GetStorageRes>(opts, wx.getStorage)

export const setStorage = (opts: wxTypes.SetStorageOpts): Promise<void> =>
    promisify<void>(opts, wx.setStorage)

export const clearStorage = (): Promise<void> =>
    promisify<void>({}, wx.clearStorage)

export const login = (): Promise<wxTypes.LoginRes> =>
    promisify<wxTypes.LoginRes>({}, wx.login)

export const showToast = (opts: wxTypes.ShowToastOpts): Promise<void> =>
    promisify<void>(opts, wx.showToast)

export const showLoading = (opts: wxTypes.ShowLoadingOpts): Promise<void> =>
    promisify<void>(opts, wx.showLoading)

export const getUserInfo = (
    opts?: wxTypes.GetUserInfoOpts
): Promise<wxTypes.GetUserInfoRes> =>
    promisify<wxTypes.GetUserInfoRes>(opts || {}, wx.getUserInfo)

export const showActionSheet = (
    opts: wxTypes.ShowActionSheetOpts
): Promise<wxTypes.ShowActionSheetRes> =>
    promisify<wxTypes.ShowActionSheetRes>(opts, wx.showActionSheet)

export const select = (
    selector: string
): Promise<wxTypes.Rect | wxTypes.Rect[]> => {
    return new Promise((resolve, reject) => {
        let query = wx.createSelectorQuery()
        query
            .select(selector)
            .boundingClientRect(rect => resolve(rect))
            .exec()
    })
}

export const chooseLocation = (): Promise<wxTypes.ChooseLocationRes> =>
    promisify<wxTypes.ChooseLocationRes>({}, wx.chooseLocation)

export const getNetworkType = (): Promise<wxTypes.GetNetworkTypeRes> =>
    promisify<wxTypes.GetNetworkTypeRes>({}, wx.getNetworkType)

export const getImageInfo = (opts: wxTypes.GetImageInfoOpts) =>
    promisify<wxTypes.GetImageInfoRes>(opts, wx.getImageInfo)

export const navigateBack = (opts: wxTypes.NavigateBackOpts) =>
    promisify<void>(opts, wx.navigateBack)

export const navigateTo = (opts: wxTypes.NavigateToOpts) =>
    promisify<void>(opts, wx.navigateTo)
