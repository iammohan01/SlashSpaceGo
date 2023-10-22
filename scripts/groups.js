const getAllGroups = () => {

    chrome.storage.sync.get().then(fetchedData=>{
        let groups = fetchedData.groups
        let shortcuts = fetchedData.shortcuts

        groups.forEach(group=>{
            group.shortcuts_id.forEach(shortcut_id=>{
                console.log(shortcut_id.id)
            })
        })
    })

}