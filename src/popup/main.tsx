import ReactDOM from 'react-dom/client';
import {ContextProvider} from '../context/PopupContext.tsx';
import Popup from './Popup';
import '../styles/popup.css';
import '@fontsource/poppins/';

const rootNode = document.getElementById('root');
if (rootNode != null) {
    ReactDOM.createRoot(rootNode).render(
        <ContextProvider>
            <Popup/>
        </ContextProvider>
    );
}
