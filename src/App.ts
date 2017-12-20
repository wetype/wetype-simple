import { global } from './global'
import { isInNode } from './lib/util'
import { handleConstructor } from './lib/handleConstructor'
import { App as nativeApp }  from './lib/wx'
import { AppOptions } from './types/AppTypes'

export abstract class App {

    type = 'app'

    static decor(appOptions: AppOptions) {
        return function(appConstructor: any) {
            if (isInNode) {
                appConstructor.config = appOptions.config
            } else {
                let lifeCycleMethodNames = ['onLaunch', 'onShow']
                let { methods, lifeCycleMethods } = handleConstructor(appConstructor, lifeCycleMethodNames)
                
                nativeApp({
                    ...methods,
                    ...lifeCycleMethods
                })
            }
        }
    }
 
}

