export interface Options<T> {
    success?(res: T): void
    fail?(): void
    complete?(): void
}

export interface ObjectLiteral {
    [key: string]: any
}

export interface ErrMsg<T> {
    /**
     * 调用结果
     */
    errMsg: T
}