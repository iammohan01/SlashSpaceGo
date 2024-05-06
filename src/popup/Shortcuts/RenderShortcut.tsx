import React, {useContext} from "react";
import PopupContext from "../../context/PopupContext.tsx";
import metaIcon from "/resources/icons/meta.svg";
import ctrlIcon from "/resources/icons/ctrl.svg";
import emptyIcon from "/resources/icons/empty.svg";
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

    const {shortCuts, layout , shortcutKeyInput,isEditable,selectedEditShortcut,urlEditInput } = useContext(PopupContext);
    const [_shortcut, setShortCuts] = shortCuts
    const [layoutCtx, __] = layout
    const [_,setUrlKey] = urlEditInput
    const [editMode, setEditMode] = isEditable;
    const [_shortcutkey, setShortcutKey] = shortcutKeyInput

    function handleEdit() {
        if(editMode){
            setEditMode(()=>false)
            return 
        }
        selectedEditShortcut.current = {...shortCut}
        setShortcutKey(selectedEditShortcut.current.key)
        setUrlKey(selectedEditShortcut.current.url)
        setEditMode(()=>true)
    }

    function handleDelete() {
        deleteShortcut(shortCut.key).then(() => {
            if (setShortCuts != null) {
                setShortCuts(prev => prev.filter(obj => obj.key !== shortCut.key))
            }
        })
    }

    async function handleOpen() {
        await openTarget(shortCut, shortCut.target)
    }

    const popoverContent = () => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                maxWidth: "90vw"
            }}
        >
            <span style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "100%",
                fontSize: "0.7rem"
            }}>{
                shortCut.url
            }</span>
            <div
                style={{
                    display: "flex",
                    fontSize: "0.7rem",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem"
                }}>
                <a onClick={handleEdit}>Edit</a>
                <a onClick={handleDelete}>Delete</a>
                {/*commented this since it duplicates same functionality for onclick*/}
                {/*<a onClick={handleOpen}>Open in new Tab</a>*/}
            </div>
        </div>
    )

    const children = <div onClick={handleOpen} draggable="true" className={layoutCtx === View.GRID ? "grid" : "list"}>
        {layoutCtx === View.GRID && index < 10 && <div className="keyShortcut">
            <img
                src={isMacOs ? metaIcon : ctrlIcon}
                alt="shortcutIcons"
            />
            {index}
        </div>}
        {layoutCtx === View.GRID &&
            <img style={{width: 14, aspectRatio: "1/1"}}
                 loading="lazy" src={shortCut.favIconUrl || emptyIcon}
                 onError={(({currentTarget}) => {
                     currentTarget.onerror = null; // prevents looping
                     currentTarget.src = emptyIcon;
                 })} alt={"icon"}/>}
        {layoutCtx === View.GRID && (shortCut.key.slice(0, 6))}
        {layoutCtx === View.GRID && shortCut.key.length > 6 && "..."}
        {layoutCtx === View.LIST && <h6>
            <img style={{width: 14, aspectRatio: "1/1"}}
                 loading="lazy"
                 src={shortCut.favIconUrl || emptyIcon}
                 onError={(({currentTarget}) => {
                     currentTarget.onerror = null; // prevents looping
                     currentTarget.src = emptyIcon;
                 })}
                 alt={"icon"}/> {index} . {shortCut.key}
        </h6>}
        {layoutCtx === View.LIST && <p className={"url"}>{shortCut.url} </p>}
    </div>

    return <Popover
        content={popoverContent()}
        mouseEnterDelay={0.5}
        mouseLeaveDelay={0.3}
    >
        {children}
    </Popover>
}