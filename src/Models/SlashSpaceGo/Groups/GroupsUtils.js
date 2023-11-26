import { Database } from '@n1md7/indexeddb-promise';
import tables from "./TableSchema.json"
import { v4 as uuidv4 } from 'uuid';

const db = new Database({
    version: 1,
    name: 'slashGoo',
    tables: [tables]
})
await db.connect();
const groupsModel = db.useModel(tables.name)

export default async function fetchAllGroups() {
    return groupsModel.selectAll()
}
export function addGroup(data) {
    return groupsModel.insert({...data,id:uuidv4()});
}
export function deleteGroup(key){
    console.log("delete" ,key)
    return groupsModel.deleteByPk(key);
}
export async function updateGroup(primaryKey,data){
    await groupsModel.updateByPk(primaryKey,data)
}