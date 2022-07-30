
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

// Base64 the key to prevent bots? Idk.
// This key will have domain restrictions
// I'm honestly still not sure if it's even safe to include in source files, but I really don't want to make a proxy
const youtubeAPIKey = atob('QUl6YVN5RFBRdi16NDQ4WnRvSU1lWmFEblpFSU8zaFN5bnBPejhV')

export async function videoList(id: string): Promise<VideoSnippetResponse> {
    const apiURL = new URL('https://www.googleapis.com/youtube/v3/videos')
    apiURL.search = new URLSearchParams({
        part: 'snippet, liveStreamingDetails',
        id,
        key: youtubeAPIKey
    }).toString()
    return (await (await fetch(apiURL)).json()) as VideoSnippetResponse
}
