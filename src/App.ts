import { global } from './global'
import { handleAppConstr } from './lib/handleAppConstr'
import { App as nativeApp } from './lib/wx'
import { AppOptions } from './types/AppTypes'

export abstract class App {
    type = 'app'

    static decor(appOptions: AppOptions) {
        return function(appConstructor: any) {
            let lifeCycleMethodNames = ['onLaunch', 'onShow']
            let { methods, lifeCycleMethods } = handleAppConstr(
                appConstructor,
                lifeCycleMethodNames
            )

            nativeApp({
                ...methods,
                ...lifeCycleMethods
            })
        }
    }
}
