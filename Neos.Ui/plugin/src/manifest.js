import * as React from 'react';
import manifest, {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {NeosContext, LinkTypes, Modal, createEditor, EditorContext} from '@sitegeist/archaeopteryx-core';
import {InspectorEditor} from '@sitegeist/archaeopteryx-inspector-editor';
import {LinkButton} from '@sitegeist/archaeopteryx-rte-formatter';

manifest('@sitegeist/archaeopteryx-plugin', {}, (globalRegistry, {store, configuration, ...deps}) => {
    console.log(deps);
    const editor = createEditor();
    const neosContext = {globalRegistry, store, configuration};

    registerLinkTypes(neosContext);
    registerContainers(neosContext, editor);
    registerInspectorEditors(neosContext, editor);
    registerRteFormatter(neosContext, editor);
});

function registerLinkTypes({globalRegistry}) {
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

    linkTypeRegistry.set(
        'Sitegeist.Archaeopteryx:NodeTree',
        LinkTypes.NodeTree
    );
}

function registerInspectorEditors(neosContext, editor) {
    const {globalRegistry} = neosContext;
    const editorsRegistry = globalRegistry.get('inspector').get('editors');

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: props => (
            <NeosContext.Provider value={neosContext}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(InspectorEditor, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}

function registerContainers(neosContext, editor) {
    const {globalRegistry} = neosContext;
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry.set(
        'Modals/Sitegeist.Archaeopteryx',
        props => (
            <NeosContext.Provider value={neosContext}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(Modal, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    );
}

function registerRteFormatter(neosContext, editor) {
    const {globalRegistry} = neosContext;
    const ckeditor5Registry = globalRegistry.get('ckEditor5');
    if (!ckeditor5Registry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }

    const richtextToolbarRegistry = ckeditor5Registry.get('richtextToolbar');
    if (!richtextToolbarRegistry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 richtextToolbar registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }

    richtextToolbarRegistry.set('link', {
        commandName: 'link',
        component: props => (
            <NeosContext.Provider value={neosContext}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(LinkButton, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        ),
        isVisible: config => Boolean(config && config.formatting && config.formatting.a)
    });
}