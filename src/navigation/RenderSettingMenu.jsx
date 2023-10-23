import {Menu} from 'antd';
import {useContext} from "react";
import context from "../context/context.jsx";
export default function RenderSettingMenu() {

    const {settingsMenu} = useContext(context)
    function getItem(label, key, icon, children, type) {
        return {key, icon, children, label, type};
    }

    const items = [
        getItem('Shortcuts', 1),
        getItem('Groups', 2),
        getItem('Settings', 3)
    ];

    return (
        <div style={{}}>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                onClick={(e) => {
                    settingsMenu.setValue(Number(e.key))
                }}
                style={
                    {
                        width: 256,
                        display: "flex",
                        flexDirection: "column",
                    }
                }
                items={items}
            />
        </div>)
}