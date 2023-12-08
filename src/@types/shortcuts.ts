type Shortcuts = {
    url: string;
    id: string
    key: string
    invoke: number
    target: UrlTarget
    favIconUrl: string | undefined;
}
type UserTabData = {
    createdTime: number
    favIconUrl: string | undefined;
    id: string
    invoke: number
    key: string
    modifiedTime: number
    title: string | undefined;
    url: string | undefined;
}

enum UrlTarget {
    SAME_TAB,
    NEW_TAB,
    NEW_WINDOW
}

enum View {
    GRID,
    LIST
}

export {UrlTarget, View};
export type {Shortcuts, UserTabData};

