import cryptoRandomString from "crypto-random-string";
import {Expanders} from "../../../@types/expanders";

export function generateRandomString(length: number) {
    return cryptoRandomString({length: length, type: 'alphanumeric'});
}


export function saveExpander(key: string, value: string) {
    const newData = {
        key,
        value,
        createdTime: Date.now(),
        id: generateRandomString(15),
        invoke: 0,
        modifiedTime: Date.now(),
    } as Expanders

    return new Promise((resolve, reject) => {
        fetchAllExpanders().then(data => {
            for (const expander of data) {
                if (expander.key === key) {
                    const error = "Key already used"
                    reject(error)
                    return
                }
            }
            chrome.storage.local.set({"expanders": [...data, newData]}).then(savedInfo => {
                resolve(savedInfo)
            }).catch((err) => {
                const errorMessage = "Some thing went wrong while adding shortcuts"
                console.error(errorMessage, err)
                reject(errorMessage)
            })
        })
    })
}


export async function fetchAllExpanders(): Promise<Expanders[]> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["expanders"]).then(data => {
            if (data['expanders']) {
                resolve(data['expanders'])
            } else {
                console.error("Some thing went wrong while getting expanders from chrome.storage, but returning empty array")
                resolve([])
            }
        })
            .catch(() => {
                reject()
            })
    })

}