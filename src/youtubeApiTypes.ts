
export interface Thumbnail {
    url: string
    width: number
    height: number
}

export type ThumbnailSize = 'default' | 'medium' | 'high' | 'standard' | 'maxres'

// Subset of full response data
export interface VideoSnippetResponse {
    items: {
        id: string
        snippet: {
            title: string
            thumbnails: {
                [size in ThumbnailSize]: Thumbnail
            }
            liveBroadcastContent: 'live' | 'none' | 'upcoming'
        },
        liveStreamingDetails: {
            activeChatId: string
        }
    }[]
}
