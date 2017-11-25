export class PageConstr {

    /**
     * 用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
     */
    setData(arg: any) {

    }

    /**
     * 异步setData
     */
    setDataAsync(arg: any): Promise<void> {
        return Promise.resolve()
    }

    /**
     * 
     */
    apply(): Promise<void> {
        return Promise.resolve()
    }

}