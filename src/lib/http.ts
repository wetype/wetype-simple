import { RequestRes } from '../types/types'
import { request } from './wxUtil'

export interface Opt {
    headers?: any
}

export interface CreateInsOpt extends Opt {
    url?: string
    data?: any
    baseUrl?: string
    method?: string
    transformData?: Function
}

export class Http {
    baseUrl: string = ''
    method: string = 'GET'
    transformData: Function | undefined

    static get(url, params, opts?: Opt) {
        return request({
            url,
            method: 'GET',
            data: params
        })
    }

    static post(url, data, opts?: Opt) {
        return request({
            url,
            method: 'POST',
            data
        })
    }

    create(opts) {
        return new Http()
    }

    get(url, params, opts?: Opt) {
        let reqObj = {
            url: this.baseUrl + url,
            method: this.method,
            data: params
        }
        return request(reqObj)
    }

    post(url, params, opts?: Opt) {
        let reqObj = {
            url: this.baseUrl + url,
            method: this.method,
            data: this.transformData ? this.transformData(params) : params
        }
        return request(reqObj)
    }
}
