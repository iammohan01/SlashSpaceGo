import {useContext, useEffect, useRef, useState} from "react";
import {Alert, Tooltip, message} from "antd";
import saveShortcut from "../utils/utils.js";
import PopupContext from "./context/PopupContext.jsx";
import helpIcon from "../../public/resources/icons/Help.svg"

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
            }).then(() => {
                saveShortcut({key: trimmedKey, target}).then(data => {
                    message.success(data.status,2.5)
                    shortCuts.setValue(p => {
                        let x = [...p, data.data]
                        return (x)
                    })
                    setKey("")
                }).catch(err => {
                    let errMsg =  "Something went wrong"
                    if (err.error.name === "ConstraintError") {
                        errMsg = "shortcut key already used"
                    }
                    console.error(typeof err.error, err.error)
                    message.error(errMsg,2.5)

                })
            })
        } else {
            messageApi.open({
                type:'warning',
                content : 'Enter shortcut name'
            })
        }
        hideToast()
    }
    function hideToast() {
        setTimeout(() => {
            setToast(<></>)
        }, 3000)
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