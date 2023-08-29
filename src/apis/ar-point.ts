import request from "./request"

export type ArPointInfo = {
    title: string,
    description: string,
    type: number,
    sequenceNum: number,
    modelScale: number,
    modelUrl: string,
    identityImgUrl: Array<string>,
    luckyImgUrl: string,
    scanThumbnailUrl: string,
    extConf: object
}

export const fetchArPointList = () => {
    return request.post<ArPointInfo[]>('/api/b/ar-point/search', {})
}

export const createArPoint = (data: any) => {
    return request.post<any>('/api/b/ar-point/create', data)
}

export const updateArPoint = (data: any) => {
    return request.post<any>('/api/b/ar-point/update', data)
}

