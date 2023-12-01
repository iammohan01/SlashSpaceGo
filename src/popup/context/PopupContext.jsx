import {createContext, useEffect, useState} from "react";
import fetchAllShortcuts from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils.js";
import PropTypes from "prop-types";

const PopupContext = createContext({});
export default PopupContext;
export const isMacOs = navigator.userAgentData.platform === "macOS";
export const View = Object.freeze({
    GRID: "grid",
    LIST: "list"
})
export function ContextProvider({children}) {
    const [shortcuts,setShortcuts] = useState([])
    const [layout, setLayout] = useState(View.GRID)
    const [shortCutKey, setShortcutKey] = useState("")
    const [expanderKey,setExpanderKey] = useState("")
    const [expanderInput,setExpanderInput] = useState("")

    useEffect(() => {
       fetchAllShortcuts().then(shortcuts=>{
           setShortcuts(shortcuts)
       })
    }, []);

    return (<PopupContext.Provider
        value=
            {{
                shortCuts: {
                    value: shortcuts, setValue: setShortcuts
                },
                layout:{
                    value: layout , setLayout: setLayout
                },
                shortcutKeyInput: [shortCutKey, setShortcutKey],
                expanderKey:[expanderKey,setExpanderKey],
                expanderInput:[expanderInput,setExpanderInput]
            }}
    >
            {children}
    </PopupContext.Provider>)
}
ContextProvider.propTypes ={
    children : PropTypes.element.isRequired
}