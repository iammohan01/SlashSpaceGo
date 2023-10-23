import getIndexDbConnection from "../db_operations/DbOperations.js";

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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
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
export function openTarget (shortcut) {
    shortcut.invoke++
    getIndexDbConnection().then(db=>{
        db.put("shortcuts",shortcut).then(e=>{
            console.log("invoke updated")
        })
    })
    return
    if (shortcut.target === 1) {
        getCurrentActiveTab().then(tab => {
            goToUrl(tab[0].id, shortcut.url)
        })
    } else if (shortcut.target === 2) {
        chrome.tabs.create({url: shortcut.url}).then(tab => {
            console.log(tab)
        })
    }
    else if (shortcut.target === 3) {
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