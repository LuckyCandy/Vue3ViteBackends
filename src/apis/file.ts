import request from "./request"

export type UploadTokenInfo = {
    key: string,
    keySm: string,
    domainName: string,
    upToken: string,
    smUrl: string,
    indexUrl: string
}

export const fileUploadToken = (bucket: number, fileName: string) => {
    return request.post<UploadTokenInfo>('/api/b/file/upload/token', {bucketType: bucket, fileName})
}

