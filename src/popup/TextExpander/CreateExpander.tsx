import {Input, message, Tooltip} from "antd";
import helpIcon from "../../../public/resources/icons/Help.svg";
import React, {useContext, useEffect, useRef} from "react";
import PopupContext from "../context/PopupContext";
import {saveExpander} from "../../Models/SlashSpaceGo/TextExpander/TextExpanderUtils";


const {TextArea} = Input;
type KeyInput = {
    expanderKey: [
        key: string,
        setKey: React.Dispatch<React.SetStateAction<string>> | null
    ]
    handleKeyDown: (event: React.KeyboardEvent) => void
}
type ValueInput = {
    expanderInput: [
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>> | null
    ]
}
export default function CreateExpander() {
    const {expanderKey, expanderInput} = useContext(PopupContext)
    const [messageApi, contextHolder] = message.useMessage();

    function initiateAddingTextExpander() {
        const key = expanderKey[0]
        const value = expanderInput[0]
        const isKeyAvailable = !!key.trim();
        const isValueAvailable = !!value.trim()
        if (isKeyAvailable && isValueAvailable) {
            messageApi
                .open({
                    type: 'loading',
                    content: 'Saving Expander',
                    duration: 0,
                }).then()
            saveExpander(key, value)
                .then(() => {
                    console.log("saved")
                    message.success("saved", 2).then()
                })
                .catch((err) => {
                    console.error(err)
                    message.error("Key Already Used", 3).then()
                })
                .finally(() => {
                    messageApi.destroy()
                })

        } else {
            console.log(isKeyAvailable, isValueAvailable)
            messageApi.open({
                type: 'warning',
                content: `Enter Expander ${!isKeyAvailable ? "key" : "value"}`
            }).then()
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event && event.key === 'Enter') {
            initiateAddingTextExpander()
        }
    }

    return (
        <>
            {contextHolder}
            <KeyInput handleKeyDown={handleKeyDown} expanderKey={expanderKey}/>
            <ValueInput expanderInput={expanderInput}/>
            <div className="button-fields">
                <button onClick={initiateAddingTextExpander} className="button" id="saveButton">Save</button>
            </div>
        </>
    )
}

function KeyInput({expanderKey, handleKeyDown}: KeyInput) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [key, setKey] = expanderKey

    useEffect(() => {
        inputRef?.current?.focus()
    }, []);


    return <div onKeyDown={handleKeyDown} className="input-fields">
        <span>/ SPACE</span>
        <input ref={inputRef}
               value={key}
               onChange={(e) => {
                   if (setKey != null) {
                       setKey(e?.target?.value?.trim())
                   }
               }
               }
               id="create-input"
               type="text"
               placeholder="Enter a shortcut name"/>
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

function ValueInput({expanderInput}: ValueInput) {
    const [value, setValue] = expanderInput

    function updateInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (setValue != null) {
            setValue(e.target.value);
        }
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