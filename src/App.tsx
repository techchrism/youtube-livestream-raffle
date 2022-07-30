import type {Component} from 'solid-js';
import {createSignal, Show} from "solid-js";
import {LiveInfo, LiveSelection} from "./components/LiveSelection";

const App: Component = () => {
    const [liveInfo, setLiveInfo] = createSignal<LiveInfo>()

    return (
        <>
            <LiveSelection setLiveInfo={setLiveInfo}/>
            <Show when={liveInfo()}>
                <p>
                    {liveInfo().title}
                </p>
            </Show>
        </>
    );
};

export default App;
