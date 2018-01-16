import * as _ from 'lodash-es'

export class Store {
    private state: any = {
        currentPath: '',
        requestData: {}
    }

    get getters() {
        return
    }

    mutate(obj: any) {
        _.extend(this.state, obj)
    }
}

export const store = new Store()
