import manifest from '@neos-project/neos-ui-extensibility';

import {InspectorEditor} from '@sitegeist/archaeopteryx-inspector-editor';

manifest('@sitegeist/archaeopteryx-plugin', {}, globalRegistry => {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: InspectorEditor
    });
});