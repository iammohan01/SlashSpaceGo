import fetchAllShortcuts from "../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";
import {fetchAllExpanders} from "../Models/SlashSpaceGo/TextExpander/TextExpanderUtils";
import {Shortcuts} from "../@types/shortcuts";
import {openShortcut} from "../utils/utils";
import {request, RequestEvent} from "../@types/background";
import {Logger} from "tslog";

export const mainLogger = new Logger({name: "ssg", type: "pretty"});
const logger = mainLogger.getSubLogger({name: "background.ts"})
mainLogger.attachTransport((logObj) => {
    insertLogs(logObj)
});


export let shortcuts: Shortcuts[] = []

const logs = [];
let logId = 0;
function insertLogs(log) {
    if (logs.length >= 100) {
        logs.shift()
    }
    delete log._meta.runtime
    delete log._meta.logLevelId
    delete log._meta.path
    delete log._meta.browser
    log.id = logId++
    logs.push(log)
}

export function getLogs() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "slash_space_go_logs.json");
    chrome.tabs.create({url: dataStr});
    dlAnchorElem.click();
    return logs;
}
chrome.omnibox.onInputStarted.addListener(() => {
    logger.info("omnibox.onInputStarted");
    fetchAllShortcuts().then(fetchedData => {
        logger.info("fetchedShortcuts", fetchedData)
        shortcuts = fetchedData
    })
})
chrome.omnibox.onInputChanged.addListener((text = "", suggest) => {
    const suggestEntries: chrome.omnibox.SuggestResult[] = []
    shortcuts.forEach((props) => {
        const key: string = props.key
        if (key.includes(text.toLowerCase()) || props.url?.includes(text.toLowerCase())) {
            const suggestion = {
                content: key,
                description: key,
            }
            suggestEntries.push(suggestion)
        }
    })
    suggest(suggestEntries);
})


chrome.omnibox.onInputEntered.addListener(query => {
    openShortcut(query)
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