import React from 'react';
import CreateShortCut from './CreateShortCut';
import RenderShortCutsWrapper from './RenderShortCutsWrapper';

export default function Shortcuts(): React.ReactElement {
    return (
        <>
            <CreateShortCut/>
            <RenderShortCutsWrapper/>
        </>
    );
}
