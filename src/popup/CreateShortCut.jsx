import {useContext, useEffect, useRef, useState} from "react";
import {Alert, Tooltip} from "antd";
import saveShortcut from "../utils/utils.js";
import PopupContext from "./context/PopupContext.jsx";
import helpIcon from "../../public/resources/icons/Help.svg"

export default function CreateShortCut() {

    const [key, setKey] = useState("")
    const [target, setTarget] = useState(1)
    const [showToast, setToast] = useState(<></>)
    const {shortCuts} = useContext(PopupContext)

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
            saveShortcut({key: trimmedKey, target}).then(data => {
                setToast(
                    <Alert style={{
                        position: "absolute",
                        top: 10,
                        padding: "0.6rem 1.2rem"
                    }}
                           message={data.status}
                           type="success"
                           showIcon
                    />)
                shortCuts.setValue(p=>{
                    let x = [ ...p,data.data]
                    return(x)
                })
                setKey("")
            }).catch(err => {
                let errMsg ;
                if(err.error.name === "ConstraintError"){
                    errMsg = "shortcut key already used"
                }
                console.error(typeof err.error,err.error)
                setToast(
                    <Alert style={{
                        position: "absolute",
                        top: 10,
                        padding: "0.6rem 1.2rem"
                    }}
                           message={errMsg || "Something went wrong"}
                           type="error"
                           showIcon
                    />)
            }).finally(() => {
                hideToast()
            })
        } else {
            setToast(
                <Alert style={{
                    position: "absolute",
                    top: 10,
                    padding: "0.6rem 1.2rem"
                }}
                       message="Enter shortcut name"
                       type="warning"
                       showIcon
                />)
        }
        hideToast()
    }
    function hideToast() {
        setTimeout(() => {
            setToast(<></>)
        }, 3000)
    }
    return <div tabIndex={-1} onKeyDown={handleKeyDown} className="create-shortcut-wrapper">
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