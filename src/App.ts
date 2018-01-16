import { global } from './global'
import { isInNode } from './lib/util'
import { handleAppConstr } from './lib/handleAppConstr'
import { App as nativeApp } from './lib/wx'
import { AppOptions } from './types/AppTypes'

export abstract class App {
    type = 'app'

    static decor(appOptions: AppOptions) {
        return function(appConstructor: any) {
            if (isInNode) {
                appConstructor.config = appOptions.config
            } else {
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
}
