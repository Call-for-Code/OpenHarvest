import React, { ComponentType, ReactChild, ReactElement, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * Simple state manager for modals.
 */
export const ModalStateManager = ({
    renderLauncher: LauncherContent,
    children: ModalContent,
}: {renderLauncher: ComponentType<any>, children: ComponentType<any>}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            {!ModalContent || typeof document === 'undefined'
                ? null
                : ReactDOM.createPortal(
                    <ModalContent open={open} setOpen={setOpen} />,
                    document.body
                )}
            {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
        </>
    );
};