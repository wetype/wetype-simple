import { wx } from './wx'

export class Route {

    paths: string[] = []

    currentRoute: string = 'index'

    init() {

    }

    navigateTo() {
        wx.navigateTo()
    }

    navigateBack() {

    }

}

export const route = new Route