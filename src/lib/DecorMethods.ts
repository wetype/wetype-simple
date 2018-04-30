import {
    PageOptions,
    ShareAppMessageOptions,
    ShareAppMessageRes,
    OnloadOptions,
    WatchObj,
    InputObj,
    PageDecors,
    InputObjOpts,
    Func,
    ControlOpts
} from '../types/PageTypes'

export class DecorMethods {
    protected static decors: PageDecors = {
        listenerMethodNames: [],
        watchObjs: [],
        inputObjs: [],
        wxEventNames: [],
        pureProps: [],
        controlMethods: []
    }

    static on(proto: Object, methodName: string) {
        DecorMethods.decors.listenerMethodNames.push(methodName)
    }

    static watch(func: (val: any, old?: any) => void) {
        return function(proto: Object, dataName: string) {
            DecorMethods.decors.watchObjs.push({
                dataName,
                func
            })
        }
    }

    static input(arg1?: Func | InputObjOpts, arg2?: InputObjOpts) {
        let handler = typeof arg1 === 'function' ? arg1 : void 0
        let opts = typeof arg1 === 'function' ? arg2 : arg1
        return function(proto: Object, propName: string) {
            DecorMethods.decors.inputObjs.push({
                propName,
                opts,
                handler
            })
        }
    }

    static event(pro: Object, methodName: string) {
        DecorMethods.decors.wxEventNames.push(methodName)
    }

    static pure(prop, name: string) {
        DecorMethods.decors.pureProps.push(name)
    }

    static control(
        method: 'debounce' | 'throttle' = 'debounce',
        options?: ControlOpts
    ) {
        return function(proto: Object, methodName: string) {
            DecorMethods.decors.controlMethods.push({
                methodName,
                method,
                options
            })
        }
    }

    static debounce(options?: ControlOpts) {
        return DecorMethods.control('debounce', options)
    }

    static throttle(options?: ControlOpts) {
        return DecorMethods.control('throttle', options)
    }
}
