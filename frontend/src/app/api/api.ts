import { LoginUser, User } from "@/types"
import { ApiType, api } from "./apiCall"

export const testHello = () => {
    return api('hello', {method: ApiType.GET})
}

export const signUpApi = (user: User) => {
    return api('signup', {method: ApiType.POST, body: user})
}

export const loginApi = (user: LoginUser) => {
    return api('login', {method: ApiType.POST, body: user})
}