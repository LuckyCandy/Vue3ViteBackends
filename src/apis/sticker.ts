import request from "./request"

export type ArPointInfo = {
    name: string,
    sequenceNum: number,
    stickerImgUrl: string,
    stickerThumbnailUrl: string
}

export const fetchStickerList = () => {
    return request.post<ArPointInfo[]>('/api/b/sticker/search', {})
}

export const createSticker = (data: any) => {
    return request.post<any>('/api/b/sticker/create', data)
}

export const updateSticker = (data: any) => {
    return request.post<any>('/api/b/sticker/update', data)
}

export const removeSticker = (id: number) => {
    return request.get<any>('/api/b/sticker/delete?id='+id)
}

