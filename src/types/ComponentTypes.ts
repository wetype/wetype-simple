export type Properties = {
    [key: string]: {
        type:
            | StringConstructor
            | ArrayConstructor
            | ObjectConstructor
            | NumberConstructor
            | BooleanConstructor
        value?: any
        observer?: (newVal: any, oldVal: any) => void
    }
}

export type Methods = {
    [key: string]: any
}

export interface ComOptions {
    config?: ComponentConfig
    properties?: Properties
    behaviors?: any[]
    options?: {
        multipleSlots?: boolean
    }
    relations?: {
        [key: string]: {
            type: 'parent' | 'child' | 'ancestor' | 'descendant'
            linked?: () => void
            linkChanged?: () => void
            unlinked?: () => void
            target?: string
        }
    }
    externalClasses?: string[]
}

// export interface ComObj {
//     properties?: Properties
//     data?: any
//     behaviors?: any[]
//     methods?: Methods

//     // 生命周期函数
//     attached?: () => void
//     moved?: () => void
//     detached?: () => void
// }

export interface ComponentConfig {
    component?: boolean
    usingComponents?: any
}
