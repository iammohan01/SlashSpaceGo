import './NavBar.css';
import Logo from './Logo';
import RenderSettingMenu from './RenderSettingMenu';

export default function SideNavBar() {
    return (
        <div className={'side-nav-bar'}>
            <Logo/>
            <RenderSettingMenu/>
        </div>
    );
}
