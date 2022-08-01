import {SelectedChannel} from "./ChatSelection";
import {createSignal} from "solid-js";

export interface IChannelListProps {
    selected: SelectedChannel[]
}

export function ChannelList(props: IChannelListProps) {
    const [hasCopied, setHasCopied] = createSignal(false)
    const selectedNamesText = () => props.selected.map(selected => selected.name).join('\n')

    const copyClick = async () => {
        await navigator.clipboard.writeText(selectedNamesText())
        setHasCopied(true)
    }

    return (
        <>
            <div class="flex flex-col h-full gap-2">
                <textarea value={selectedNamesText()} class="w-full flex-grow input input-bordered"/>
                <button class="btn" onClick={copyClick} classList={{
                    'btn-primary': !hasCopied(),
                    'btn-success': hasCopied()
                }}>Copy</button>
            </div>
        </>
    )
}
