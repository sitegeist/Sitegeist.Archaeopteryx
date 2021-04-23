import * as React from 'react';
import manifest, {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {NeosContext, LinkTypes} from '@sitegeist/archaeopteryx-core';
import {InspectorEditor} from '@sitegeist/archaeopteryx-inspector-editor';

manifest('@sitegeist/archaeopteryx-plugin', {}, globalRegistry => {
    registerLinkTypes(globalRegistry);
    registerInspectorEditors(globalRegistry);
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

function registerInspectorEditors(globalRegistry) {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: props => React.createElement(
            NeosContext.Provider,
            {value: {globalRegistry}},
            React.createElement(InspectorEditor, props)
        )
    });
}