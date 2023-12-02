import PopupContext, {isMacOs} from "../context/PopupContext.js";
import React, {useContext, useEffect, useState} from "react";
import {Tooltip} from "antd";
import {openTarget} from "../../utils/utils.js"
import listIcon from "../../../public/resources/icons/view_list.svg";
import gridIcon from "../../../public/resources/icons/view_grid.svg"
import RenderShortcut from "./RenderShortcut.js";
import {Shortcuts, View} from "../../@types/shortcuts";

export default function RenderShortCutsWrapper() {


    const {shortCuts, layout} = useContext(PopupContext);
    const [shortCutsCtx, _] = shortCuts
    const [layoutCtx, setLayoutCtx] = layout


    const [shortCutItems, setShortCutItems] = useState<React.ReactElement[]>([])

    useEffect(() => {
        let sortedShortcuts: Shortcuts[];

        function attachKeyboardShortcut(event: KeyboardEvent) {
            const key = event.which
            if (48 <= key && key <= 57) {
                if (isMacOs && event.metaKey) {
                    event.preventDefault()
                    console.log("mac os")
                    openTarget(sortedShortcuts[Number(event.key)])
                } else if (!isMacOs && event.ctrlKey) {
                    event.preventDefault()
                    console.log("windows or linux")
                    openTarget(sortedShortcuts[Number(event.key)])
                }

            }
        }

        if (shortCutsCtx && shortCutsCtx.length > 0) {
            sortedShortcuts = shortCutsCtx
            sortedShortcuts.sort((a, b) => b.invoke - a.invoke)
            const renderedShortcuts = []
            document.addEventListener('keydown', attachKeyboardShortcut);

            for (let index = 0; index < sortedShortcuts.length; index++) {
                const val = sortedShortcuts[index];
                renderedShortcuts.push(
                    <RenderShortcut
                        isMacOs={isMacOs}
                        key={index}
                        shortCut={val}
                        index={index}
                    />);
            }
            setShortCutItems(renderedShortcuts)
        }

        return () => {
            document.removeEventListener('keydown', attachKeyboardShortcut);
        };

    }, [shortCutsCtx]);


    return (
        <div className="freq-suggest-wrapper">
            <input style={{display: "none"}} placeholder={"Search shortcut"}/>
            <h4 className="title">
                Frequently Used Shortcuts
                <Tooltip
                    title={"Change layout"}
                    mouseEnterDelay={1}
                    mouseLeaveDelay={0.25}
                >
                <span
                    style={{cursor: "pointer"}}
                    onClick={() => {
                        if (setLayoutCtx != null) {
                            setLayoutCtx(prev => {
                                if (prev === View.LIST) {
                                    return View.GRID
                                }
                                return View.LIST
                            })
                        }
                    }} className="view">
                    <img
                        src={layoutCtx === View.GRID ? listIcon : gridIcon}
                        alt="View List"/>
                </span>
                </Tooltip>
            </h4>
            <div className="frq-shortcuts">
                {shortCutItems}
            </div>
        </div>
    );
}
