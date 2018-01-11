import { wx } from './wx'
import { store } from './store'

export class Route {

    paths: string[] = []

    currentRoute: string = 'index'

    init() {

    }

    async navigateTo(path, requestFunc: Promise<any>) {
        wx.navigateTo({ url: path })
        let res = await requestFunc
        store.mutate({ requestData: { path: res } })
    }

    navigateBack() {

    }

}

export const route = new Route