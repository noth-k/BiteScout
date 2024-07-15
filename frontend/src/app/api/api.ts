import { LoginUser, User, Room } from "@/types"
import { ApiType, api } from "./apiCall"

export const testHello = () => {
    return api('hello', {method: ApiType.GET})
}

export const signUpApi = (user: User) => {
    return api('user/signup', {method: ApiType.POST, body: user})
}

export const checkEmailPasswordApi = (email:String, password: String) => {
    return api('user/check', {method: ApiType.POST, body: {email, password}})
}

export const loginApi = (user: LoginUser) => {
    return api('user/login', {method: ApiType.POST, body: user})
}

export const updateApi = (user: User) => {
    return api('user/update', {method: ApiType.POST, body: user})
}

export const searchUserApi = (email: String) => {
    return api('user/search', {method:ApiType.POST, body:{email}})
}

export const updateRoomsApi = (userId:string, roomId: string) => {
    return api('user/roomsUpdate', {method:ApiType.POST, body: { userId, roomId }})
}

export const fetchUserDataApi = (userId: string | undefined) => {
    return api('user/data', {method:ApiType.POST, body: { userId}})
}

export const fetchAllUsersApi = () => {
    return api('user/allData', {method:ApiType.POST});
}

export const createRoomApi = (room: Room) => {
    return api('room/create', {method:ApiType.POST, body: room})
}

export const fetchRoomApi = (roomId: string | string[] | undefined) => {
    return api('room/find', {method:ApiType.POST, body: {roomId}})
}

export const fetchRoomNames = () => {
    return api('room/names', {method:ApiType.POST})
}

export const updateRoomApi = (id:string, newUsers: string[], newRestrictions:string[]) => {
    return api('room/update', {method:ApiType.POST, body:{ id, newUsers, newRestrictions}})
}

export const removeUserApi = (roomId:string, userId: string) => {
    return api('room/removeUser', {method:ApiType.POST, body: {roomId, userId}});
}

export const removeRoomFromUserApi = (roomId:string, userId: string) => {
    return api('user/removeRoom', {method:ApiType.POST, body: {roomId, userId}});
}

export const updateSubmittedUsersApi = (roomId: string, userId: string, vibe:string, price:string) => {
    return api('room/submitUser', {method:ApiType.POST, body: {roomId, userId, vibe, price}});
}

export const resetSubmittedUsersApi = (roomId:string) => {
    return api('room/reset', {method:ApiType.POST, body: {roomId}});
}

export const deleteRoomApi = (roomId:string) => {
    return api('room/delete', {method:ApiType.POST, body: {roomId}});
}

export const vibesAndPriceApi = (roomId:string) => {
    return api('room/vibesAndPrice', {method:ApiType.POST, body: {roomId}});
}


export const roomRestrictionsApi = (roomId:string) => {
    return api('room/restrictions', {method:ApiType.POST, body: {roomId}});
}


//recommendation create. if recommendation created already, it generates the recommendation previously created
export const createRecommendationApi = (name: String, address: String) => {
    return api('recommendation/create', {method:ApiType.POST, body: {name, address}});
}

