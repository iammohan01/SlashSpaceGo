type request = {
    event: RequestEvent;
    action: string;
    key: string;
};

enum RequestEvent {
    SHORTCUTS,
    EXPANDER,
    SETTINGS
}

export {RequestEvent};
export type {request};
