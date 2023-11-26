import Header from "./Header.jsx";
import Shortcuts from "./Shortcuts/Shortcuts.jsx";
import {useState} from "react";
import TextExpander from "./TextExpander/TextExpander.jsx";
import {Radio} from 'antd';

export default function Popup() {
    const [view, setView] = useState(0);

    function changeView(e) {
        setView(e.target.value)
    }

    function ModeSwitch() {
        return (
            <Radio.Group style={{
                display:"flex",
                justifyContent:"center"
            }} value={view} onChange={changeView}>
                <Radio.Button value={0}>Shortcuts</Radio.Button>
                <Radio.Button value={1}>Text expander</Radio.Button>
            </Radio.Group>)
    }

    return (<div className={"main-frame-wrapper"}>
        <Header/>
        <ModeSwitch/>
        {view === 0 && <Shortcuts/>}
        {view === 1 && <TextExpander/>}
        {/*<RenderGroupsWrapper/>*/}
    </div>)
}