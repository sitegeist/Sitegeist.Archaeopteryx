import * as React from 'react';
import manifest, {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {NeosContext, LinkTypes, Modal, createEditor, EditorContext} from '@sitegeist/archaeopteryx-core';
import {InspectorEditor} from '@sitegeist/archaeopteryx-inspector-editor';

manifest('@sitegeist/archaeopteryx-plugin', {}, globalRegistry => {
    const editor = createEditor();

    registerLinkTypes(globalRegistry);
    registerInspectorEditors(globalRegistry, editor);
    registerContainers(globalRegistry, editor);
});

function registerLinkTypes(globalRegistry) {
    const linkTypeRegistry = new SynchronousRegistry(`
        # Sitegeist.Archaeopteryx LinkType Registry
    `);

    globalRegistry.set(
        '@sitegeist/archaeopteryx/link-types',
        linkTypeRegistry
    );

    linkTypeRegistry.set(
        'Sitegeist.Archaeopteryx:WebLink',
        LinkTypes.WebLink
    );
}

function registerInspectorEditors(globalRegistry, editor) {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: props => (
            <NeosContext.Provider value={{globalRegistry}}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(InspectorEditor, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}

function registerContainers(globalRegistry, editor) {
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry.set(
        'Modals/Sitegeist.Archaeopteryx',
        props => (
            <EditorContext.Provider value={editor}>
                <Modal {...props} i18n={globalRegistry.get('i18n')}/>
            </EditorContext.Provider>
        )
    );
}