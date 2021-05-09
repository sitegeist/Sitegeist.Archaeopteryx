import * as React from 'react';

import {useRoutes} from '@sitegeist/archaeopteryx-neos-bridge';

interface Props {
    assetIdentifier: null | string
    onSelectAsset: (assetIdentifier: string) => void
}

export const MediaBrowser: React.FC<Props> = props => {
    const mediaBrowserUri = useRoutes(r => r.core?.modules?.mediaBrowser);

    React.useEffect(() => {
        (window as any).NeosMediaBrowserCallbacks = {
            assetChosen: (assetIdentifier: string) => {
                props.onSelectAsset(assetIdentifier);
            }
        };

        () => {
            (window as any).NeosMediaBrowserCallbacks = {};
        };
    }, [props.onSelectAsset]);

    if (!mediaBrowserUri) {
        throw new Error('[Sitegeist.Archaeopteryx]: Could not resolve mediaBrowserUri.');
    }

    if (props.assetIdentifier) {
        return (
            <iframe
                name="neos-media-selection-screen"
                src={`${mediaBrowserUri}/images/edit.html?asset[__identity]=${props.assetIdentifier}`}
                style={{width: 'calc(100vw - 160px)', maxWidth: '1260px', height: 'calc(100vh - 480px)'}}
                frameBorder="0"
                onLoad={ev => {
                    const iframe = (ev.target as HTMLIFrameElement).contentDocument;
                    if (iframe) {
                        iframe.body.style.overflowX = 'hidden';
                        iframe.body.style.padding = '0';
                        iframe.querySelector('form > .neos-footer')?.remove();
                        iframe.querySelectorAll('input, select, textarea')?.forEach(input => {
                            (input as HTMLInputElement).readOnly = true;
                        });
                    }
                }}
            />
        );
    } else {
        return (
            <iframe
                name="neos-media-selection-screen"
                src={`${mediaBrowserUri}/assets/index.html`}
                style={{width: 'calc(100vw - 160px)', maxWidth: '1260px', height: 'calc(100vh - 480px)'}}
                frameBorder="0"
                onLoad={ev => {
                    const iframe = (ev.target as HTMLIFrameElement).contentDocument;
                    if (iframe) {
                        iframe.body.style.overflowX = 'hidden';
                        iframe.body.style.padding = '0';
                    }
                }}
            />
        );
    }
};