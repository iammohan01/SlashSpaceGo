import { message, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import PopupContext from "../../context/PopupContext.tsx";
import helpIcon from "/resources/icons/Help.svg"
import { UrlTarget } from "../../@types/shortcuts";
import { generateCurrentTabData } from "../../utils/utils";
import { saveShortcut, updateShortcut } from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";

export default function CreateShortCut(): React.ReactElement {

    const { shortCuts, shortcutKeyInput, isEditable, selectedEditShortcut, urlEditInput, forceUpdate } = useContext(PopupContext)
    const [_, setShortcutsInContext] = shortCuts
    const [key, setKey] = shortcutKeyInput
    const [editMode, setEditMode] = isEditable;
    const [urlKey,setUrlKey] = urlEditInput
    const [target, __] = useState<UrlTarget>(UrlTarget.SAME_TAB)
    const [showToast, ___] = useState<React.ReactElement>(<></>)
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef<HTMLInputElement>(null);
    const editInputRef=useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef?.current?.focus()
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            initSaveShortcut()
        }
    };

    const handleOnchange = (e)=>{
        setUrlKey(e.target.value.trim())
    }

    const handlePostEdits = (shortCuts)=>{
        forceUpdate();
        setUrlKey("");
        setKey("");
        if (setShortcutsInContext != null) {
            console.log( shortCuts,"New shortCuts");
            setShortcutsInContext(shortCuts)
        }
        [inputRef.current, selectedEditShortcut.current, editInputRef.current] = [selectedEditShortcut.current?.key,null,null];
    }

    function initSaveShortcut() {
        if (editMode) {
            const updatedShortcut = {
                ...selectedEditShortcut.current,
                key,
                url:editInputRef.current.value,
                modifiedTime:Date.now()
            }
            updateShortcut(updatedShortcut).then((updatedValues)=>{
                return handlePostEdits(updatedValues);
            });
            setEditMode(false);
            return
        }
        const trimmedKey = key.trim();
        if (trimmedKey) {
            messageApi.open({
                type: 'loading',
                content: 'Saving shortcut',
                duration: 0,
            }).then()

            generateCurrentTabData(trimmedKey, target).then(data => {
                saveShortcut(data).then(s => {
                    if (setShortcutsInContext != null) {
                        setShortcutsInContext(prev => [...prev, s])
                    }
                    message.success("saved", 2).then()
                })
                    .catch(() => {
                        message.error("Shortcut Already Used", 3).then()
                    }).finally(() => {
                        messageApi.destroy()
                    })


            })
                .catch(() => {
                    message.error("Something went wrong", 3)
                        .then(() => {
                        })
                })


        } else {
            messageApi.open({
                type: 'warning',
                content: 'Enter shortcut name'
            }).then(() => {
            })
        }
    }

    const renderCreateInput = () => (
        <div className="input-fields">
            <span>{editMode ? "Edit shortcut" :"/ SPACE"}</span>
            <input ref={inputRef} value={key} onChange={(e) => {
                if (setKey != null) {
                    setKey(e.target.value.trim())
                }
            }} id="create-input" type="text" placeholder="Enter a shortcut name" />
            <label htmlFor="target">
                <select name="option for page" id="target">
                    <option value="1">same tab</option>
                    <option value="2">new tab</option>
                    <option value="3">new window</option>
                </select>
            </label>
            <Tooltip
                title={`For quick access to a saved website: Press "/", followed by a space and the shortcut name. Then, hit Enter`}>
                <img className="help-icon shortcut" src="" alt="" srcSet={helpIcon} />
            </Tooltip>
        </div>
    )

    const renderEditInput = () => (
        <div className="input-fields">
            <span>Edit Url</span>
            <input ref={editInputRef}
            value={urlKey}
            onChange={handleOnchange}
                id="create-input" type="text" placeholder="Enter a shortcut name" />
            {/* <Tooltip> </Tooltip> */}
        </div>
    )

    return <div tabIndex={-1} onKeyDown={handleKeyDown} className="create-shortcut-wrapper">
        {contextHolder}
        {!!showToast && showToast}
        {renderCreateInput()}
        {editMode && renderEditInput()}
        <div className="button-fields" onClick={initSaveShortcut}>
            <button className="button" id="saveButton">Save</button>
        </div>
    </div>
}