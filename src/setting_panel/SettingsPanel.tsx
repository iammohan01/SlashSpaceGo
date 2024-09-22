import './panel.css';
import context from '../context/context';
import {useContext} from 'react';
import ShortcutsWrapper, {Groups} from './shortcuts/ShortcutsWrapper';

export default function SettingsPanel() {
    const {settingsMenu} = useContext(context);
    const [setting, _] = settingsMenu;
    return (
        <div className={'panel-wrapper'}>
            {setting === 1 && <ShortcutsWrapper/>}
            {setting === 2 && <Groups/>}
        </div>
    );
}
