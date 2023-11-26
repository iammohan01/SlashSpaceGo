import FolderIcon from 'bootstrap-icons/icons/folder2.svg'
import RenderGroups from "./RenderGroups.jsx";
import {Tooltip} from "antd";

export default function RenderGroupsWrapper() {

    return <div className={'groups'}>
        <input style={{display: "none"}} placeholder={"Search shortcut"}/>
        <h4 className="title">
            <img src={FolderIcon}></img>
            Folders
        </h4>
        <div className={'groups-header'}>
            <div>/Group</div>
            <div>/Group</div>
           <div>
               <Tooltip title={'Create new Folder '}>
                   +
               </Tooltip>
           </div>

        </div>
        <RenderGroups/>
    </div>
}