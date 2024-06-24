import { LoginUser, User, Room } from "@/types"
import { ApiType, api } from "./apiCall"

export const testHello = () => {
    return api('hello', {method: ApiType.GET})
}

export const signUpApi = (user: User) => {
    return api('user/signup', {method: ApiType.POST, body: user})
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

export const updateRoomApi = (id:string, newUsers: string[]) => {
    return api('room/update', {method:ApiType.POST, body:{ id, newUsers}})
}

