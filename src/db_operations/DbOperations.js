import {openDB} from "idb";


export default function getIndexDbConnection() {
    return openDB('slashGo', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            console.log("upgrade")
            console.log(oldVersion)
            switch (oldVersion){
                case 0 :{
                    const shortcuts = db.createObjectStore("shortcuts",{keyPath:"key"});
                    shortcuts.createIndex("key","key")
                }
            }
        },
        blocked(currentVersion, blockedVersion, event) {
            console.log("blocked")
        },
        blocking(currentVersion, blockedVersion, event) {
            console.log("blocking")
        },
        terminated() {
            console.log("terminated")
        }
    })
}