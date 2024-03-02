import {Shortcuts, UserTabData} from "../../../@types/shortcuts";

export default async function fetchAllShortcuts() {

    return new Promise<Shortcuts[]>((resolve) => {
        chrome.storage.local.get(["shortcuts"])
            .then(data => {
                if (data['shortcuts']) {
                    resolve(data['shortcuts'])
                } else {
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
    await updateShortcut(data, true)
}

export async function updateShortcut(data: Shortcuts, updateInvokeOnly = false) {
    const shortcuts = await fetchAllShortcuts();

    if (!updateInvokeOnly && shortcuts.some(shortcut => shortcut.key.toLowerCase() === data.key.toLowerCase())) {
        throw new Error("Key already exists");
    }

    const updatedShortcuts = shortcuts.map(shortcut => shortcut.id === data.id ? data : shortcut);

    await chrome.storage.local.set({"shortcuts": updatedShortcuts});

    return updatedShortcuts;
}

