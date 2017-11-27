import { global } from './global'
import { isInNode } from './lib/util'
import { handleConstructor } from './lib/handleConstructor'
import { App as nativeApp }  from './lib/wx'

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

export abstract class App {

    static decor(appOptions: AppOptions) {
        return function(appConstructor: any) {
            if (isInNode) {
                appConstructor.config = appOptions.config
            } else {
                let lifeCycleMethodNames = ['onLaunch', 'onShow']
                let { methods, lifeCycleMethods } = handleConstructor(appConstructor, lifeCycleMethodNames)
                
                lifeCycleMethods
    
                nativeApp({
                    ...methods,
                    ...lifeCycleMethods
                })
            }
        }
    }
 
    type = 1

    abstract onLaunch(options: OnLaunchOptions): void
}

export interface App {

    onShow?(options: OnLaunchOptions): void
    
    onHide?(): void
    
    onError?(): void
}

export interface AppOptions {
    config: any
}

export interface AppConfig {

}
