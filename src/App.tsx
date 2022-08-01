import type {Component} from 'solid-js';
import {createSignal, Match, Switch} from "solid-js";
import {SetupComponent, SetupSettings} from "./components/SetupComponent";
import {ChatSelection, SelectedChannel} from "./components/ChatSelection";
import {Raffle} from "./components/Raffle";

type AppStage = 'setup' | 'chat' | 'raffle'

const App: Component = () => {
    const [setupSettings, setSetupSettings] = createSignal<SetupSettings>()
    const [selectedChannels, setSelectedChannels] = createSignal<SelectedChannel[]>([])
    const [stage, setStage] = createSignal<AppStage>('setup')

    const onStart = (settings: SetupSettings) => {
        setSetupSettings(settings)
        setStage('chat')
    }

    const onSelectFinish = (selected: SelectedChannel[]) => {
        setSelectedChannels(selected)
        setStage('raffle')
    }

    const loadPrevious = () => {
        setSelectedChannels(JSON.parse(localStorage.getItem('previous')))
        setStage('raffle')
    }

    return (
        <>
            <Switch>
                <Match when={stage() === 'setup'}>
                    <SetupComponent onStart={onStart} loadPrevious={loadPrevious}/>
                </Match>
                <Match when={stage() === 'chat'}>
                    <ChatSelection settings={setupSettings()} onNext={onSelectFinish}/>
                </Match>
                <Match when={stage() === 'raffle'}>
                    <Raffle initialSelected={selectedChannels()}/>
                </Match>
            </Switch>
        </>
    );
};

export default App;
