import {Input, message, Tooltip} from "antd";
import helpIcon from "/resources/icons/Help.svg";
import React, {useContext, useEffect, useRef, useState} from "react";
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

enum Hide {
    SHOW,
    HIDE
}
export default function CreateExpander() {
    const {expanderKey, expanderInput} = useContext(PopupContext)
    const [messageApi, contextHolder] = message.useMessage();
    const [inputsVisibility, setInputsVisibility] = useState(true)

    console.log(Hide)
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
                    message.success("saved", 2).then()
                })
                .catch(() => {
                    message.error("Key Already Used", 3).then()
                })
                .finally(() => {
                    messageApi.destroy()
                })

        } else {
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
        <div style={{position: "relative"}} className={"expanders-wrapper"}>
            {contextHolder}
            <p onClick={() => {
                setInputsVisibility(prevState => !prevState)
            }} style={{position: "absolute", right: 20, top: 0, cursor: "pointer"}}>
                <span style={{display: "flex", gap: 10, userSelect: "none"}}>
                    <span>{inputsVisibility ? "Hide" : "Show"}</span>
                     <i style={inputsVisibility ? {rotate: "0deg"} : {rotate: "180deg"}}
                        className={"bi bi-caret-down-fill rotate"}></i>
                </span>
            </p>
            {inputsVisibility && <div>
                <KeyInput handleKeyDown={handleKeyDown} expanderKey={expanderKey}/>
                <ValueInput expanderInput={expanderInput}/>
                <div className="button-fields">
                    <button onClick={initiateAddingTextExpander} className="button" id="saveButton">Save</button>
                </div>
            </div>}
        </div>
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
        <label htmlFor="target"></label>
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
        <div style={{margin: 14}}>
            <TextArea
                value={value}
                style={{resize: "none", height: 100}}
                showCount
                onChange={updateInput}
                placeholder="Paste or Enter Text here"
            />
        </div>)
}