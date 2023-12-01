import {openTarget} from "../utils/utils.js";
import fetchAllShortcuts from "../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils.js";
import {fetchAllExpanders} from "../Models/SlashSpaceGo/TextExpander/TextExpanderUtils.js";

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


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
        if (request.event === "expander") {
            if(request.action==="getText"){
                let inputValue = request.key || '';
                fetchAllExpanders().then((val=[])=>{
                    console.log(val)
                    let filtered = val.filter(storedValues=>{
                        console.log(storedValues.key,inputValue, inputValue.includes(storedValues.key))
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