import type {Component} from 'solid-js';
import {createSignal} from "solid-js";
import {SetupComponent, SetupSettings} from "./components/SetupComponent";

const App: Component = () => {
    const [setupSettings, setSetupSettings] = createSignal<SetupSettings>()

    return (
        <>
            <SetupComponent setSetupSettings={setSetupSettings}/>
        </>
    );
};

export default App;
