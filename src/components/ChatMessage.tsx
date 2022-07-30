import {LiveChat} from "../youtubeApi";
import {mergeProps, Show} from "solid-js";

export interface IChatMessageProps {
    message: LiveChat
    disabled: boolean
    checked?: boolean
    setChecked: (selected: boolean) => void
}

export function ChatMessage(props: IChatMessageProps) {
    const mergedProps = mergeProps({checked: false}, props)

    const toggle = () => {
        mergedProps.setChecked(!mergedProps.checked)
    }

    return (
        <>
            <button class="w-full btn justify-start h-auto normal-case" classList={{'btn-disabled': props.disabled}} onClick={toggle}>
                <div class="flex flex-row items-center gap-x-2 min-w-0">
                    <Show when={!props.disabled}>
                        <input type="checkbox" class="checkbox" checked={mergedProps.checked}/>
                    </Show>
                    <div class="overflow-clip rounded-full min-w-max min-h-max">
                        <img src={props.message.authorDetails.profileImageUrl} class="h-6 w-6" alt="profile picture"/>
                    </div>
                    <div class="text-neutral-content">
                        {props.message.authorDetails.displayName}
                    </div>
                    <div class="my-3 break-words min-w-0 text-primary-content">
                        {props.message.snippet.displayMessage}
                    </div>
                </div>
            </button>
        </>
    )
}
