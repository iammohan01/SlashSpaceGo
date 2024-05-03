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
    return chrome.tabs.update(tabId, {url: url, active: true})
}

export function createNewWindow() {
    return chrome.windows.create()
}

export function getCurrentActiveTab() {
    return chrome.tabs.query({active: true, currentWindow: true})
}

export async function openTarget(shortcut: Shortcuts, target: UrlTarget = UrlTarget.SAME_TAB) {
    shortcut.invoke++
    if (!target) {
        target = shortcut.target
    }
    await updateInvoke(shortcut)
    const tabs = await getCurrentActiveTab();
    const activeTab = tabs[0];
    if (target === UrlTarget.SAME_TAB) {
        if (activeTab?.id) {
            await goToUrl(activeTab.id, shortcut.url);
        }
    } else if (target === UrlTarget.NEW_TAB) {
        // check that current tab is empty
        if (activeTab.url.trim() === "chrome://newtab/") {
            if (activeTab?.id) {
                await goToUrl(activeTab.id, shortcut.url);
                return
            }
        }
        await chrome.tabs.create({url: shortcut.url});
    } else if (target === UrlTarget.NEW_WINDOW) {
        const window = await createNewWindow();
        const tab = window.tabs?.[0];
        if (tab?.id) {
            await goToUrl(tab.id, shortcut.url);
        }
    } else if (target === UrlTarget.IN_EXISTING_TAB) {
        const tabs = await chrome.tabs.query({active: false, currentWindow: true});
        const existingTab = tabs.find(tab => tab.url && tab.url.includes(shortcut.url));

        if (existingTab) {
            await goToUrl(existingTab.id, null);
        } else if (activeTab.url.trim() === "chrome://newtab/") {
            if (activeTab?.id) {
                await goToUrl(activeTab.id, shortcut.url);
                return
            }
        }
        await chrome.tabs.create({url: shortcut.url});
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

export function copyTextToClipboard(text: string) {
    //Create a textbox field where we can insert text to.
    const copyFrom = document.createElement("textarea");

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