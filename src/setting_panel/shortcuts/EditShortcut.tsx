import {EditOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import React from "react";
import {Shortcuts} from "../../@types/shortcuts";

type Props = {
    shortcut: Shortcuts
}
export default function EditShortcut({shortcut}: Props) {
    function onClick(e: React.MouseEvent) {
        console.log(e, shortcut)
    }

    return (
        <Tooltip
            color={"rgba(0,0,0,0.7)"}
            title="Edit shortcut">
            <span onClick={onClick} className={"edit"} key="edit"><EditOutlined/></span>
        </Tooltip>
    )
}