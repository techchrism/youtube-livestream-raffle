import {createEffect, createResource, createSignal, Setter, Show} from "solid-js";
import {youtubeAPIKey} from "../apiConstants";

// From https://stackoverflow.com/a/27728417
const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/

export interface ChannelInfo {
    channelId: string
    channelTitle: string
}

// Subset of full response data
interface YouTubeVideoSnippetResponse {
    items: {
        id: string
        snippet: ChannelInfo
    }[]
}

export interface IAccountSelectionProps {
    setChannelInfo: Setter<ChannelInfo>
}

async function asyncTimeout(delay: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, delay)
    })
}

export function AccountSelection(props: IAccountSelectionProps) {
    const [videoURL, setVideoURL] = createSignal<string>()
    const [apiResponseData] = createResource<ChannelInfo, string>(videoURL, async (url) => {
        const idResult = url.trim().match(youtubeRegex)
        if(idResult === null) {
            throw new Error('Invalid YouTube video url')
        }

        const apiURL = new URL('https://www.googleapis.com/youtube/v3/videos')
        apiURL.search = new URLSearchParams({
            part: 'snippet',
            id: idResult[1],
            key: youtubeAPIKey
        }).toString()
        const response = (await (await fetch(apiURL)).json()) as YouTubeVideoSnippetResponse

        if(response.items.length === 0) {
            throw new Error('Could not find video')
        }
        return response.items[0].snippet
    })
    let urlInput: HTMLInputElement

    createEffect(() => {
        if(apiResponseData.latest) {
            props.setChannelInfo(apiResponseData.latest)
        }
    })

    return (
        <>
            <div class="text-center">
                <label for="video-selection-url" class="label-text">Video URL</label>
                <br/>
                <input type="url" id="video-selection-url" placeholder="Video URL" class="input" ref={urlInput}/>
                <button class="btn" classList={{loading: apiResponseData.loading}} onClick={() => setVideoURL(urlInput.value)}>Check</button>
                <Show when={apiResponseData.error}>
                    <div class="alert alert-error shadow-lg">
                        {apiResponseData.error.toString()}
                    </div>
                </Show>
            </div>

        </>
    )
}
