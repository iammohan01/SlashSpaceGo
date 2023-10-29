import {useContext, useEffect, useRef, useState} from "react";
import {message, Tooltip} from "antd";
import  {generateCurrentTabData} from "../utils/utils.js";
import PopupContext from "./context/PopupContext.jsx";
import helpIcon from "../../public/resources/icons/Help.svg"
import {saveShortcut} from "../Models/SlashSpaceGo/ShortcutsUtils.js";

export default function CreateShortCut() {

    const [key, setKey] = useState("")
    const [target, setTarget] = useState(1)
    const [showToast, setToast] = useState(<></>)
    const {shortCuts} = useContext(PopupContext)
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef?.current?.focus()
    }, []);
    const handleKeyDown = event => {
        if (event.which === 13) {
            initSaveShortcut()
        }
    };
    function initSaveShortcut() {
        let trimmedKey = key.trim();
        if (trimmedKey) {
            messageApi.open({
                type: 'loading',
                content: 'Saving shortcut',
                duration: 0.5,
            }).then(async () => {
                generateCurrentTabData(trimmedKey, target)
                    .then(data => {
                        saveShortcut(data).then(s=>{
                            console.log("saved")
                            console.log(s)
                            shortCuts.setValue(prev=>[...prev,s])
                            message.success("saved",3)
                        })
                            .catch(err=>{
                                console.error(err)
                                message.error("Shortcut Already Used",3)
                            })

                    })
                    .catch(err=>{
                    console.error(err)
                    message.error("Something went wrong",3)
                })
            })
        } else {
            messageApi.open({
                type:'warning',
                content : 'Enter shortcut name'
            })
        }
    }

    return <div tabIndex={-1} onKeyDown={handleKeyDown} className="create-shortcut-wrapper">
        {contextHolder}
        {!!showToast && showToast}
        <div className="input-fields">
            <span>/ SPACE</span>
            <input ref={inputRef} value={key} onChange={(e) => {
                setKey(e.target.value.trim())
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
        <div className="button-fields" onClick={initSaveShortcut}>
            <button className="button" id="saveButton">Save</button>
        </div>
    </div>
}