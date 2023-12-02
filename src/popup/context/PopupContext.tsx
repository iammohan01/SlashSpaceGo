import React, {createContext, useEffect, useState} from "react";
import fetchAllShortcuts from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";
import {Shortcuts, View} from "../../@types/shortcuts";


export const isMacOs = true;//navigator.userAgentData.platform === "macOS";


interface PopupContextType {
    shortCuts: [Shortcuts[], React.Dispatch<React.SetStateAction<Shortcuts[]>> | null];
    layout: [View, React.Dispatch<React.SetStateAction<View>> | null];
    shortcutKeyInput: [string, React.Dispatch<React.SetStateAction<string>> | null];
    expanderKey: [string, React.Dispatch<React.SetStateAction<string>> | null];
    expanderInput: [string, React.Dispatch<React.SetStateAction<string>> | null];
}

const PopupContext = createContext<PopupContextType>({
    expanderInput: ["", null],
    expanderKey: ["", null],
    layout: [View.GRID, null],
    shortCuts: [[], null],
    shortcutKeyInput: ["", null]
});
type Props = { children: React.ReactElement }

export function ContextProvider({children}: Props) {
    const [shortcuts, setShortcuts] = useState<Shortcuts[]>([])
    const [layout, setLayout] = useState<View>(View.GRID)
    const [shortCutKey, setShortcutKey] = useState<string>("")
    const [expanderKey, setExpanderKey] = useState<string>("")
    const [expanderInput, setExpanderInput] = useState<string>("")

    useEffect(() => {
        fetchAllShortcuts().then(shortcuts => {
            setShortcuts(shortcuts)
        })
    }, []);

    return (<PopupContext.Provider
        value=
            {{
                shortCuts: [shortcuts, setShortcuts],
                layout: [layout, setLayout],
                shortcutKeyInput: [shortCutKey, setShortcutKey],
                expanderKey: [expanderKey, setExpanderKey],
                expanderInput: [expanderInput, setExpanderInput]
            }}
    >
        {children}
    </PopupContext.Provider>)
}

export default PopupContext;
