import { isInNode } from './lib/util'
import { handleConstructor } from './lib/handleConstructor'
import { Component as nativeComponent } from './lib/wx'

export abstract class Component {

    type = 'component'

    static decor(comOptions?: ComOptions) {
        return function(comConstructor: any) {
            if (isInNode) {
                if (comOptions) {
                    comConstructor.config = comOptions.config
                }
            } else {
                let lifeCycleMethodNames = ['attached', 'moved', 'detached', 'created', 'ready']
                let { data, methods, lifeCycleMethods } = handleConstructor(comConstructor, lifeCycleMethodNames)
                let properties
                let behaviors
                let options
                if (comOptions) {
                    properties = comOptions.properties
                    behaviors = comOptions.behaviors
                    options = comOptions.options
                }
    
                nativeComponent({
                    properties,
                    behaviors,
                    data,
                    methods,
                    ...lifeCycleMethods,
                    options
                })
    
            }
        }
    }
    
}

export type Properties = {
    [key: string]: {
        type?: StringConstructor | ArrayConstructor | ObjectConstructor | NumberConstructor
        value: any
    }
}

export type Methods = {
    [key: string]: any
}

export interface ComOptions {
    config?: any
    properties?: Properties
    behaviors?: any[]
    options?: any
}

export interface ComObj {
    properties?: Properties
    data?: any
    behaviors?: any[]
    methods?: Methods

    // 生命周期函数
    attached?: () => void
    moved?: () => void
    detached?: () => void
}