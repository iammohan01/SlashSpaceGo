import PopupContext from "./context/PopupContext.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {Tooltip} from "antd";
import {openTarget} from "../utils/utils.js"

export default function RenderShortCuts() {

    const {shortCuts} = useContext(PopupContext);

    const View = Object.freeze({
        GRID: "GRID",
        LIST: "LIST"
    })

    let [shortCutItems, setShortCutItems] = useState([])
    let [view, setView] = useState(View.GRID)


    useEffect(() => {
        let sortedShortcuts;
        const isMacOs = navigator.userAgentData.platform === "macOS";

        function attachKeyboardShortcut(event) {
            let key = event.which
            if (48 <= key && key <= 57) {
                if (isMacOs && event.metaKey) {
                    event.preventDefault()
                    console.log("mac os")
                    console.log(sortedShortcuts[Number(event.key)])
                    openTarget(sortedShortcuts[Number(event.key)])
                } else if (!isMacOs && event.ctrlKey) {
                    event.preventDefault()
                    console.log("windows")
                }
                Number(event.key)
                return
            }
        }

        if (shortCuts && shortCuts?.value && Array.isArray(shortCuts.value)) {
            sortedShortcuts = shortCuts.value.sort((a, b) => b.createdTime - a.createdTime)
            let renderedShortcuts = []
            document.addEventListener('keydown', attachKeyboardShortcut);

            for (let index = 0; index < sortedShortcuts.length; index++) {
                const val = sortedShortcuts[index];
                renderedShortcuts.push(
                    <LoadShortcut
                        isMacOs={isMacOs}
                        key={index}
                        view={view}
                        shortCut={val}
                        index={index}
                    />);
            }
            setShortCutItems(renderedShortcuts)
        }
        console.log(keyshortcutsRef)

        return () => {
            document.removeEventListener('keydown', attachKeyboardShortcut);
        };

    }, [shortCuts.value]);


    return (
        <div className="freq-suggest-wrapper">
            <input placeholder={"Search shortcut"}/>
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
                        setView(prev => {
                            if (prev === View.LIST) {
                                return View.GRID
                            }
                            return View.LIST
                        })
                    }} className="view">
                    <img
                        src={view === View.GRID ? "../../resources/icons/view_list.svg" : "../../resources/icons/view_grid.svg"}
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

function LoadShortcut({shortCut, index, view, isMacOs}) {
    return <Tooltip
        title={<span style={{fontSize: 10, lineHeight: "revert"}}>{shortCut.url}</span>}
        mouseEnterDelay={2}
    >
        <div tabIndex="0" draggable="true" className={view.toLowerCase()}>
            {index < 10 && <div className="keyShortcut"><img
                src={isMacOs ? "../../resources/icons/meta.svg" : "../../resources/icons/ctrl.svg"}
                alt="shortcutIcons"/>{index}</div>}
            {shortCut.key}
        </div>
    </Tooltip>;
}
