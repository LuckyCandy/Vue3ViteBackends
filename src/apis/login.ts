import request from "./request"

export type LoginResp = {
    token: string
}

export const loginRequest = (phone: string, password: string) => {
    return request.post<LoginResp>('/open/b/auth/login', {phone, password})
}

