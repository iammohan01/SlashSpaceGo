import shortcuts from "./TableSchema.json"

export default async function fetchAllShortcuts() {
    return new Promise(async (resolve, reject) => {
        let data = await chrome.storage.local.get(["shortcuts"])
        if (data['shortcuts']) {
            console.log("no of shortcuts : " , data["shortcuts"].length)
            resolve(data['shortcuts'])
        } else {
            console.log("fetched data :", data)
            console.error("Some thing went wrong while getting shortcuts from chrome.storage, but returning empty array")
            resolve([])
        }
    })

}

export function saveShortcut(userData) {
    return new Promise((resolve, reject) => {
        fetchAllShortcuts().then((data = []) => {
            console.log(data)
            for (let shortcut of data) {
                if (shortcut.key === userData.key) {
                    const err = "Shortcut key already used"
                    console.error(err)
                    reject(err)
                    return
                }
            }
            chrome.storage.local.set({"shortcuts": [...data, userData]})
                .then(() => {
                    resolve(userData)
                })
                .catch((err) => {
                    let errorMessage = "Some thing went wrong while adding shortcuts"
                    console.error(errorMessage, err)
                    reject(errorMessage)
                })

        })
    })

}

export function deleteShortcut(key) {
    console.log("delete", key)
    return new Promise((resolve, reject) => {
        fetchAllShortcuts().then((data = []) => {
            let updatedShortcuts = data.filter((shortcut, index) => shortcut.key !== key)
            if (data.length === updatedShortcuts.length) {
                const errorMessage = "Shortcut key not found"
                console.error(errorMessage, key)
                reject(errorMessage)
            } else {
                chrome.storage.local.set({"shortcuts": updatedShortcuts})
                    .then(e => {
                        resolve(key)
                    })
                    .catch(err=>{
                        const errMessage = "something went wrong"
                        console.error("Error while removing shortcut from storage", err)
                        reject(errMessage)
                    })
            }
        })
    })
}

export function updateInvoke(data){
    console.log("update invoke for ", data)
    updateShortcut(data)
}
export function updateShortcut(data) {
    fetchAllShortcuts().then((shortcuts=[])=>{
        let updatedShortcuts  =shortcuts.map((shortcut,index)=>shortcut.key === data.key ? data :shortcut)
        chrome.storage.local.set({"shortcuts":updatedShortcuts})
        console.log("updatedShortcuts",updatedShortcuts)
    })
}