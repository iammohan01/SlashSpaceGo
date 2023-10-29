import {createContext, useEffect, useState} from "react";
import fetchAllShortcuts from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils.js";

const PopupContext = createContext({});
export default PopupContext;
export const isMacOs = navigator.userAgentData.platform === "macOS";
export const View = Object.freeze({
    GRID: "grid",
    LIST: "list"
})
export function ContextProvider({children}) {
    const [shortcuts,setShortcuts] = useState([])
    let [layout, setLayout] = useState(View.GRID)

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
                }
            }}
    >
            {children}
    </PopupContext.Provider>)
}
