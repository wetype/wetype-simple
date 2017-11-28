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
    
                if (comOptions) {
                    delete comOptions.config
                }

                nativeComponent({
                    data,
                    methods,
                    ...lifeCycleMethods,
                    ...comOptions
                })
    
            }
        }
    }

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
     */
    setData(arg: any): void {
        
    }

    /**
     * 异步setData
     */
    setDataAsync(arg: any): Promise<void> {
        return Promise.resolve()
    }
    
}

export interface Component {

    // 生命周期函数
    attached?(): void
    moved?(): void
    detached?(): void

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
    config?: ComponentConfig
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

export interface ComponentConfig {

}