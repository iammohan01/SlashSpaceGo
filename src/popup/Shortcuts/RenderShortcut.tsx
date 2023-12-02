import React, {useContext} from "react";
import PopupContext from "../context/PopupContext.js";
import metaIcon from "../../../public/resources/icons/meta.svg";
import ctrlIcon from "../../../public/resources/icons/ctrl.svg";
import emptyIcon from "../../../public/resources/icons/empty.svg";
import {Popover} from "antd";
import {Shortcuts, View} from "../../@types/shortcuts";
import {openTarget} from "../../utils/utils";
import {deleteShortcut} from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";

type RenderShortcut = {
    shortCut: Shortcuts;
    index: number;
    isMacOs: boolean;
}

export default function RenderShortcut({shortCut, index, isMacOs}: RenderShortcut): React.ReactElement {

    const {shortCuts, layout} = useContext(PopupContext);
    const [_, setShortCuts] = shortCuts
    const [layoutCtx, __] = layout

    function onclick() {
        openTarget(shortCut)
    }

    const children = <div onClick={onclick} draggable="true" className={layoutCtx === View.GRID ? "grid" : "list"}>
        {layoutCtx === View.GRID && index < 10 && <div className="keyShortcut">
            <img
                src={isMacOs ? metaIcon : ctrlIcon}
                alt="shortcutIcons"
            />
            {index}
        </div>}
        {layoutCtx === View.GRID &&
            <img style={{width: 14, aspectRatio: "1/1"}} src={shortCut.favIconUrl || emptyIcon} alt={"fav icon"}/>}
        {layoutCtx === View.GRID && (shortCut.key.slice(0, 6))}
        {layoutCtx === View.GRID && shortCut.key.length > 6 && "..."}
        {layoutCtx === View.LIST && <h6><img style={{width: 14, aspectRatio: "1/1"}}
                                             src={shortCut.favIconUrl || emptyIcon} alt={""}/> {index} . {shortCut.key}
        </h6>}
        {layoutCtx === View.LIST && <p className={"url"}>{shortCut.url} </p>}
    </div>

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
            <span style={{fontSize: "0.7rem", wordWrap: "break-word", whiteSpace: "pre-wrap"}}>{shortCut.url}</span>
            <div
                style={{
                    display: "flex",
                    fontSize: "0.7rem",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem"
                }}>
                <a>Edit</a>
                <a onClick={() => {
                    deleteShortcut(shortCut.key).then((r) => {
                        console.log(r, "deleted")
                        if (setShortCuts != null) {
                            setShortCuts(prev => prev.filter(obj => obj.key !== shortCut.key))
                        }
                    })
                }}>Delete</a>
                <a onClick={() => {
                    openTarget(shortCut, 1)
                }}>open</a>
            </div>
        </div>}
        mouseEnterDelay={0.5}
        mouseLeaveDelay={0.3}
    >
        {children}
    </Popover>
}