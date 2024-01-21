import React from "react"
import icon from "/icons/48_48.png"
import share from "/resources/icons/share.svg"

export default function Header(): React.ReactElement {
    return (
        <div className="header">
            <div className="icon">
                <img className={"w-10"} src="" alt="" srcSet={icon}/>
            </div>
            <div className="title">SLASH SPACE GO</div>
            <div className="share">
                <img src="" alt="" srcSet={share}/>
            </div>
        </div>
    )
}