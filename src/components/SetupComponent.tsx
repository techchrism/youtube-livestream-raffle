import {createMemo, createSignal, Setter, Show} from "solid-js";
import {LiveInfo, LiveSelection} from "./LiveSelection";

//TODO add settings like "auto-stop with channel message" and "auto mark as correct"
export interface SetupSettings {
    chatId: string
}

export interface ISetupComponentProps {
    onStart: (settings: SetupSettings) => void
}

export function SetupComponent(props: ISetupComponentProps) {
    const [liveInfo, setLiveInfo] = createSignal<LiveInfo>()
    const setupReady = createMemo(() => {
        return (!!liveInfo())
    })

    const onNextClick = () => {
        props.onStart({
            chatId: liveInfo().chatId
        })
    }

    return (
        <>
            <div class="flex flex-col items-center gap-4 m-2">
                <div class="text-center">
                    <h2>Instructions:</h2>
                    <ol class="list-decimal text-left">
                        <li>Enter the URL for the livestream and hit "check" to verify</li>
                        <li>Click "start" to begin watching chat</li>
                        <li>Once you've decided enough messages have been received, click "stop"</li>
                        <li>Select the messages you want to be entered (don't worry about duplicates)</li>
                        <li>Click "next" and tap to start the raffle!</li>
                    </ol>
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
            </div>

        </>
    )
}
