import {Shortcuts, UserTabData} from "../../../@types/shortcuts";

export default async function fetchAllShortcuts() {

    return new Promise<Shortcuts[]>((resolve) => {
        chrome.storage.local.get(["shortcuts"])
            .then(data => {
                if (data['shortcuts']) {
                    console.log("no of shortcuts : ", data["shortcuts"].length)
                    resolve(data['shortcuts'])
                } else {
                    console.log("fetched data :", data)
                    console.error("Some thing went wrong while getting shortcuts from chrome.storage, but returning empty array")
                    resolve([])
                }
            })
    })
}

export function saveShortcut(userData: UserTabData): Promise<Shortcuts> {
    return new Promise((resolve, reject) => {
        fetchAllShortcuts().then((data = []) => {
            console.log(data)
            for (const shortcut of data) {
                if (shortcut.key === userData.key) {
                    const err = "Shortcut key already used"
                    console.error(err)
                    reject(err)
                    return
                }
            }
            chrome.storage.local.set({"shortcuts": [...data, userData]})
                .then(() => {
                    resolve(userData as unknown as Shortcuts)
                })
                .catch((err) => {
                    const errorMessage = "Some thing went wrong while adding shortcuts"
                    console.error(errorMessage, err)
                    reject(errorMessage)
                })

        })
    })

}

export function deleteShortcut(key: string) {
    console.log("delete", key)
    return new Promise((resolve, reject) => {
        fetchAllShortcuts().then((data = []) => {
            const updatedShortcuts = data.filter((shortcut) => shortcut.key !== key)
            if (data.length === updatedShortcuts.length) {
                const errorMessage = "Shortcut key not found"
                console.error(errorMessage, key)
                reject(errorMessage)
            } else {
                chrome.storage.local.set({"shortcuts": updatedShortcuts})
                    .then(() => {
                        resolve(key)
                    })
                    .catch(err => {
                        const errMessage = "something went wrong"
                        console.error("Error while removing shortcut from storage", err)
                        reject(errMessage)
                    })
            }
        })
    })
}

export async function updateInvoke(data: Shortcuts) {
    console.log("update invoke for ", data)
    await updateShortcut(data)
}

export async function updateShortcut(data: Shortcuts) {
    return new Promise<void>((resolve, reject) => {

    fetchAllShortcuts().then((shortcuts = []) => {
        if (shortcuts.filter(shortcut => shortcut.key.toLowerCase() === data.key.toLowerCase()).length > 0) {
            reject("Key already exists");
            return
        }
        const updatedShortcuts = shortcuts.map((shortcut) => shortcut.id === data.id ? data : shortcut)
        chrome.storage.local.set({"shortcuts": updatedShortcuts}).then(() => {
            resolve(updatedShortcuts);
        })
        console.log("updatedShortcuts", updatedShortcuts)
    })
})
}

