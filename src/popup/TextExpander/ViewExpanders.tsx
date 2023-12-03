import {request, RequestEvent} from "../../@types/background";
import React, {useContext, useEffect, useState} from "react";
import PopupContext from "../context/PopupContext";
import {Expanders} from "../../@types/expanders";
import {View} from "../../@types/shortcuts";
import listIcon from "/resources/icons/view_list.svg";
import gridIcon from "/resources/icons/view_grid.svg";
import {Tooltip} from "antd";

type MakeExpanderProperties = {
    expanderProperty: Expanders[]
}

export function ViewExpanders() {
    const {expandersCtx, layout} = useContext(PopupContext)
    const [expanders, setExpanders] = expandersCtx
    const [layoutCtx, setLayoutCtx] = layout

    const [ExpanderModule, changeExpanderModule] = useState<React.ComponentType<MakeExpanderProperties>>()

    useEffect(() => {
        const loadModule = async () => {
            const renderer = await import("./RenderExpanders")
            changeExpanderModule(() => renderer.RenderExpanders)
        }
        loadModule().then()
        chrome.runtime.sendMessage({
            event: RequestEvent.EXPANDER,
            action: "getAll"
        } as request)
            .then(r => {
                console.log(r as Expanders[])
                if (setExpanders) {
                    setExpanders(r as Expanders[])
                }
            })
    }, []);
    return (
        <div className={"freq-expanders-wrapper"}>
            <h4 className={"title"}>
                Saved Expanders
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
            <div className={'expanders-list'}>
                {ExpanderModule ? <ExpanderModule expanderProperty={expanders ? expanders : []}/> : <>ExpanderModule</>}
            </div>
        </div>
    )
}