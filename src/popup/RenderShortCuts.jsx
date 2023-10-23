import PopupContext, {View,isMacOs} from "./context/PopupContext.jsx";
import {useContext, useEffect, useState} from "react";
import {Tooltip} from "antd";
import {openTarget} from "../utils/utils.js"
import listIcon from "../../public/resources/icons/view_list.svg";
import gridIcon from "../../public/resources/icons/view_grid.svg"
import metaIcon from "../../public/resources/icons/meta.svg"
import ctrlIcon from "../../public/resources/icons/ctrl.svg"
export default function RenderShortCuts() {

    const {shortCuts,layout} = useContext(PopupContext);


    let [shortCutItems, setShortCutItems] = useState([])

    useEffect(() => {
        let sortedShortcuts;

        function attachKeyboardShortcut(event) {
            let key = event.which
            if (48 <= key && key <= 57) {
                if (isMacOs && event.metaKey) {
                    event.preventDefault()
                    console.log("mac os")
                    openTarget(sortedShortcuts[Number(event.key)])
                } else if (!isMacOs && event.ctrlKey) {
                    event.preventDefault()
                    console.log("windows or linux")
                    openTarget(sortedShortcuts[Number(event.key)])
                }
                return
            }
        }

        if (shortCuts && shortCuts?.value && Array.isArray(shortCuts.value)) {
            sortedShortcuts = shortCuts.value
            sortedShortcuts.sort((a, b) => b.invoke - a.invoke)
            let renderedShortcuts = []
            document.addEventListener('keydown', attachKeyboardShortcut);

            for (let index = 0; index < sortedShortcuts.length; index++) {
                const val = sortedShortcuts[index];
                renderedShortcuts.push(
                    <LoadShortcut
                        isMacOs={isMacOs}
                        key={index}
                        shortCut={val}
                        index={index}
                    />);
            }
            setShortCutItems(renderedShortcuts)
        }

        return () => {
            document.removeEventListener('keydown', attachKeyboardShortcut);
        };

    }, [shortCuts.value]);


    return (
        <div className="freq-suggest-wrapper">
            <input style={{display: "none"}} placeholder={"Search shortcut"}/>
            <h4 className="title">
                Frequently Used Shortcuts
                <Tooltip
                    title={"Change layout"}
                    mouseEnterDelay={1}
                    mouseLeaveDelay={0.25}
                >
                <span
                    style={{cursor: "pointer"}}
                    onClick={(event) => {
                        layout.setLayout(prev => {
                            if (prev === View.LIST) {
                                return View.GRID
                            }
                            return View.LIST
                        })
                    }} className="view">
                    <img
                        src={layout.value === View.GRID ? listIcon : gridIcon}
                        alt="View List"/>
                </span>
                </Tooltip>
            </h4>
            <div className="frq-shortcuts">
                {shortCutItems}
            </div>
        </div>
    );
}

function LoadShortcut({shortCut, index, isMacOs}) {

    const {shortCuts,layout} = useContext(PopupContext);
    index++;
    function onclick(e) {
        openTarget(shortCut)
    }
    let children =   <div onClick={onclick} draggable="true" className={layout.value}>
        {layout.value ===View.GRID && index < 10 && <div className="keyShortcut">
            <img
                src={isMacOs ? metaIcon : ctrlIcon}
                alt="shortcutIcons"
            />
            {index}
        </div>}
        {layout.value ===View.GRID && shortCut.key}
        {layout.value === View.LIST && <h6>{index + " . " + shortCut.key}</h6>}
        {layout.value === View.LIST && <p className={"url"}><img src={shortCut.faviconUrl}/>{shortCut.url} </p>}
    </div>

    return layout.value === View.GRID ?<Tooltip
        title={<span style={{fontSize: "0.6rem"}}>{shortCut.url}</span>}
        mouseEnterDelay={0.7}
        mouseLeaveDelay={0.5}
    >
        {children}
    </Tooltip> : children;
}
