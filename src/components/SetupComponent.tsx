import {createMemo, createSignal, Setter, Show} from "solid-js";
import {LiveInfo, LiveSelection} from "./LiveSelection";

//TODO add settings like "auto-stop with channel message" and "auto mark as correct"
export interface SetupSettings {
    chatId: string
}

export interface ISetupComponentProps {
    setSetupSettings: Setter<SetupSettings>
}

export function SetupComponent(props: ISetupComponentProps) {
    const [liveInfo, setLiveInfo] = createSignal<LiveInfo>()
    const setupReady = createMemo(() => {
        return (!!liveInfo())
    })

    const onNextClick = () => {
        props.setSetupSettings({
            chatId: liveInfo().chatId
        })
    }

    return (
        <>
            <div class="flex flex-col items-center gap-4">
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
