import getIndexDbConnection from "../db_operations/DbOperations.js";
import cryptoRandomString from 'crypto-random-string';


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

export async function generateCurrentTabData(key,target) {
    return getActiveTab().then(currentTab=>{
        let shortcutObject = {
            createdTime: Date.now(),
            favIconUrl: currentTab[0].favIconUrl,
            id: generateRandomString(10),
            invoke: 0,
            key: key,
            modifiedTime: 1698000711201,
            target: target || 1,
            title: currentTab[0].title,
            url: currentTab[0].url
        }
        return shortcutObject
    })

}