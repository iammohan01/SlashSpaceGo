import {createContext, useEffect, useState} from "react";
import {getAllShortcuts} from "../../utils/utils.js";

const PopupContext = createContext({});
export default PopupContext;
export const isMacOs = navigator.userAgentData.platform === "macOS";
export const View = Object.freeze({
    GRID: "grid",
    LIST: "list"
})
export function ContextProvider({children}) {
    const [shortcuts,setShortcuts] = useState([])
    let [layout, setLayout] = useState(View.LIST)

    useEffect(() => {
       getAllShortcuts().then(data=>{
           setShortcuts(data)
       }).catch(err=>{
           console.log(err)
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
