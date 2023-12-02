import fetchAllShortcuts from "../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";
import {fetchAllExpanders} from "../Models/SlashSpaceGo/TextExpander/TextExpanderUtils";
import {Shortcuts} from "../@types/shortcuts";
import {openTarget} from "../utils/utils";

let shortcuts: Shortcuts[] = []

chrome.omnibox.onInputStarted.addListener(() => {
    fetchAllShortcuts().then(fetchedData => {
        shortcuts = fetchedData
    })
})
chrome.omnibox.onInputChanged.addListener((text = "", suggest) => {
    const suggestEntries: { content: string; description: string; }[] = []
    shortcuts.forEach((props) => {
        const key: string = props.key
        if (key.includes(text.toLowerCase()) || props.url?.includes(text.toLowerCase())) {
            console.log(props)
            const suggestion = {
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
    if (!shortcuts) {
        fetchAllShortcuts().then(fetchedData => {
            shortcuts = fetchedData
        })
    }
    if (shortcuts) {
        shortcuts.forEach(shortcut => {
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
        console.log(info);
    }
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request)
        if (request.event === "expander") {
            if (request.action === "getText") {
                const inputValue = request.key || '';
                fetchAllExpanders().then((val = []) => {
                    console.log(val)
                    const filtered = val.filter(storedValues => {
                        console.log(storedValues.key, inputValue, inputValue.includes(storedValues.key))
                        return inputValue.includes(storedValues.key)
                    })
                    console.log(filtered)
                    sendResponse(filtered)
                })
            }
        }
        return true;  // Keeps the message channel open for asynchronous response
    }
);