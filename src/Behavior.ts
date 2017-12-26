import { Properties } from './types/ComponentTypes'
import { isInNode } from './lib/util'
import { handleAppConstr } from './lib/handleAppConstr'
import { Behavior as nativeBehavior } from './lib/wx'

export abstract class Behavior {

    type = 'behavior'

    static decor(behaviorOptions?: BehaviorOptions) {
        return function(constr: any) {
            if (isInNode) {
                return
            }
            let lifeCycleMethodNames = ['attached']
            let { data, methods, lifeCycleMethods } = handleAppConstr(constr, lifeCycleMethodNames)

            constr.behavior = nativeBehavior({
                data,
                methods,
                ...lifeCycleMethods,
                ...behaviorOptions
            })

        }
    }

     /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
     */
    setData(arg: any): void {}

    /**
     * 异步setData
     */
    setDataAsync(arg: any): Promise<void> {
        return Promise.resolve()
    }

}

export interface Behavior {

    /**
     * 生命周期函数
     */
    attached?(): void

}

export interface BehaviorOptions {
    /**
     * 
     */
    behaviors?: Behavior[]

    properties?: Properties
}