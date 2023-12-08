import {ReactElement, ReactNode, useEffect, useState} from "react";
import {Button, Empty, List} from "antd";
import EditShortcut from "./EditShortcut";
import {Shortcuts} from "../../@types/shortcuts";

export default function LoadShortcuts() {

    const [storedShortcuts, setStoredShortcuts] = useState<ReactElement>()
    useEffect(() => {
        chrome.storage.sync.get("shortcuts").then(data => {
            return setStoredShortcuts(renderShortcut(data as RenderShortcuts));
        })
    }, []);

    return storedShortcuts
}

type RenderShortcuts = {
    shortcuts: Shortcuts[]
}

function renderShortcut({shortcuts}: RenderShortcuts): ReactElement {

    function LoadEmpty() {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{height: 60}}
                description=
                    {
                        <span>
                        No shortcuts available
                    </span>
                    }
            >
                <Button type="primary">Create New</Button>
            </Empty>
        )
    }

    function renderItem(shortcut: Shortcuts, index: number): ReactNode {
        console.log(shortcut)
        return <List.Item
            key={shortcut.id}
            className={"shortcut"}
            actions={[<EditShortcut key={index} shortcut={shortcut}/>]}>
            <List.Item.Meta
                style={{cursor: "pointer"}}
                title={<p>{index + 1 + " . " + shortcut.key}</p>}
                description={
                    <a href={shortcut.url}>
                        {shortcut.url}
                    </a>
                }
            />
        </List.Item>
    }


    if (shortcuts) {
        shortcuts = Object.entries(shortcuts)
            .sort((a, b) => b[1].invoke - a[1].invoke)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, []);
        return (
            <List dataSource={shortcuts} renderItem={renderItem}/>
        )
    } else {
        return (
            <div className={"empty"}>
                <LoadEmpty/>
            </div>
        )
    }
}

