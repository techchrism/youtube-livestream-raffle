
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
            activeLiveChatId: string
        }
    }[]
}

// Base64 the key to prevent bots? Idk.
// This key will have domain restrictions
// I'm honestly still not sure if it's even safe to include in source files, but I really don't want to make a proxy
const youtubeAPIKey = atob('QUl6YVN5RGZKWnNWV0g5SV9fMURjQndUZ0x3Z3lXTjJRTVlscUxN')

export async function videoList(id: string): Promise<VideoSnippetResponse> {
    const apiURL = new URL('https://www.googleapis.com/youtube/v3/videos')
    apiURL.search = new URLSearchParams({
        part: 'snippet, liveStreamingDetails',
        id,
        key: youtubeAPIKey
    }).toString()
    return (await (await fetch(apiURL)).json()) as VideoSnippetResponse
}

type ChatType = 'chatEndedEvent' | 'messageDeletedEvent' |
    'sponsorOnlyModeEndedEvent' | 'sponsorOnlyModeStartedEvent' | 'newSponsorEvent' |
    'memberMilestoneChatEvent' | 'superChatEvent' | 'superStickerEvent' |
    'textMessageEvent' | 'tombstone' | 'userBannedEvent' |
    'membershipGiftingEvent' | 'giftMembershipReceivedEvent'

// Subset of livestream chat object
export interface LiveChat {
    snippet: {
        type: ChatType
        publishedAt: string
        displayMessage: string
    }
    authorDetails: {
        channelId: string
        channelUrl: string
        displayName: string
        profileImageUrl: string
        isChatOwner: boolean
    }
}

interface ChatMessagesResponse {
    pollingIntervalMillis: number
    nextPageToken: string
    items: LiveChat[]
}

export class LivestreamChatProvider {
    private readonly onChatBatch: (chats: LiveChat[]) => void
    private active = false
    private nextPollTimeout: number
    private readonly chatId: string

    constructor(chatId: string, onChatBatch: (chats: LiveChat[]) => void) {
        this.chatId = chatId
        this.onChatBatch = onChatBatch
    }

    start(single: boolean = false) {
        if(!this.active) {
            this.active = true
            this.poll(null, single)
        }
    }

    stop() {
        if(this.active) {
            this.active = false
            clearTimeout(this.nextPollTimeout)
        }
    }

    private async poll(token?: string, single: boolean = false) {
        const apiURL = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages')
        const params = {
            liveChatId: this.chatId,
            maxResults: '2000',
            part: 'id, snippet, authorDetails',
            key: youtubeAPIKey
        }
        if(token) {
            params['pageToken'] = token
        }
        apiURL.search = new URLSearchParams(params).toString()
        const data = (await (await fetch(apiURL)).json()) as ChatMessagesResponse

        if(this.active) {
            if(token) {
                this.onChatBatch(data.items)
            } else {
                this.onChatBatch(data.items.slice(-5))
            }

            if(!single) {
                this.nextPollTimeout = setTimeout(() => {
                    this.poll(data.nextPageToken)
                }, data.pollingIntervalMillis)
            }
        }
    }
}
