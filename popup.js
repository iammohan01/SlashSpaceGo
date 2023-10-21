const page = $("html")
const shortcutInputField = $("#create-input");
const saveShortcutButton = $("#saveButton");
const pageTargetInput = $("#target");
const filterInput = $("#filterShortcuts");
const freqShortcutsWrapper = $('.frq-shortcuts');
const keyIcon = $("<img src='resources/icons/meta.svg' alt='shortcutIcons'/>")
const viewIcon = $(".suggest-wrapper .view")
const toastifyObject = {
    gravity: "top",
    position: "center",
    stopOnFocus: false,
}
let keyShorts = {}
const isMacOs = navigator.userAgentData.platform === "macOS";
if(!isMacOs){
    keyIcon.attr("src","resources/icons/ctrl.svg")
}

let view = {
    id : 1,
    grid : "./resources/icons/view_grid.svg",
    list : "./resources/icons/view_list.svg"
}
const changeView = function (){
    console.log(viewIcon[0].children[0].src)
    if(view.id === 1){
        view.id = 2
        viewIcon[0].children[0].src = view.grid
    }
    else {
        view.id = 1
        viewIcon[0].children[0].src = view.list
    }
    loadAllShortcuts()
}
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
                    Toastify({
                        text: "shortcut key already used",
                        style:{
                            "background":"linear-gradient(to right, #c0392b, #e74c3c)",
                            borderRadius : "8px"
                        },
                        ...toastifyObject
                    }).showToast();
                    console.log("already stored in db ")
                } else {
                    shortcuts[newShortcutInput] = {
                        id:newShortcutInput,
                        url: currentTab[0].url,
                        invoke: 0,
                        target: target,
                        createdTime : Date.now()
                    }
                    chrome.storage.sync.set({"shortcuts": shortcuts}).then(() => {
                        console.log("stored")
                        shortcutInputField.val("")
                        Toastify({
                            style: {
                                borderRadius : "8px"
                            },
                            text: "shortcut added",
                            ...toastifyObject
                        }).showToast();
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
const getCurrentActiveTab = () => {
    return chrome.tabs.query({active: true, currentWindow: true})
}
const openTarget = (shortcut) => {
    shortcut.invoke++
    getAllShortcuts().then(data=>{
        let updatedShortcuts = data.shortcuts;
        updatedShortcuts[shortcut.id] = shortcut
        chrome.storage.sync.set({"shortcuts": updatedShortcuts}).then(data=>{
            console.log(shortcut)
            console.log(updatedShortcuts)
            console.log("updated shortcuts");
            loadAllShortcuts();
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
    }
    else if (shortcut.target === 3) {
        createNewWindow().then(window => {
            let tab = window.tabs[0]
            console.log("Going to open new window")
            goToUrl(tab.id, shortcut.url).then(() => {
                console.log("new window opened")
            })
        })
    }
}

const createShortcutDOMs = (fetchedShortcuts, filter = '') => {
    freqShortcutsWrapper.empty();
    let index = 1;
    console.log(fetchedShortcuts.shortcuts)
    fetchedShortcuts.shortcuts = Object.entries(fetchedShortcuts.shortcuts || {})
        .sort((a, b) => b[1].invoke - a[1].invoke)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    Object.keys(fetchedShortcuts.shortcuts || {}).forEach(key => {
        if (key.includes(filter) || fetchedShortcuts.shortcuts[key].url.includes(filter)) {

            let shortcut = fetchedShortcuts.shortcuts[key]
            keyShorts[index] = shortcut
            let shortcutDiv = $(`<div/>`)
            if(view.id === 1){
                shortcutDiv[0].classList.add("grid")
                if(index < 10){
                    let shortcutIcon = $(`<div class="keyShortcut"/>`);
                    shortcutIcon.text(index++)
                    shortcutIcon.prepend(keyIcon.clone())
                    shortcutDiv.append(shortcutIcon)
                }
                shortcutDiv[0].append(key.slice(0, 6))
            }
            else {
                let listView = $("<h6/>")
                shortcutDiv[0].classList.add("list")
                listView[0].append(index++, " .  ")
                listView[0].append(shortcut.id)
                console.log(listView[0])
                shortcutDiv[0].append(listView[0])
                let p = $("<p class='url'/>")
                p.text(shortcut.url)
                shortcutDiv[0].append(p[0])
            }

            shortcutDiv.click(() => {
                openTarget(shortcut)
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
filterInput.focusin(() => {
    let tempFilterObjects;
    getAllShortcuts().then((keys) => {
        tempFilterObjects = keys;
        filterInput.on("input", () => {
            let filterKey = filterInput.val().toLowerCase();
            createShortcutDOMs(tempFilterObjects, filterKey)
        })
    })
})

page.keydown(key => {
    
    if (key.key === "Enter") {
        storeShortcut()
    } else {
        console.log(key)
        let num = Number(key.key)
        if (isMacOs && key.metaKey && num > 0) {
            key.preventDefault()
            openTarget(keyShorts[num])
        }
        else if (key.ctrlKey && num > 0) {
            key.preventDefault()
            openTarget(keyShorts[num])
        }
    }
})
saveShortcutButton.click(storeShortcut)
shortcutInputField.focus()

viewIcon.click(event=>{
    changeView()
})





