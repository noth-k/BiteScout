import ky from 'ky'

export type ApiCall = {
    body?: any,
    method?: ApiType
}

export enum ApiType {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete'
}

export const api = async (url: string, apiCall?: ApiCall) => {
    const json = await ky(`http://localhost:4000/api/user/${url}`, {
        method: apiCall?.method || 'get',
        json: apiCall?.body
    })
    .json()
    .catch(async (err) => {
        const error = await err.response.json()
        err.response.json = error
        return err
    })
    return json
}