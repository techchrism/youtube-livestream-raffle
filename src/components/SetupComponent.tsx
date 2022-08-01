import {createMemo, createSignal, Setter, Show} from "solid-js";
import {LiveInfo, LiveSelection} from "./LiveSelection";
import {SelectedChannel} from "./ChatSelection";
import {ChannelList} from "./ChannelList";

//TODO add settings like "auto-stop with channel message" and "auto mark as correct"
export interface SetupSettings {
    chatId: string
}

export interface ISetupComponentProps {
    onStart: (settings: SetupSettings) => void
    loadPrevious?: (previous: SelectedChannel[]) => void
}

export function SetupComponent(props: ISetupComponentProps) {
    const [liveInfo, setLiveInfo] = createSignal<LiveInfo>()
    const [previous, setPrevious] = createSignal<SelectedChannel[]>([])
    const setupReady = createMemo(() => {
        return (!!liveInfo())
    })

    const onNextClick = () => {
        props.onStart({
            chatId: liveInfo().chatId
        })
    }

    const prev = localStorage.getItem('previous')
    if(prev !== null) {
        setPrevious(JSON.parse(prev))
    }

    return (
        <>
            <div class="flex flex-col items-center gap-4 m-2">
                <div class="text-center max-w-md">
                    <h2>Instructions:</h2>
                    <ol class="list-decimal text-left my-2">
                        <li>Enter the URL for the livestream and hit "check" to verify</li>
                        <li>Click "start" to begin watching chat</li>
                        <li>Once you've decided enough messages have been received, click "stop"</li>
                        <li>Select the messages you want to be entered (don't worry about duplicates)</li>
                        <li>Click "next" and tap to start the raffle!</li>
                    </ol>
                    <p>If anything messes up with the raffle, you can refresh the page and load the previous selected or copy their usernames</p>
                </div>
                <div>
                    Source code: <a class="link" href="https://github.com/techchrism/youtube-livestream-raffle">https://github.com/techchrism/youtube-livestream-raffle</a>
                </div>
                <LiveSelection setLiveInfo={setLiveInfo}/>
                <div>
                    <span>Selected livestream: </span>
                    <Show when={liveInfo()} fallback={"none"}>
                        {liveInfo().title}
                    </Show>
                </div>
                <button class="btn btn-success" classList={{'btn-disabled': !setupReady()}} onClick={onNextClick}>
                    Start
                </button>

                <div>
                    <Show when={previous().length > 0}>
                        <Show when={props.loadPrevious !== undefined}>
                            <button class="btn btn-primary mx-2" onClick={() => props.loadPrevious(previous())}>Load Previous</button>
                        </Show>
                        <label for="list-modal" class="btn btn-primary modal-button mx-2">Show Previous</label>
                    </Show>
                </div>
            </div>

            <input type="checkbox" id="list-modal" class="modal-toggle"/>
            <div class="modal">
                <div class="modal-box h-full">
                    <label for="list-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <ChannelList selected={previous()}/>
                </div>
            </div>
        </>
    )
}
