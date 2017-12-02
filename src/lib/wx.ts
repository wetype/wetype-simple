import { Options, ObjectLiteral, ErrMsg } from './common'
import * as wxx from './types'

declare const App: Function
declare const Page: Function
declare const Component: Function
/**
 * behaviors 是用于组件间代码共享的特性，类似于一些编程语言中的mixins或traits
 */
declare const Behavior: Function

/**
 * 获取到小程序实例
 * 通过 getApp() 获取实例之后，不要私自调用生命周期函数。
 */
declare function getApp(): any

/**
 * 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面
 */
declare function getCurrentPages(): any[]

/**
 * #网络
 */
declare namespace wx {
    /**
     * 发起网络请求
     */
    
    export function request(options: wxx.RequestOpts): void
    
    
    export function uploadFile(options: wxx.UploadFileOpts): wxx.UploadTask
    
    /**
     * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
     */
    export function downloadFile(options: wxx.DownloadFileOpts): void
}

/**
 * # 媒体
 */
declare namespace wx {

  
    /**
     * 从本地相册选择图片或使用相机拍照。
    */
    export function chooseImage(opts: wxx.ChooseImageOpts): wxx.ChooseImageRes

    export function previewImage(opts: wxx.PreviewImageOpts): void

    export function getImageInfo(opts: wxx.GetImageInfoOpts): wxx.GetImageInfoRes

    /**
     * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
     * 基础库 1.2.0 开始支持，低版本需做兼容处理
     */
    export function saveImageToPhotosAlbumave(opts: wxx.SaveImageToPhotosAlbumOpts): wxx.SaveImageToPhotosAlbumRes

    /**
     * 注意：1.6.0 版本开始，本接口不再维护。
     * 建议使用能力更强的 wx.getRecorderManager 接口开始录音。当主动调用wx.stopRecord，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
     * 需要用户授权 scope.record
     */
    export function startRecord(options: Options<wxx.StartRecordRes>): void

    /**
     * ​主动调用停止录音
     */
    export function stopRecord(options: Options<void>): void


    export function getRecorderManager(): wxx.RecorderManager


    /**
     *  视频
     */

    
    /**
     * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
     */
    export function chooseVideo(opts: wxx.ChooseVideoOpts): void
    
}

/**
 * # 文件
 */
declare namespace wx {

}

/**
 * # 数据缓存
 */
declare namespace wx {

    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
     */
    export function setStorage(opts: wxx.SetStorageOpts): void

    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
     */
    export function setStorageSync(key: string, data: ObjectLiteral | string): void

    /**
     * 从本地缓存中异步获取指定 key 对应的内容。
     */
    export function getStorage(opts: wxx.GetStorageOpts): void

    /**
     * 从本地缓存中同步获取指定 key 对应的内容。
     */
    export function getStorageSync(key: string): any

    /**
     * 异步获取当前storage的相关信息
     */
    export function getStorageInfo(opts: Options<wxx.GetStorageInfoRes>)

    /**
     * 同步获取当前storage的相关信息
     */
    export function getStorageInfoSync(): wxx.GetStorageInfoRes

    /**
     * 从本地缓存中异步移除指定 key 。
     */
    export function removeStorage(opts: wxx.RemoveStorageOpts): void
    
    /**
     * 从本地缓存中同步移除指定 key 。
     */
    export function removeStorageSync(key: string): void

    /**
     * 清理本地数据缓存
     */
    export function clearStorage(): void

    /**
     * 同步清理本地数据缓存
     */
    export function clearStorageSync(): void
}

/**
 * # 位置
 */
declare namespace wx {

    /**
     * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用。
     */
    export function getLocation(opts: wxx.GetLocationOpts): void

    
    
    /**
     * 打开地图选择位置。
     * 需要用户授权 scope.userLocation
     */
    export function chooseLocation(opts: Options<wxx.ChooseLocationRes>): void

    /**
     * 使用微信内置地图查看位置。
     * 需要用户授权 scope.userLocation
     */
    export function openLocation(opts: wxx.OpenLocationOpts): void

    /**
     * 创建并返回 map 上下文 mapContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <map/> 组件
     * @param mapId map组件的id
     * @param context 组件实例this
     */
    export function createMapContext(mapId: string, context?: any): wxx.MapContext
}

/**
 * 系统信息
 */
declare namespace wx {
    /**
     * 获取系统信息
     */
    export function getSystemInfo(opts: Options<wxx.GetSystemInfoRes>): void

    /**
     * 获取系统信息同步接口
     */
    export function getSystemInfoSync(): wxx.GetSystemInfoRes

    /**
     * 判断小程序的API，回调，参数，组件等是否在当前版本可用
     * String参数说明： 使用${API}.${method}.${param}.${options}或者${component}.${attribute}.${option}方式来调用，
     * 例如：
     * ${API} 代表 API 名字
     * ${method} 代表调用方式，有效值为return, success, object, callback
     * ${param} 代表参数或者返回值
     * ${options} 代表参数的可选值
     * ${component} 代表组件名字
     * ${attribute} 代表组件属性
     * ${option} 代表组件属性的可选值
     */
    export function canIUse(opts: string): boolean
}

/**
 * 网络状态
 */
declare namespace wx {

    /**
     * 获取网络类型
     */
    export function getNetworkType(opts: Options<wxx.GetNetworkTypeRes>): void

    /**
     * 监听网络状态变化
     */
    export function onNetworkStatusChange(cb: (isConnected: boolean, networkType: wxx.NetworkType) => void): void
}

/**
 * 系统功能
 */
declare namespace wx {
    /**
     * 设置屏幕亮度。
     */
    export function setScreenBrightness(opts: wxx.SetScreenBrightnessOpts): void

