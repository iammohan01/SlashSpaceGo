import {openTarget} from "../utils/utils.js";
import fetchAllShortcuts from "../Models/SlashSpaceGo/ShortcutsUtils.js";

let data = []

chrome.omnibox.onInputStarted.addListener(() => {
    fetchAllShortcuts().then(fetchedData => {
        data = fetchedData
    })
})
chrome.omnibox.onInputChanged.addListener((text = "", suggest) => {
    let suggestEntries = []
    data.forEach((props) => {
        let key = props.key
        if (key.includes(text.toLowerCase()) || props.url?.includes(text.toLowerCase())) {
            console.log(props)
            let suggestion = {
                content: key,
                description: key
            }
            suggestEntries.push(suggestion)
        }
    })
    console.log(suggestEntries)
    suggest(suggestEntries);
})


chrome.omnibox.onInputEntered.addListener(query => {
    if (!data) {
        fetchAllShortcuts().then(fetchedData => {
            data = fetchedData
        })
    }
    if (data) {
        data.forEach(shortcut => {
            if (shortcut.key === query) {
                openTarget(shortcut)
            }
        })
    }
})


chrome.runtime.onInstalled.addListener(function () {
    // Create a new context menu item
    chrome.contextMenus.create({
        "id": "sampleFunction",
        "title": "Run Sample Function",
        "contexts": ["selection"]
    });
});

// Set up a click event listener
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "sampleFunction") {
        // Do something with the selected text
        let selectedText = info.selectionText;
        console.log(info);
    }
});
