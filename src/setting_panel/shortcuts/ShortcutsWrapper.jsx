import LoadShortcuts from "./LoadShortcuts.jsx";

export default function ShortcutsWrapper() {
    return (
        <div
            className={"panel-inner-wrapper"}>
            <div className={"panel-header"}>
               <h2>
                   Saved Shortcuts
               </h2>
            </div>
            <LoadShortcuts/>
        </div>
    );
}

export function Groups() {
    return (
        <div
            className={"panel-inner-wrapper"}>
            <div>
                Hello2
            </div>
        </div>
    );
}