
let data = {}

const getAllShortcuts = () => {
    return chrome.storage.sync.get("shortcuts")
}
const goToUrl = (tabId, url) => {
    return chrome.tabs.update(tabId, {url: url})
}
const createNewWindow = () => {
    return chrome.windows.create()
}
const getCurrentActiveTab = ()=>{
    return chrome.tabs.query({active:true,currentWindow:true})
}

const openTarget =(shortcut)=>{
    shortcut.invoke++
    console.log(shortcut)
    getAllShortcuts().then(data=>{
        let updatedShortcuts = data.shortcuts;
        updatedShortcuts[shortcut.key] = shortcut
        chrome.storage.sync.set({"shortcuts": updatedShortcuts}).then(data=>{
            console.log(shortcut)
            console.log(updatedShortcuts)
            console.log("updated shortcuts");
        })
    })
    if (shortcut.target === 1) {
        getCurrentActiveTab().then(tab => {
            goToUrl(tab[0].id, shortcut.url)
        })
    } else if (shortcut.target === 2) {
        chrome.tabs.create({url: shortcut.url}).then(tab => {
            console.log(tab)
        })
    } else if (shortcut.target === 3) {
        createNewWindow().then(window => {
            let tab = window.tabs[0]
            console.log("Going to open new window")
            goToUrl(tab.id, shortcut.url).then(() => {
                console.log("new window opened")
            })
        })
    }
}
chrome.omnibox.onInputStarted.addListener(()=>{
    getAllShortcuts().then(fetchedData=>{
        data = fetchedData
    })
})
chrome.omnibox.onInputChanged.addListener((text="", suggest) => {
    // console.log('Input changed to: ' + a text);
    // console.log(data.shortcuts)
    let suggestEntries = []


    Object.entries(data.shortcuts || []).forEach((props)=>{
        let key = props[0]
        if(key.includes(text.toLowerCase())){
            let suggestion = {
                content : key,
                description : `${props[1].description || key}`
            }
            suggestEntries.push(suggestion)
        }
    })
    console.log(suggestEntries)
    suggest(suggestEntries);
})


chrome.omnibox.onInputEntered.addListener(e=>{
    console.log("event",e)
    if(!data){
        getAllShortcuts().then(fetchedData=>{
            data = fetchedData
        })
    }
    if(data){
        Object.entries(data.shortcuts).forEach(items=>{
            if(items[0] === e){
                console.log(items[1]);
                openTarget(items[1])
            }
        })
    }
})


chrome.runtime.onInstalled.addListener(function() {
    // Create a new context menu item
    chrome.contextMenus.create({
        "id": "sampleFunction",
        "title": "Run Sample Function",
        "contexts": ["selection"]
    });
});

// Set up a click event listener
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "sampleFunction") {
        // Do something with the selected text
        let selectedText = info.selectionText;
        console.log( info);
    }
});