    /**
     * 获取屏幕亮度
     */
    export function getScreenBrightness(opts: Options<wxx.GetScreenBrightnessRes>): void

    /**
     * 使手机发生较长时间的振动（400ms）
     */
    export function vibrateLong(opts: Options<void>): void

    /**
     * 使手机发生较短时间的振动（15ms）
     * 仅在 iPhone7/iPhone7Plus 及 Android 机型生效
     */
    export function vibrateShort(opts: Options<void>): void

    /**
     * 拨打电话
     */
    export function makePhoneCall(opts: wxx.MakePhoneCallOpts): void

    /**
     * 调起客户端扫码界面，扫码成功后返回对应的结果
     */
    export function scanCode(opts: wxx.ScanCodeOpts): void

    /**
     * 设置系统剪贴板的内容
     */
    export function setClipboardData(opts: wxx.SetClipboardDataOpts): void

    /**
     * 获取系统剪贴板内容
     */
    export function getClipboardData(opts: Options<wxx.SetClipboardDataRes>): void

    /**
     * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
     */
    export function onUserCaptureScreen(cb: () => void): void

    /**
     * 调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式，写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加。
     */
    export  function addPhoneContact(opts: wxx.AddPhoneContactOpts): void
}

/**
 * 下拉刷新
 */
declare namespace wx {

    /**
     * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
     */
    export function startPullDownRefresh(opts: Options<wxx.StartPullDownRefreshRes>): void

    /**
     * 停止当前页面下拉刷新
     */
    export function stopPullDownRefresh(): void
}

/**
 * 交互反馈
 */
declare namespace wx {

    /**
     * 显示模态弹窗
     * @param opts 
     */
    export function showModal(opts: wxx.ShowModalOpts): void

    /**
     * ​显示操作菜单
     */
    export function showActionSheet(opts: wxx.ShowActionSheetOpts): void
}

/**
 * navbar
 */
declare namespace wx {

    /**
     * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容。注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
     */
     export function setNavigationBarTitle(opts: wxx.SetNavigationBarTitleOpts): void

     /**
      * 在当前页面显示导航条加载动画
      */
    export function showNavigationBarLoading(): void

    /**
     * 隐藏导航条加载动画
     */
    export function hideNavigationBarLoading(): void

    /**
     * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容。注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
     */
    export function setTopBarText(opts: wxx.SetTopBarTextOpts): void
 }

/**
 * 页面导航
 */
declare namespace wx {

    /**
     * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面
     */
    export function navigateTo(opts: wxx.NavigateToOpts): void

   
    /**
     * 关闭当前页面，跳转到应用内的某个页面。
     */
    export function redirectTo(opts: wxx.RedirectToOpts): void


    
    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     */
    export function switchTab(opts: wxx.SwitchTabOpts): void

    /**
     * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层
     * tip: wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面
     */
    export function navigateBack(opts: wxx.NavigateBackOpts): void
}

/**
 * 登录
 */
declare namespace wx {
    
    /**
     * 调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。
     * 注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
     */
    export function login(opts: Options<wxx.LoginRes>): void

    /**
     * 通过上述接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。开发者只需要调用wx.checkSession接口检测当前用户登录态是否有效。登录态过期后开发者可以再调用wx.login获取新的用户登录态。
     */
    export function checkSession(opts: Options<void>): void
}

/**
 * 用户相关
 */
declare namespace wx {

    /**
     * 获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口。
     * 需要用户授权 scope.userInfo
     */
    export function getUserInfo(opts: wxx.GetUserInfoOpts): void

    // export function getPhoneNumber(opts: ): void
}

/**
 * 微信支付
 */
declare namespace wx {

    /**
     * 发起微信支付
     */
    export function requestPayment(opts: wxx.RequestPaymentOpts): void
}

/**
 * 转发
 */

 declare namespace wx {

     /**
      * 显示当前页面的转发按钮
      */
    export function showShareMenu(opts: wxx.ShowShareMenuOpts): void

    /**
     * 隐藏转发按钮
     */
    export function hideShareMenu(opts: Options<void>): void

    /**
     * 更新转发属性
     */
    export function updateShareMenu(opts: wxx.ShowShareMenuOpts): void

    /**
     * 获取转发详细信息
     */
    export function getShareInfo(opts: wxx.GetShareInfoOpts): void
 }

 declare namespace wx {

    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果。
     * 注：设置界面只会出现小程序已经向用户请求过的权限。
     */
    export function openSetting(opts: Options<wxx.OpenSettingRes>): void

    /**
     * 获取用户的当前设置
     * 注：返回值中只会出现小程序已经向用户请求过的权限
     */
    export function getSetting(opts: Options<wxx.OpenSettingRes>): void
 }

 /**
  * 小程序跳转
  */
declare namespace wx {

    /**
     * 打开同一公众号下关联的另一个小程序。
     */
    export function navigateToMiniProgram(opts: wxx.NavigateToMiniProgramOpts): void

    /**
     * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
     */
    export function navigateBackMiniProgram(opts: wxx.NavigateBackMiniProgramOpts): void

}

/**
 * 生物认证
 */
declare namespace wx {

    export function checkIsSupportSoterAuthentication(opts: Options<wxx.CheckIsSupportSoterAuthenticationRes>): void
}

/**
 * 调试
 */
declare namespace wx {

    /**
     * 设置是否打开调试开关，此开关对正式版也能生效。
     */
    export function setEnableDebug(opts: wxx.SetEnableDebugOpts): void

}

export {
    wx,
    App,
    Page,
    Component,
    Behavior
}