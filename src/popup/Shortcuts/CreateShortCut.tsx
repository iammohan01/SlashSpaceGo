import {Input, message, Tooltip} from "antd";
import React, {useContext, useEffect, useRef, useState} from "react";
import PopupContext from "../../context/PopupContext.tsx";
import helpIcon from "/resources/icons/Help.svg"
import {UrlTarget, UserTabData} from "../../@types/shortcuts";
import {generateCurrentTabData} from "../../utils/utils";
import {saveShortcut} from "../../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils";

export default function CreateShortCut(): React.ReactElement {

    const {shortCuts, shortcutKeyInput} = useContext(PopupContext)
    const [_, setShortcutsInContext] = shortCuts
    const [key, setKey] = shortcutKeyInput
    const [target, __] = useState<UrlTarget>(UrlTarget.SAME_TAB)
    const [showToast, ___] = useState<React.ReactElement>(<></>)
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string>();
    const [currentTabData, setCurrentTabData] = useState<UserTabData>();

    useEffect(() => {
        inputRef?.current?.focus()
        generateCurrentTabData(key, target).then(currentTabData => {
            setCurrentTabData(currentTabData)
            setUrl(currentTabData.url)
            console.log(currentTabData)
        }).catch((err) => {
            console.error(err)
            message.error("Something went wrong while fetching current tab data", 3)
                .then()
        })
    }, []);


    useEffect(() => {
        if (currentTabData) {
            setCurrentTabData(val => {
                val.url = url
                val.key = key
                return val
            })
        }
    }, [url, key]);




    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            initSaveShortcut()
        }
    };

    function initSaveShortcut() {
        const trimmedKey = key.trim();
        if (trimmedKey) {
            messageApi.open({
                type: 'loading',
                content: 'Saving shortcut',
                duration: 0,
            }).then()

            saveShortcut(currentTabData).then(s => {
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


        } else {
            messageApi.open({
                type: 'warning',
                content: 'Enter shortcut name'
            }).then(() => {
            })
        }
    }

    function changeUrl(input: { target: { value: React.SetStateAction<string>; }; }) {
        console.log(input.target.value)
        setUrl(input.target.value)
    }
    return <div tabIndex={-1} onKeyDown={handleKeyDown} className="create-shortcut-wrapper">
        {contextHolder}
        {!!showToast && showToast}
        <div className="input-fields">
            <span>/ SPACE</span>
            <input ref={inputRef} value={key} onChange={(e) => {
                if (setKey != null) {
                    setKey(e.target.value.trim())
                }
            }} id="create-input" type="text" placeholder="Enter a shortcut name"/>
            <label htmlFor="target">
                <select name="option for page" id="target">
                    <option value="1">same tab</option>
                    <option value="2">new tab</option>
                    <option value="3">new window</option>
                </select>
            </label>
            <Tooltip
                title={`For quick access to a saved website: Press "/", followed by a space and the shortcut name. Then, hit Enter`}>
                <img className="help-icon shortcut" src="" alt="" srcSet={helpIcon}/>
            </Tooltip>
        </div>
        <div className={"w-[80%] border-b mb-[0.6rem]"}>
            <Input placeholder="Enter Url" variant="borderless" onChange={changeUrl} value={url}/>
        </div>
        <div className="button-fields" onClick={initSaveShortcut}>
            <button className="button" id="saveButton">Save</button>
        </div>
    </div>
}