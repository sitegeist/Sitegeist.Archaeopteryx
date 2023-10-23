import * as React from 'react';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {INeosContextProperties, NeosContext} from '@sitegeist/archaeopteryx-neos-bridge';
import {EditorContext, IEditor} from '@sitegeist/archaeopteryx-core';

import {createInspectorEditor, LinkDataType} from './InspectorEditor';

export function registerInspectorEditors(
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

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/ValueObjectLinkEditor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(createInspectorEditor(LinkDataType.valueObject), props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(createInspectorEditor(LinkDataType.string), props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}
