import * as React from 'react';

import {useRoutes} from '@sitegeist/archaeopteryx-neos-bridge';

import {LinkType, ILinkTypeProps, useEditorTransactions, useEditorValue} from '../../../domain';

function useResolvedValue() {
    const {value} = useEditorValue();

    if (value) {
        const match = /asset:\/\/(.*)/.exec(value.href);
        if (match) {
            return match[1];
        }
    }

    return null;
}

export const Asset = new class extends LinkType {
    public readonly id = 'Sitegeist.Archaeopteryx:Asset';

    public readonly isSuitableFor = (props: ILinkTypeProps) => {
        return Boolean(props.link?.href.startsWith('asset://'));
    }

    public readonly getIcon = () => (
        <div>ASSET</div>
    );

    public readonly getTitle = () => 'ASSET'

    public readonly getPreview = () => (
        <div>ASSET PREVIEW</div>
    );

    public readonly getEditor = () => {
        const {update} = useEditorTransactions();
        const resolvedValue = useResolvedValue();
        const mediaBrowserUri = useRoutes(r => r.core?.modules?.mediaBrowser);

        React.useEffect(() => {
            (window as any).NeosMediaBrowserCallbacks = {
                assetChosen: (assetIdentifier: string) => {
                    update({href: `asset://${assetIdentifier}`});
                }
            };

            () => {
                (window as any).NeosMediaBrowserCallbacks = {};
            };
        }, [update]);

        if (mediaBrowserUri) {
            if (resolvedValue) {
                return (
                    <iframe
                        name="neos-media-selection-screen"
                        src={`${mediaBrowserUri}/images/edit.html?asset[__identity]=${resolvedValue}`}
                        style={{width: '100%', minHeight: '300px'}}
                        frameBorder="0"
                        onLoad={ev => (ev.target as HTMLIFrameElement).contentDocument?.querySelector('form > .neos-footer')?.remove()}
                        />
                );
            } else {
                return (
                    <iframe
                        name="neos-media-selection-screen"
                        src={`${mediaBrowserUri}/assets/index.html`}
                        style={{width: '100%', minHeight: '300px'}}
                        frameBorder="0"
                        />
                );
            }
        } else {
            return (
                <div>Media Browser not found.</div>
            );
        }
    };
}
