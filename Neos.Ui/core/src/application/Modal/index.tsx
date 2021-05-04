import * as React from 'react';
import {INeosContextProperties, NeosContext} from '@sitegeist/archaeopteryx-neos-bridge';

import {createEditor, EditorContext} from '../../domain';
import {Modal} from './Modal';

export function registerModal(
    neosContextProperties: INeosContextProperties,
    editor: ReturnType<typeof createEditor>
): void {
    const {globalRegistry} = neosContextProperties;
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry?.set(
        'Modals/Sitegeist.Archaeopteryx',
        (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(Modal, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    );
}