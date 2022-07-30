import {SetupSettings} from "./SetupComponent";
import {LiveChat, LivestreamChatProvider} from "../youtubeApi";
import {createSignal, For, onCleanup, onMount} from "solid-js";

export interface IChatSelectionProps {
    settings: SetupSettings
}

export interface SelectedChannel {
    id: string
    name: string
}

export function ChatSelection(props: IChatSelectionProps) {
    const [selectedChannels, setSelectedChannels] = createSignal<SelectedChannel[]>([])
    const [chat, setChat] = createSignal<LiveChat[]>([])
    const chatProvider = new LivestreamChatProvider(props.settings.chatId, newChat => {
        setChat(existingChat => [...existingChat, ...newChat.filter(c => c.snippet.type === 'textMessageEvent')])
    })

    /*onMount(() => {
        chatProvider.start()
    })*/

    onCleanup(() => {
        chatProvider.stop()
    })

    return (
        <>
            <button class="btn btn-success" onClick={() => chatProvider.start(true)}>Start</button>
            <ul>
                <For each={chat()}>
                    {(message) => <>
                        <li>
                            {message.snippet.displayMessage}
                        </li>
                    </>}
                </For>
            </ul>
        </>
    )
}
