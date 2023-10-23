import {createContext, useEffect, useState} from "react";
import {getAllShortcuts} from "../../utils/utils.js";

const PopupContext = createContext({});
export default PopupContext;

// eslint-disable-next-line react/prop-types
export function ContextProvider({children}) {
    const [shortcuts,setShortcuts] = useState([])
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
                }
            }}
    >
            {children}
    </PopupContext.Provider>)
}
