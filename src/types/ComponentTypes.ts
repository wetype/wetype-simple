export type Properties = {
    [key: string]: {
        type?:
            | StringConstructor
            | ArrayConstructor
            | ObjectConstructor
            | NumberConstructor
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
}
