import {createContext, useState} from "react";

const Context = createContext({});
export default Context;

// eslint-disable-next-line react/prop-types
export function ContextProvider({children}) {
    let [setting, changeSetting] = useState(1)
    return (<Context.Provider
        value=
            {{
                settingsMenu: {
                    value: setting, setValue: changeSetting
                }
            }}
    >
            {children}
    </Context.Provider>)
}
