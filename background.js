
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
                description : `${props[1].description || key}  :  ${props[1].url}`
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
    Object.entries(data.shortcuts).forEach(items=>{
        if(items[0] === e){
            console.log(items[1]);
            openTarget(items[1])
        }
    })
})