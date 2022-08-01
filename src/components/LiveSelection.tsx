import {createSignal, Setter, Show} from "solid-js";
import {Thumbnail, videoList} from "../youtubeApi";

// From https://stackoverflow.com/a/27728417
const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/

export interface LiveInfo {
    title: string,
    thumbnail: Thumbnail,
    chatId: string
}

export interface ILiveSelectionProps {
    setLiveInfo: Setter<LiveInfo>
}

export function LiveSelection(props: ILiveSelectionProps) {
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal(null)
    let urlInput: HTMLInputElement

    const checkVideo = async () => {
        setError(null)
        setLoading(true)
        try {
            const url = urlInput.value
            const idResult = url.trim().match(youtubeRegex)
            if(idResult === null) {
                throw new Error('Invalid YouTube video url')
            }

            const response = await videoList(idResult[1])
            if(response.items.length === 0) {
                throw new Error('Could not find livestream')
            }
            const video = response.items[0]

            if(video.snippet.liveBroadcastContent !== 'live') {
                throw new Error('Video is not live')
            }

            props.setLiveInfo({
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.default,
                chatId: video.liveStreamingDetails.activeLiveChatId
            })
        } catch(e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div class="text-center">
                <label for="video-selection-url" class="label-text">Livestream URL</label><br/>
                <input type="url" id="video-selection-url" placeholder="Livestream URL" class="input" ref={urlInput}/>
                <button class="btn btn-primary mx-2" classList={{loading: loading()}} onClick={checkVideo}>
                    Check
                </button>
                <Show when={error()}>
                    <div class="alert alert-error shadow-lg mt-2">
                        {error().toString()}
                    </div>
                </Show>
            </div>
        </>
    )
}
