import React from "react"
import light from "../../public/resources/icons/lightnig.svg"
import share from "../../public/resources/icons/share.svg"

export default function Header(): React.ReactElement {
    return (
        <div className="header">
            <div className="icon">
                <img src="" alt="" srcSet={light}/>
            </div>
            <div className="title">SLASH SPACE GO</div>
            <div className="share">
                <img src="" alt="" srcSet={share}/>
            </div>
        </div>
    )
}