import { global } from './global'
import { isInNode, handleConstructor } from './lib/util'

export declare const Page: Function

export interface PageOptions {
    config?: any
}


export function PageDecor(pageOptions?: PageOptions) {

    return function(pageConstructor: any) {
        if (isInNode) {
            pageConstructor.config = pageOptions && pageOptions.config
        } else {
            let lifeCycleMethodNames = ['onLoad', 'onShow', 'onUnload']
            let { methods, lifeCycleMethods, data } = handleConstructor(pageConstructor, lifeCycleMethodNames)
            Page({
                data,
                ...methods,
                ...lifeCycleMethods
            })
        }
    }

}