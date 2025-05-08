import manifest from '@neos-project/neos-ui-extensibility';

import {registerLinkTypes, registerDialog, createEditor} from '@sitegeist/archaeopteryx-core';
import {registerInspectorEditors} from '@sitegeist/archaeopteryx-inspector-editor';
import {registerLinkButton} from '@sitegeist/archaeopteryx-link-button';

manifest('@sitegeist/archaeopteryx-plugin', {}, (globalRegistry, {store, configuration, routes}) => {
    const editor = createEditor();
    const neosContextProperties = {globalRegistry, store, configuration, routes};

    registerLinkTypes(globalRegistry);
    registerDialog(neosContextProperties, editor);
    registerInspectorEditors(neosContextProperties, editor);
    registerLinkButton(neosContextProperties, editor);
});
