import {EditOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";

export default function EditShortcut({shortcut}){
    function onClick(e){
        console.log(shortcut,e)
    }
    return (
        <Tooltip
            color={"rgba(0,0,0,0.7)"}
            title="Edit shortcut">
            <span onClick={onClick} className={"edit"} key="edit"><EditOutlined/></span>
        </Tooltip>
    )
}