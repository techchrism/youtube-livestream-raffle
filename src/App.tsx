import type {Component} from 'solid-js';
import {AccountSelection, ChannelInfo} from "./components/AccountSelection";
import {createSignal, Show} from "solid-js";

const App: Component = () => {
    const [channelInfo, setChannelInfo] = createSignal<ChannelInfo>()

    return (
        <>
            <AccountSelection setChannelInfo={setChannelInfo}/>
            <Show when={channelInfo()}>
                <p>
                    Channel title: {channelInfo().channelTitle}
                    <br/>
                    Channel ID: {channelInfo().channelId}
                </p>
            </Show>
        </>
    );
};

export default App;
