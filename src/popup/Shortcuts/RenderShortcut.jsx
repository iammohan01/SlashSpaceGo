import {useContext} from "react";
import PopupContext, {View} from "../context/PopupContext.jsx";
import {openTarget} from "../../utils/utils.js";
import metaIcon from "../../../public/resources/icons/meta.svg";
import ctrlIcon from "../../../public/resources/icons/ctrl.svg";
import emptyIcon from "../../../public/resources/icons/empty.svg";
import {Popover} from "antd";
import {deleteShortcut} from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils.js";

export default function RenderShortcut({shortCut, index, isMacOs}) {

    const {shortCuts, layout} = useContext(PopupContext);

    function onclick(e) {
        openTarget(shortCut)
    }

    let children = <div onClick={onclick} draggable="true" className={layout.value}>
        {layout.value === View.GRID && index < 10 && <div className="keyShortcut">
            <img
                src={isMacOs ? metaIcon : ctrlIcon}
                alt="shortcutIcons"
            />
            {index}
        </div>}
        {layout.value === View.GRID && <img style={{width: 14, aspectRatio: "1/1"}} src={shortCut.favIconUrl || emptyIcon}/>}
        {layout.value === View.GRID && (shortCut.key.slice(0, 6))}
        {layout.value === View.GRID && shortCut.key.length > 6 && "..."}
        {layout.value === View.LIST && <h6><img style={{width: 14, aspectRatio: "1/1"}} src={shortCut.favIconUrl || emptyIcon}/> {index} . {shortCut.key}</h6>}
        {layout.value === View.LIST && <p className={"url"}>{shortCut.url} </p>}
    </div>

    return <Popover
        content={<div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                maxWidth:"90vw"
            }}
        >
            <span style={{fontSize: "0.7rem",wordWrap: "break-word",whiteSpace:"pre-wrap"}}>{shortCut.url}</span>
            <div style={{display: "flex",fontSize: "0.7rem", alignItems: "center", justifyContent: "center", gap: "1rem"}}>
                <a>Edit</a>
                <a onClick={()=>{
                    deleteShortcut(shortCut.key).then(r =>{
                        console.log(r,"deleted")
                        shortCuts.setValue(prev=>prev.filter(obj=>obj.key!==shortCut.key))
                    })
                }}>Delete</a>
                <a onClick={() => {openTarget(shortCut,1)}}>open</a>
            </div>
        </div>}
        mouseEnterDelay={0.5}
        mouseLeaveDelay={0.3}
    >
        {children}
    </Popover>
}