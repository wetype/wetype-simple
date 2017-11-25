import { wx } from '../wx/wx'
import { showModal } from '../wx/interaction'

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
 * 弹出提示框
 */
export const alert = async (
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
export const confirm = async (
    content: string,
    title?: string
) => {
    return showModal({
        content,
        title: title || '提示',
        showCancel: true
    })
}