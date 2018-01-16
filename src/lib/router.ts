import { wx } from './wx'
import { store } from './store'

export class Router {
    paths: string[] = []

    currentRoute: string = 'index'

    events: any = {}

    pages: string[] = []

    init() {}

    addPage(path: string) {
        this.pages.push(path)
    }

    addEvent(path: string, func: Function) {
        this.events[path] = func
    }

    async navigateTo(path, requestFunc: Promise<any>) {
        wx.navigateTo({ url: path })
        let res = await requestFunc
        store.mutate({ requestData: { path: res } })
    }

    navigateBack() {}
}

export const router = new Router()
