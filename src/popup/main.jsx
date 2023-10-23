import ReactDOM from 'react-dom/client'
import {ContextProvider} from "./context/PopupContext.jsx";
import Popup from "./Popup.jsx";
import "./styles/popup.css"

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider>
        <Popup/>
    </ContextProvider>
)
