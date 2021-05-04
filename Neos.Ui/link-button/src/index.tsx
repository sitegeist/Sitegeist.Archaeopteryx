import * as React from 'react';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {INeosContextProperties, NeosContext} from '@sitegeist/archaeopteryx-neos-bridge';
import {IEditor, EditorContext} from '@sitegeist/archaeopteryx-core';

import {LinkButton} from './LinkButton';

export function registerLinkButton(
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const {globalRegistry} = neosContextProperties;
    const ckeditor5Registry = globalRegistry.get('ckEditor5');
    if (!ckeditor5Registry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }

    const richtextToolbarRegistry = ckeditor5Registry.get<SynchronousRegistry<any>>('richtextToolbar');
    if (!richtextToolbarRegistry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 richtextToolbar registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }

    richtextToolbarRegistry.set('link', {
        commandName: 'link',
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(LinkButton, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        ),
        isVisible: (config: any) => Boolean(config && config.formatting && config.formatting.a)
    });
}