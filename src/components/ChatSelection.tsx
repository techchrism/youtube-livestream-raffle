import {SetupSettings} from "./SetupComponent";
import {LiveChat, LivestreamChatProvider} from "../youtubeApi";
import {Accessor, createMemo, createSignal, For, onCleanup, onMount} from "solid-js";
import {ChatMessage} from "./ChatMessage";

export interface IChatSelectionProps {
    settings: SetupSettings
}

export interface SelectedChannel {
    id: string
    name: string
    profilePicture: string
}

interface SelectableChat extends LiveChat {
    selected: boolean
}

export function ChatSelection(props: IChatSelectionProps) {
    const [stopped, setStopped] = createSignal(false)
    const [chat, setChat] = createSignal<SelectableChat[]>([])
    const chatProvider = new LivestreamChatProvider(props.settings.chatId, newChat => {
        setChat(existingChat => [
            ...existingChat,
            ...newChat.filter(c => c.snippet.type === 'textMessageEvent').map(c => ({...c, selected: false}))
        ])
    })
    const selectedChannels: Accessor<SelectedChannel[]> = createMemo(() => {
        return chat().filter(chat => chat.selected).map(chat => ({
            id: chat.authorDetails.channelId,
            name: chat.authorDetails.displayName,
            profilePicture: chat.authorDetails.profileImageUrl
        })).filter((channel, index, self) => self.findIndex(ch => ch.id === channel.id) === index)
    })

    /*onMount(() => {
        chatProvider.start()
    })*/

    onCleanup(() => {
        chatProvider.stop()
    })

    const setSelected = (message) => {
        setChat(existingChat => existingChat.map(chat => (chat === message ? {...chat, selected: !chat.selected} : chat)))
    }

    const onStopClick = () => {
        setStopped(stopped => !stopped)
    }

    return (
        <>
            <div class="fixed m-3 w-full">
                <div class="flex flex-row items-center justify-center gap-x-2">
                    <button class="btn btn-success" onClick={() => chatProvider.start(true)}>Single</button>
                    <button class="btn btn-error" onClick={onStopClick}>Stop</button>
                    <div class="badge badge-lg badge-info">{chat().length} Messages</div>
                    <div class="badge badge-lg badge-info">{selectedChannels().length} Selected Channels</div>
                </div>
            </div>
            <ul class="mx-2 pt-16">
                <For each={chat()}>
                    {(message) => <>
                        <li class="m-1">
                            <ChatMessage message={message}
                                         checked={message.selected}
                                         disabled={!stopped()}
                                         setChecked={(checked) => {setSelected(message)}}/>
                        </li>
                    </>}
                </For>
            </ul>
        </>
    )
}
