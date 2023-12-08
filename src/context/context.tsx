import React, {createContext, useState} from "react";

interface ContextProvider {
    settingsMenu: [setting: number, chaneSetting: React.Dispatch<React.SetStateAction<number>>]
}

const Context = createContext<ContextProvider>({
    settingsMenu: [0, function () {
    }]
});
export default Context;

type Props = {
    children: React.ReactElement
}

export function ContextProvider({children}: Props) {
    const [setting, changeSetting] = useState<number>(1)
    return (<Context.Provider
        value=
            {{
                settingsMenu: [setting, changeSetting]
            }}
    >
        {children}
    </Context.Provider>)
}
