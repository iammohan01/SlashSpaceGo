import "./panel.css"
import context from "../context/context.jsx";
import {useContext} from "react";
import ShortcutsWrapper, {Groups} from "./shortcuts/ShortcutsWrapper.jsx";
export default function SettingsPanel() {

    const {settingsMenu} = useContext(context);
    return (
        <div className={"panel-wrapper"}>
            {settingsMenu.value === 1 && <ShortcutsWrapper/>}
            {settingsMenu.value === 2 && <Groups/>}
        </div>
    )
}
