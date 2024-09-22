import fetchAllShortcuts, {saveShortcut} from '../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils';
import {fetchAllExpanders} from '../Models/SlashSpaceGo/TextExpander/TextExpanderUtils';
import {Shortcuts, UrlTarget, UserTabData} from '../@types/shortcuts';
import {generateRandomString, openTarget} from '../utils/utils';
import {request, RequestEvent} from '../@types/background';

let shortcuts: Shortcuts[] = [];

chrome.omnibox.onInputStarted.addListener(() => {
    fetchAllShortcuts().then((fetchedData) => {
        shortcuts = fetchedData;
    });
});
chrome.omnibox.onInputChanged.addListener((text = '', suggest) => {
    const suggestEntries: { content: string; description: string }[] = [];
    shortcuts.forEach((props) => {
        const key: string = props.key;
        if (
            key.includes(text.toLowerCase()) ||
            props.url?.includes(text.toLowerCase())
        ) {
            const suggestion = {
                content: key,
                description: key
            };
            suggestEntries.push(suggestion);
        }
    });
    suggest(suggestEntries);
});

chrome.omnibox.onInputEntered.addListener((query) => {
    if (!shortcuts) {
        fetchAllShortcuts().then((fetchedData) => {
            shortcuts = fetchedData;
        });
    }
    if (shortcuts) {
        shortcuts.forEach((shortcut) => {
            // here we should split input and and that splited string len must be 2 and 1 index must be number and eiter 0 or 1
            const searchInputs = query.split(' ').filter((a) => !!a); // [ssg , 1] [ssg]
            if (searchInputs.length === 1 && shortcut.key === searchInputs[0]) {
                // open in the configured target
                openTarget(shortcut).then();
            } else if (shortcut.key === searchInputs[0]) {
                // open in new tab
                openTarget(
                    shortcut,
                    searchInputs.length == 2 && searchInputs[1] === '1'
                        ? UrlTarget.NEW_TAB
                        : undefined
                ).then();
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(async function (details) {
    // Create a new context menu item
    // chrome.contextMenus.create({
    //     id: 'sampleFunction',
    //     title: 'Run Sample Function',
    //     contexts: ['selection']
    // });
    if (details.reason !== 'update') {
        return;
    }
    if (details.previousVersion === '3.2') {
        const previousData: { [p: string]: { count: number; url: string } } =
            await chrome.storage.sync.get();
        Object.entries(previousData).forEach((entry) => {
            const key = entry[0];
            const value = entry[1];

            const shortcut: UserTabData = {
                createdTime: Date.now(),
                invoke: value.count,
                key,
                modifiedTime: Date.now(),
                title: `${value.url}`,
                url: value.url,
                target: UrlTarget.SAME_TAB,
                favIconUrl: `${value.url}/favicon.ico`,
                id: generateRandomString(15)
            };
            saveShortcut(shortcut);
        });
    }
});

// Set up a click event listener
// chrome.contextMenus.onClicked.addListener(function (info) {
//     if (info.menuItemId === 'sampleFunction') {
//         // Do something with the selected text
//         console.log(info);
//     }
// });

chrome.runtime.onMessage.addListener(function (
    request: request,
    _sender,
    sendResponse
) {
    if (request.event === RequestEvent.EXPANDER) {
        if (request.action === 'getText') {
            const inputValue = request.key || '';
            fetchAllExpanders().then((val = []) => {
                const filtered = val.filter((storedValues) => {
                    return inputValue.includes(storedValues.key);
                });
                sendResponse(filtered);
            });
        }
        if (request.action === 'getAll') {
            fetchAllExpanders().then((expanders) => {
                sendResponse(expanders);
            });
        }
    }
    return true; // Keeps the message channel open for asynchronous response
});
