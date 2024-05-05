import fetchAllShortcuts from "../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";
import {fetchAllExpanders} from "../Models/SlashSpaceGo/TextExpander/TextExpanderUtils";
import {Shortcuts, UrlTarget} from "../@types/shortcuts";
import {openTarget} from "../utils/utils";
import {request, RequestEvent} from "../@types/background";
import {Logger} from "tslog";

export const logger = new Logger({name: "ssg"});

logger.attachTransport((logObj) => {
    insertLogs(logObj)
});


let shortcuts: Shortcuts[] = []

const logs = [];

function insertLogs(log) {
    if (logs.length >= 100) {
        logs.shift()
    }
    logs.push(log)
}

export function getLogs() {
    console.log(logs)
    return logs;
}
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
            const suggestion = {
                content: key,
                description: key
            }
            suggestEntries.push(suggestion)
        }
    })
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
            // here we should split input and and that splited string len must be 2 and 1 index must be number and eiter 0 or 1
            const searchInputs = query.split(" ").filter(a=>!!a) // [ssg , 1] [ssg]
            if (searchInputs.length === 1 && shortcut.key === searchInputs[0]) {
                // open in the configured target
                openTarget(shortcut).then();
            } else if (shortcut.key === searchInputs[0]) {
                // open in new tab
                openTarget(shortcut, searchInputs.length == 2 && searchInputs[1] === "1" ? UrlTarget.NEW_TAB : undefined).then();
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
chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === "sampleFunction") {
        // Do something with the selected text
        console.log(info);
    }
});


chrome.runtime.onMessage.addListener(
    function (request: request, _sender, sendResponse) {
        if (request.event === RequestEvent.EXPANDER) {
            if (request.action === "getText") {
                const inputValue = request.key || '';
                fetchAllExpanders().then((val = []) => {
                    const filtered = val.filter(storedValues => {
                        return inputValue.includes(storedValues.key)
                    })
                    sendResponse(filtered)
                })
            }
            if (request.action === "getAll") {
                fetchAllExpanders().then(expanders => {
                    sendResponse(expanders)
                })
            }
        }
        return true;  // Keeps the message channel open for asynchronous response
    }
);