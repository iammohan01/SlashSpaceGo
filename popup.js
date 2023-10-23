const page = $("html")
const shortcutInputField = $("#create-input");
const saveShortcutButton = $("#saveButton");
const pageTargetInput = $("#target");
const filterInput = $("#filterShortcuts");
const freqShortcutsWrapper = $('.frq-shortcuts');
const keyIcon = $("<img src='public/resources/icons/meta.svg' alt='shortcutIcons'/>")
const freqSuggestWrapper = $(".freq-suggest-wrapper")
const viewIcon = $(".freq-suggest-wrapper .view")
const filterWrapper = $(".filter-wrapper")
const groupWrapper = $(".group-wrapper")
const shortcutsView = $(".view-title-wrapper input")
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
                        key:newShortcutInput,
                        id:generateRandomString(10),
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
        Toastify({
            text: "Enter shortcut key",
            style:{
                "background":"linear-gradient(to right, #c0392b, #e74c3c)",
                borderRadius : "8px"
            },
            ...toastifyObject
        }).showToast();
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
        updatedShortcuts[shortcut.key] = shortcut
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
const createShortcutDiv = (shortcut,index)=>{
    let shortcutDiv = $(`<div tabindex="0" draggable="true"/>`)
    if(view.id === 1){
        shortcutDiv[0].classList.add("grid")
        let toolTip = $(`<p style="font-size: 10px">${shortcut.url}<p/>`)
        addTippy(shortcutDiv[0],toolTip[0],null,1000)
        if(index < 10){
            let shortcutIcon = $(`<div class="keyShortcut"/>`);
            shortcutIcon.text(index++)
            shortcutIcon.prepend(keyIcon.clone())
            shortcutDiv.append(shortcutIcon)
        }
        shortcutDiv[0].append(shortcut.key.slice(0, 6))
    }
    else {
        let listView = $("<h6/>")
        shortcutDiv[0].classList.add("list")
        listView[0].append(index++, " .  ")
        listView[0].append(shortcut.key)
        shortcutDiv[0].append(listView[0])
        let p = $("<p class='url'/>")
        p.text(shortcut.url)
        shortcutDiv[0].append(p[0])
    }

    shortcutDiv.click(() => {
        openTarget(shortcut)
    })
    return shortcutDiv
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

    console.log(Object.values(fetchedShortcuts.shortcuts))

    Object.values(fetchedShortcuts.shortcuts || {}).forEach(shortcuts => {
        // console.log(shortcuts)
        if (shortcuts.key.includes(filter) || shortcuts.url.includes(filter)) {
            let shortcutDiv = createShortcutDiv(shortcuts,index++)
            freqShortcutsWrapper.append(shortcutDiv)
        }
    })
}
const loadAllShortcuts = () => {
    filterWrapper.show()
    freqSuggestWrapper.show()
    groupWrapper.hide()
    getAllShortcuts().then(createShortcutDOMs)
}
const loadGroups =()=>{
    filterWrapper.hide()
    freqSuggestWrapper.hide()
    groupWrapper.show()

}
const exportShortCuts = ()=>{
    chrome.storage.sync.get("shortcuts").then(shortcuts=>{
        console.log(shortcuts);
        downloadFile(JSON.stringify(shortcuts), 'shortcuts.json', 'text/plain');
    })
}
const  downloadFile = (content, fileName, contentType)=>{
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
const importShortCuts = ()=>{
    window.showOpenFilePicker()
        .then(fileHandles => {
            const fileHandle = fileHandles[0];
            return fileHandle.getFile();
        })
        .then(file => {
            return file.text();
        })
        .then(text => {
            const jsonData = JSON.parse(text);
            console.log('Parsed JSON data:', jsonData);
            validateImportJson(jsonData)
            return jsonData;
        })
        .catch(err => {
            console.error('Error reading or parsing the file:', err);
        });
}
const generateRandomString = function (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}
const validateImportJson = (data)=>{
        if (data.hasOwnProperty('shortcuts') && typeof data.shortcuts === 'object') {
            for (let key in data.shortcuts) {
                if (typeof data.shortcuts[key] === 'object') {
                    if (data.shortcuts[key].hasOwnProperty('url')) {
                        console.log(true)
                    }
                }
            }
        }
        else{
            console.log(false)
        }
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
    let current = $(':focus');
    if (key.which === 39) { // right arrow key code
        current.next().focus();
    }
    else if (key.which === 37) { // right arrow key code
        current.prev().focus();
    }
    else if (key.which === 40) { // down arrow key code
        current.next().next().next().focus();
    }
    else if (key.which === 38) { // down arrow key code
        current.prev().prev().prev().focus();
    }
    console.log(current)
    if (key.key === "Enter") {
        if(shortcutInputField.is(":focus")){
            storeShortcut()
        }
        else{
            current[0].click()
        }
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
shortcutsView.change(e=>{
    console.log(e.target.value)
    if(e.target.value === "group"){
        loadGroups()
    }
    else {
        loadAllShortcuts()
    }
})




