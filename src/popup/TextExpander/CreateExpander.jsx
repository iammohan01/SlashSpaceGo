import {Input, message, Tooltip} from "antd";
import helpIcon from "../../../public/resources/icons/Help.svg";
import {useContext, useEffect, useRef} from "react";
import PopupContext from "../context/PopupContext.jsx";

import {saveExpander} from "../../Models/SlashSpaceGo/TextExpander/TextExpanderUtils.js";

const {TextArea} = Input;
export default function CreateExpander() {
    const {expanderKey, expanderInput} = useContext(PopupContext)
    const [messageApi, contextHolder] = message.useMessage();

    function initiateAddingTextExpander() {
        let key = expanderKey[0]
        let value = expanderInput[0]
        let isKeyAvailable = !!key.trim();
        let isValueAvailable = !!value.trim()
        if (isKeyAvailable && isValueAvailable) {
            messageApi
                .open({
                    type: 'loading',
                    content: 'Saving Expander',
                    duration: 0,
                })
            saveExpander(key, value)
                .then(s => {
                    console.log("saved")
                    message.success("saved", 2)
                })
                .catch(err => {
                    console.error(err)
                    message.error("Key Already Used", 3)
                })
                .finally(() => {
                    messageApi.destroy()
                })

        } else {
            console.log(isKeyAvailable, isValueAvailable)
            messageApi.open({
                type: 'warning',
                content: `Enter Expander ${!isKeyAvailable ? "key" : "value"}`
            })
        }
    }

    function handleKeyDown(event){
        if (event.which === 13) {
            initiateAddingTextExpander()
        }
    }
    return (
        <>
            {contextHolder}
            <KeyInput handleKeyDown={handleKeyDown} state={expanderKey}/>
            <ValueInput state={expanderInput}/>
            <div className="button-fields">
                <button onClick={initiateAddingTextExpander} className="button" id="saveButton">Save</button>
            </div>
        </>
    )
}

function KeyInput({state,handleKeyDown}) {
    const inputRef = useRef(null);
    const [key, setKey] = state

    useEffect(() => {
        inputRef?.current?.focus()
    }, []);


    return <div onKeyDown={handleKeyDown} className="input-fields">
        <span>/ SPACE</span>
        <input ref={inputRef} value={key} onChange={(e) => {
            setKey(e?.target?.value?.trim())
        }} id="create-input" type="text" placeholder="Enter a shortcut name"/>
        <label htmlFor="target">
            <select name="option for page" id="target">
                <option value="1">same tab</option>
                <option value="2">new tab</option>
                <option value="3">new window</option>
            </select>
        </label>
        <Tooltip
            title={`For quick access to a saved large text with in shortcuts: Press "/", followed by a space and the shortcut name. Then, hit Enter`}>
            <img className="help-icon shortcut" src="" alt="" srcSet={helpIcon}/>
        </Tooltip>
    </div>
}

function ValueInput({state}) {
    const [value, setValue] = state

    function updateInput(e) {
        setValue(e.target.value);
    }

    return (
        <>
            <TextArea
                value={value}
                style={{margin: "5%", width: "90%", resize: "none", height: 180}}
                showCount
                onChange={updateInput}
                placeholder="Paste or Enter Text here"
            />
        </>)
}