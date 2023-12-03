import {Popover} from "antd";
import {ReactElement} from "react";

type PopOver = {
    children: ReactElement
    popoverTxt: string
    maxlength?: number
}
export default function MakePopOver({children, popoverTxt, maxlength = 100}: PopOver) {
    console.log(popoverTxt.substring(0, maxlength))
    const isMaxLength = popoverTxt.length > maxlength
    return <Popover
        content={<div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                maxWidth: "90vw"
            }}
        >
            <span style={{fontSize: "0.7rem", wordWrap: "break-word", whiteSpace: "pre-wrap"}}>
                {popoverTxt.substring(0, maxlength)}
                {isMaxLength && <br/>}
                {isMaxLength && <br/>}
                {isMaxLength ? `${popoverTxt.length - maxlength} more characters....` : ""}
            </span>

        </div>}
        mouseEnterDelay={0.2}
        mouseLeaveDelay={0.2}
    >
        {children}
    </Popover>
}