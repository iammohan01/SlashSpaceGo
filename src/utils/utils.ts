import cryptoRandomString from 'crypto-random-string';
import {updateInvoke} from "../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";
import {Shortcuts, UrlTarget, UserTabData} from "../@types/shortcuts";


export function generateRandomString(length: number) {
    return cryptoRandomString({length: length, type: 'alphanumeric'});
}

export function getActiveTab() {
    return chrome.tabs.query({active: true, currentWindow: true})
}

export function goToUrl(tabId: number, url: string) {
    return chrome.tabs.update(tabId, {url: url})
}

export function createNewWindow() {
    return chrome.windows.create()
}

export function getCurrentActiveTab() {
    return chrome.tabs.query({active: true, currentWindow: true})
}

export function openTarget(shortcut: Shortcuts, target: UrlTarget = UrlTarget.SAME_TAB) {
    shortcut.invoke++
    if (!target) {
        target = shortcut.target
    }
    updateInvoke(shortcut)
    if (target === UrlTarget.SAME_TAB) {
        getCurrentActiveTab().then(tab => {
            if (tab !== undefined && tab[0] && tab[0].id !== undefined) {
                goToUrl(tab[0].id, shortcut.url).then(() => {
                    console.log("target opened")
                })
            }
        })
    } else if (target === UrlTarget.NEW_TAB) {
        chrome.tabs.create({url: shortcut.url}).then(tab => {
            console.log(tab)
        })
    } else if (target === UrlTarget.NEW_WINDOW) {
        createNewWindow().then(window => {
            if (window.tabs && window.tabs[0] && window.tabs[0] !== undefined) {
                const tab = window.tabs[0]
                console.log("Going to open new window")
                if (tab !== undefined && tab.id !== undefined) {
                    goToUrl(tab.id, shortcut.url).then(() => {
                        console.log("new window opened")
                    })
                }
            }
        })
    }
}

export async function generateCurrentTabData(key: string, target: UrlTarget): Promise<UserTabData> {
    return getActiveTab().then(currentTab => {
        return {
            createdTime: Date.now(),
            favIconUrl: currentTab[0].favIconUrl,
            id: generateRandomString(15),
            invoke: 0,
            key: key,
            modifiedTime: Date.now(),
            target: target || UrlTarget.SAME_TAB,
            title: currentTab[0].title,
            url: currentTab[0].url
        }
    })

}

export function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to.
    const copyFrom = document.createElement("textarea");

    console.log(copyFrom)
    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}