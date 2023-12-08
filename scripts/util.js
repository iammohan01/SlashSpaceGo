export function goToUrl(tabId, url) {
    return chrome.tabs.update(tabId, {url: url})
}

export function createNewWindow() {
    return chrome.windows.create()
}

export default function getCurrentActiveTab() {
    return chrome.tabs.query({active: true, currentWindow: true})
}
