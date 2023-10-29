import Header from "./Header.jsx";
import CreateShortCut from "./CreateShortCut.jsx";
import RenderShortCuts from "./RenderShortCuts.jsx";
import RenderShortCutsWrapper from "./Shortcuts/RenderShortCutsWrapper.jsx";
export default function Popup() {
    return (
        <div className={"main-frame-wrapper"}>
            <Header/>
            <CreateShortCut/>
            <RenderShortCuts/>
        </div>
    )
}