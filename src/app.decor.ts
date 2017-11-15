/**
 * 
 */
import { global } from './global'
import { isInNode, handleConstructor } from './lib/util'

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
            
            App({
                ...methods,
                ...lifeCycleMethods
            })
        }


    }

}

export function config() {



}