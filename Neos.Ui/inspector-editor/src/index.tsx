import * as React from 'react';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {INeosContextProperties, NeosContext} from '@sitegeist/archaeopteryx-neos-bridge';
import {IEditor, EditorContext} from '@sitegeist/archaeopteryx-core';

import {InspectorEditor} from './InspectorEditor';

export function registerInspectorEditor(
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const {globalRegistry} = neosContextProperties;
    const inspectorRegistry = globalRegistry.get('inspector');
    if (!inspectorRegistry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find inspector registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of InspectorEditor...');
        return;
    }

    const editorsRegistry = inspectorRegistry.get<SynchronousRegistry<any>>('editors');
    if (!editorsRegistry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find inspector editors registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of InspectorEditor...');
        return;
    }

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(InspectorEditor, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}