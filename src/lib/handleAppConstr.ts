import * as _ from 'lodash-es'

export abstract class AppContext {
    /**
     * # wetype
     * data
     */
    [key: string]: any
}

export const handleAppConstr = (
    Constr: any,
    lifeCycleMethodNames: string[],
    mixins?: any[]
) => {
    let ins = new Constr()
    let proto = Constr.prototype

    let methods: any = {}
    let lifeCycleMethods: any = {}
    let data: any = {}

    _.each(proto, (prop, k) => {
        if (_.isFunction(prop) && k !== 'constructor') {
            let isLifeCycleMethod = _.includes(lifeCycleMethodNames, k)
            let key = isLifeCycleMethod ? lifeCycleMethods : methods
            key[k] = function(this: AppContext, ...args) {
                prop.call(this, ...args)
            }
        }
    })

    _.each(ins, (v, k) => {
        if (!_.isFunction(v)) {
            data[k] = v
        }
    })

    return { methods, lifeCycleMethods, data }
}
