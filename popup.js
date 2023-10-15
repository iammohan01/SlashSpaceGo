
const page = $("html")
const shortcutInputField = $("#create-input");
const ignoreShortcutButton = $("#cancelButton");
const saveShortcutButton = $("#saveButton");
const pageTargetInput = $("#target");
const filterInput = $("#filterShortcuts");
const freqShortcutsWrapper = $('.frq-shortcuts');
const getAllShortcuts = () => {
    return chrome.storage.sync.get("shortcuts")
}
const storeShortcut = () => {
    let newShortcutInput = shortcutInputField.val().toLowerCase();
    let target = Number(pageTargetInput.val());
    if (newShortcutInput) {
        getCurrentActiveTab().then(currentTab => {
            let shortcuts;
            console.log(currentTab)
            getAllShortcuts().then(fetchedShortcuts => {
                shortcuts = fetchedShortcuts.shortcuts || {}
                let storedShortcutKeys = Object.keys(shortcuts);
                if (storedShortcutKeys.includes(newShortcutInput)) {
                    console.log("already stored in db ")
                } else {
                    shortcuts[newShortcutInput] = {
                        url: currentTab[0].url,
                        invoke: 0,
                        target: target
                    }
                    chrome.storage.sync.set({"shortcuts": shortcuts}).then(() => {
                        console.log("stored")
                        loadAllShortcuts()
                    })
                    console.log(newShortcutInput)
                }
            })

        })
    } else {
        //toast a notification
    }
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
const createShortcutDOMs = (fetchedShortcuts,filter='')=>{
    freqShortcutsWrapper.empty();
    Object.keys(fetchedShortcuts.shortcuts || {}).forEach(key => {
       if(key.includes(filter)){
           let shortcut = fetchedShortcuts.shortcuts[key]
           let shortcutDiv = $(`<div/>`)
           shortcutDiv.text(key.slice(0, 6))
           shortcutDiv.click(() => {
               console.log(shortcut.target)
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
                       goToUrl(tab.id, shortcut.url).then(tabs => {
                           console.log("new window opened")
                       })
                   })
               }
           })
           freqShortcutsWrapper.append(shortcutDiv)
       }
        // console.log(shortcutDiv)
    })
}
const loadAllShortcuts = () => {
    getAllShortcuts().then(createShortcutDOMs)
}
loadAllShortcuts();

filterInput.focusin(()=>{
    let tempFilterObjects ;
    getAllShortcuts().then((keys)=>{
        tempFilterObjects = keys;
        filterInput.on("input",()=>{
            let filterKey = filterInput.val().toLowerCase();
            createShortcutDOMs(tempFilterObjects,filterKey)
        })
    })
})

page.keydown(key => {
    if (key.key === "Enter") {
        storeShortcut()
    }
})
saveShortcutButton.click(storeShortcut)


