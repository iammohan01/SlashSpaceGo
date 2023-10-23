import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {ContextProvider} from "./context/context.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider>
        <App />
    </ContextProvider>
)
