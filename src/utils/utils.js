import getIndexDbConnection from "../db_operations/DbOperations.js";
import cryptoRandomString from 'crypto-random-string';

export default function saveShortcut({key, target}) {
    return new Promise((resolve, reject) => {
        getIndexDbConnection().then(db => {
            console.log(db)
            getActiveTab().then(async tab => {
                    try {
                        let shortcutObject = {
                            createdTime: Date.now(),
                            favIconUrl: tab[0].favIconUrl,
                            id: generateRandomString(10),
                            invoke: 0,
                            key: key,
                            modifiedTime: 1698000711201,
                            target: target || 1,
                            title: tab[0].title,
                            url: tab[0].url
                        }
                        console.log()
                        db.add("shortcuts",shortcutObject).then(st=>{
                            resolve({status:"shortcut saved",data:shortcutObject})
                        }).catch(e=>{
                            reject({status:"Some thing went wrong",error:e})
                        })
                    }
                    catch (e){
                        reject({status:"Some thing went wrong",error:e})
                    }
                }
            ).catch(e=>{
                reject({status:"Some thing went wrong",error:e})
            })
        }).catch(e=>{
            reject({status:"Some thing went wrong",error:e})
        })
    })
}

export function generateRandomString(length) {
    return cryptoRandomString({length: length, type: 'alphanumeric'});
}

export function getActiveTab() {
    return chrome.tabs.query({active: true, currentWindow: true})
}





export function goToUrl (tabId, url) {
    return chrome.tabs.update(tabId, {url: url})
}
export function createNewWindow () {
    return chrome.windows.create()
}
export function getCurrentActiveTab () {
    return chrome.tabs.query({active: true, currentWindow: true})
}
export function openTarget (shortcut ,target) {
    shortcut.invoke++
    if(!target){
        target = shortcut.target
    }
    getIndexDbConnection().then(db=>{
        db.put("shortcuts",shortcut).then(e=>{
            console.log("invoke updated")
        })
    })
    if (target === 1) {
        getCurrentActiveTab().then(tab => {
            goToUrl(tab[0].id, shortcut.url)
        })
    } else if (target === 2) {
        chrome.tabs.create({url: shortcut.url}).then(tab => {
            console.log(tab)
        })
    }
    else if (target === 3) {
        createNewWindow().then(window => {
            let tab = window.tabs[0]
            console.log("Going to open new window")
            goToUrl(tab.id, shortcut.url).then(() => {
                console.log("new window opened")
            })
        })
    }
}

export function getAllShortcuts() {
    return new Promise((resolve, reject) => {
            getIndexDbConnection().then(db => {
                const tx = db.transaction('shortcuts', 'readwrite');
                db.getAll("shortcuts").then(data => {
                    console.log(data)
                    resolve(data)
                }).catch(e=>{
                    reject(e)
                });
            }).catch(e=>{
                reject(e)
            })
        }
    )
}

export function deleteShortcut(key) {
    return new Promise((resolve, reject) => {
            getIndexDbConnection().then(async db => {
                const tx = db.transaction('shortcuts', 'readwrite');
                console.log(await db.getAll("shortcuts"))
                await db.delete("shortcuts", key,1)
            }).catch(e=>{
                reject(e)
            })
        }
    )
}