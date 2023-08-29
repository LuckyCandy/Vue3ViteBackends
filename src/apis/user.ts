import request from "./request"

export type UserInfo = {
    name: string,
    phone: string,
    createTime: string,
    updateTime: string,
}

export const fetchUserList = (phone: string|null) => {
    return request.post<UserInfo[]>('/api/b/user/search', {phone: phone})
}

export const createUser = (name: string, phone: string, password: string) => {
    return request.post<any>('/api/b/user/create', {name, password, phone})
}

export const resetPassword = (id: number, password: string) => {
    return request.post<any>('/api/b/user/password/reset', {id, newPassword: password})
}

