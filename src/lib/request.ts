import { request } from './wxUtil'

export interface RequestFactoryOpts {
    url: string
    header: any
}
export const requestFactory = async (
    method: string,
    header: any,
    afterResponse: (data) => any,
    dataTransform: (data: any) => any,
    handleError: (err) => void,
    url: string,
    data: any
) => {
    try {
        let res = await request({
            url,
            data: dataTransform ? dataTransform(data) : data,
            method,
            header
        })
        if (res.statusCode !== 200) {
            throw Error(
                `url ${url} respnonsed error, status code: ${res.statusCode}`
            )
        }
        return afterResponse(res.data)
    } catch (e) {
        return handleError(e)
    }
}
