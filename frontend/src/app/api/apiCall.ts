import ky from 'ky';

export type ApiCall = {
    body?: any,
    method?: ApiType
}

export enum ApiType {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete',
}

// Create a custom ky instance
const customKy = ky.create({
    hooks: {
        beforeRequest: [
            (request) => {
                // Clone the request to set the signal
                if (!request.signal) {
                    const controller = new AbortController();
                    const clonedRequest = new Request(request, { signal: controller.signal });
                    Object.assign(request, clonedRequest);
                }
            },
        ],
    },
});

export const api = async <T>(url: string, apiCall?: ApiCall): Promise<T> => {
    try {
        const json = await customKy(`http://54.252.240.132:4000/api/${url}`, {
            method: apiCall?.method || ApiType.GET,
            json: apiCall?.body
        }).json<T>();
        return json;
    } catch (err: any) {
        if (err.name === 'TypeError' && err.message.includes('signal.throwIfAborted')) {
            // Ignore this specific error
            console.warn('Ignoring signal.throwIfAborted error:', err);
            return {} as T; // Return an empty object or handle as needed
        }
        console.error(err);
        if (err.response) {
            const error = await err.response.json();
            console.error(error);
            throw new Error(error);
        }
        throw err;
    }
}
