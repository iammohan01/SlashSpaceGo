import {generateRandomString} from "../../../utils/utils.js";

export function saveExpander(key, value) {
    let newData = {
        key,
        value,
        createdTime: Date.now(),
        id: generateRandomString(15),
        invoke: 0,
        modifiedTime: Date.now(),
    }
    console.log(newData)
    return new Promise((resolve, reject) => {
        fetchAllExpanders().then(data => {
            for (let expander of data) {
                if (expander.key === key) {
                    let error = "Key already used"
                    reject(error)
                    return
                }
            }
            chrome.storage.local.set({"expanders": [...data, newData]}).then(savedInfo => {
                resolve(savedInfo)
            }).catch((err) => {
                let errorMessage = "Some thing went wrong while adding shortcuts"
                console.error(errorMessage, err)
                reject(errorMessage)
            })
        })
    })
}


export async function fetchAllExpanders() {
    return new Promise(async (resolve, reject) => {
        let data = await chrome.storage.local.get(["expanders"])
        if (data['expanders']) {
            resolve(data['expanders'])
        } else {
            console.log("fetched data :", data)
            console.error("Some thing went wrong while getting expanders from chrome.storage, but returning empty array")
            resolve([])
        }
    })

}