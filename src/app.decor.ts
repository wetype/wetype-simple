/**
 * 
 */
import { global } from './global'
import { isInNode } from './lib/util'
import { handleConstructor } from './lib/handleConstructor'

export declare const App: Function

export interface AppOptions {
    config: any
}

export function AppDecor(appOptions: AppOptions) {

    return function(appConstructor: any) {

        if (isInNode) {
            appConstructor.config = appOptions.config
        } else {
            let lifeCycleMethodNames = ['onLaunch', 'onShow']
            let { methods, lifeCycleMethods } = handleConstructor(appConstructor, lifeCycleMethodNames)
            
            lifeCycleMethods

            App({
                ...methods,
                ...lifeCycleMethods
            })
        }


    }

}