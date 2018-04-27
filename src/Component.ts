import { handleAppConstr } from './lib/handleAppConstr'
import { Component as nativeComponent } from './lib/wx'
import { Behavior } from './Behavior'
import { ComOptions } from './types/ComponentTypes'

export abstract class Component {
    type = 'component'

    data: any

    static decor(comOptions?: ComOptions) {
        return function(comConstructor: any) {
            let lifeCycleMethodNames = [
                'attached',
                'moved',
                'detached',
                'created',
                'ready'
            ]
            let { data, methods, lifeCycleMethods } = handleAppConstr(
                comConstructor,
                lifeCycleMethodNames
            )

            if (comOptions) {
                // 去掉config
                delete comOptions.config
                // 处理behaviors
                let { behaviors } = comOptions
                if (behaviors) {
                    comOptions.behaviors = behaviors.map(el => el.behavior)
                }
            }

            nativeComponent({
                data,
                methods,
                ...lifeCycleMethods,
                ...comOptions
            })
        }
    }

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
     */
    $setData(arg: any): void {}

    /**
     * 异步setData
     */
    $setDataAsync(arg: any): Promise<void> {
        return Promise.resolve()
    }
}

export interface TriggerEventOpts {
    /**
     * 事件是否冒泡
     */
    bubbles: boolean

    /**
     * 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
     */
    composed: boolean

    /**
     * 事件是否拥有捕获阶段
     */
    capturePhase: boolean
}

export interface Component {
    // 生命周期函数
    attached?(): void
    moved?(): void
    detached?(): void

    // 触发事件
    triggerEvent(eventName: string, arg?: any, opts?: TriggerEventOpts): void
}
