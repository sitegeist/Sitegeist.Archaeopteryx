import manifest from '@neos-project/neos-ui-extensibility';

import {registerLinkTypes, registerModal, createEditor} from '@sitegeist/archaeopteryx-core';
import {registerInspectorEditor} from '@sitegeist/archaeopteryx-inspector-editor';
import {registerLinkButton} from '@sitegeist/archaeopteryx-link-button';

manifest('@sitegeist/archaeopteryx-plugin', {}, (globalRegistry, {store, configuration, routes}) => {
    const editor = createEditor();
    const neosContextProperties = {globalRegistry, store, configuration, routes};

    registerLinkTypes(globalRegistry);
    registerModal(neosContextProperties, editor);
    registerInspectorEditor(neosContextProperties, editor);
    registerLinkButton(neosContextProperties, editor);
});
