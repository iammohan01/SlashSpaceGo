import {createContext, useEffect, useState} from "react";
import getIndexDbConnection from "../../db_operations/DbOperations.js";

const PopupContext = createContext({});
export default PopupContext;

// eslint-disable-next-line react/prop-types
export function ContextProvider({children}) {
    const [shortcuts,setShortcuts] = useState([])
    useEffect(() => {
        getIndexDbConnection().then(db=>{
            console.log(db)
            const store = db.transaction("shortcuts","readwrite")
            let shortCuts = store.objectStore("shortcuts")
            shortCuts.getAll().then(async fetchedData => {
                console.log(fetchedData)
                setShortcuts(fetchedData)
                await store.done;
            })
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
