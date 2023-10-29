import { Database } from '@n1md7/indexeddb-promise';
import shortcuts from "./Shortcuts.json"
import { v4 as uuidv4 } from 'uuid';

const db = new Database({
    version: 1,
    name: 'slashGoo',
    tables: [shortcuts]
})
await db.connect();
const shortCutModel = db.useModel(shortcuts.name)

export default async function fetchAllShortcuts() {
    return shortCutModel.selectAll()
}
export function saveShortcut(data) {
    return shortCutModel.insert({...data,id:uuidv4()});
}
export function deleteShortcut(key){
    console.log("delete" ,key)
    return shortCutModel.deleteByPk(key);
}
export async function updateShortcut(primaryKey,data){
    await shortCutModel.updateByPk(primaryKey,data)
}