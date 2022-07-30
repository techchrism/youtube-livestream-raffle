import type {Component} from 'solid-js';
import {createSignal, Match, Switch} from "solid-js";
import {SetupComponent, SetupSettings} from "./components/SetupComponent";

type AppStage = 'setup' | 'chat'

const App: Component = () => {
    const [setupSettings, setSetupSettings] = createSignal<SetupSettings>()
    const [stage, setStage] = createSignal<AppStage>('setup')

    const onStart = (settings: SetupSettings) => {
        setSetupSettings(settings)
        setStage('chat')
    }

    return (
        <>
            <Switch>
                <Match when={stage() === 'setup'}>
                    <SetupComponent onStart={onStart}/>
                </Match>
            </Switch>
        </>
    );
};

export default App;
