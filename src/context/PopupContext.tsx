import React, {
    createContext,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';
import fetchAllShortcuts from '../Models/SlashSpaceGo/Shortcuts/ShortcutsUtils.ts';
import {Shortcuts, View} from '../@types/shortcuts.ts';
import {Expanders} from '../@types/expanders.ts';

export const isMacOs = true; //navigator.userAgentData.platform === "macOS";

interface PopupContextType {
    shortCuts: [
        Shortcuts[],
            React.Dispatch<React.SetStateAction<Shortcuts[]>> | null
    ];
    expandersCtx: [
        Expanders[],
            React.Dispatch<React.SetStateAction<Expanders[]>> | null
    ];
    layout: [View, React.Dispatch<React.SetStateAction<View>> | null];
    shortcutKeyInput: [
        string,
            React.Dispatch<React.SetStateAction<string>> | null
    ];
    expanderKey: [string, React.Dispatch<React.SetStateAction<string>> | null];
    expanderInput: [
        string,
            React.Dispatch<React.SetStateAction<string>> | null
    ];
    isEditable: [boolean, React.Dispatch<React.SetStateAction<boolean>> | null];
    forceUpdate: React.DispatchWithoutAction;
    selectedEditShortcut: React.MutableRefObject<Shortcuts>;
    urlEditInput: [string, React.Dispatch<React.SetStateAction<string>> | null];
}

const PopupContext = createContext<PopupContextType>({
    expanderInput: ['', null],
    expandersCtx: [[], null],
    expanderKey: ['', null],
    layout: [View.GRID, null],
    shortCuts: [[], null],
    isEditable: [false, null],
    shortcutKeyInput: ['', null],
    forceUpdate: null,
    selectedEditShortcut: null,
    urlEditInput: ['', null]
});
type Props = { children: React.ReactElement };

export function ContextProvider({children}: Props) {
    const [shortcuts, setShortcuts] = useState<Shortcuts[]>([]);
    const [expanders, setExpanders] = useState<Expanders[]>([]);
    const [layout, setLayout] = useState<View>(View.GRID);
    const [shortCutKey, setShortcutKey] = useState<string>('');
    const [expanderKey, setExpanderKey] = useState<string>('');
    const [expanderInput, setExpanderInput] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const selectedEditShortcut = useRef<Shortcuts>(null);
    const [urlKey, setUrlKey] = useState<string>(null);
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

    useEffect(() => {
        fetchAllShortcuts().then((shortcuts) => {
            setShortcuts(shortcuts);
        });
    }, []);

    return (
        <PopupContext.Provider
            value={{
                shortCuts: [shortcuts, setShortcuts],
                layout: [layout, setLayout],
                isEditable: [editMode, setEditMode],
                shortcutKeyInput: [shortCutKey, setShortcutKey],
                expanderKey: [expanderKey, setExpanderKey],
                forceUpdate,
                expanderInput: [expanderInput, setExpanderInput],
                expandersCtx: [expanders, setExpanders],
                selectedEditShortcut: selectedEditShortcut,
                urlEditInput: [urlKey, setUrlKey]
            }}
        >
            {children}
        </PopupContext.Provider>
    );
}

export default PopupContext;
