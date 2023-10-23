import "./NavBar.css"
import Logo from "./Logo.jsx";
import RenderSettingMenu from "./RenderSettingMenu.jsx";
export default function SideNavBar() {
    return (
        <div className={"side-nav-bar"}>
            <Logo/>
            <RenderSettingMenu/>
        </div>
    );
}