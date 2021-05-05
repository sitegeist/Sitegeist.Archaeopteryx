import * as React from 'react';

import {useRoutes} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, LinkType, ILink, useEditorTransactions} from '../../../domain';

interface Props {
    assetIdentifier: null | string
}

export const Asset = new class extends LinkType<Props> {
    public readonly id = 'Sitegeist.Archaeopteryx:Asset';

    public readonly isSuitableFor = (link: ILink) =>
        link.href.startsWith('asset://');

    public readonly useResolvedProps = (link?: ILink) => {
        if (link === undefined) {
            return Process.success({assetIdentifier: null});
        }

        const match = /asset:\/\/(.*)/.exec(link.href);

        if (match) {
            return Process.success({assetIdentifier: match[1]});
        }

        return Process.error(
            this.error(`Cannot handle href "${link.href}".`)
        );
    };

    public readonly getStaticIcon = () => (
        <div>ASSET</div>
    );

    public readonly getIcon = () => (
        <div>ASSET</div>
    );

    public readonly getStaticTitle = () => 'ASSET';

    public readonly getTitle = () => 'ASSET';

    public readonly getLoadingPreview = () => (
        <div>ASSET PREVIEW</div>
    );

    public readonly getPreview = () => (
        <div>ASSET PREVIEW</div>
    );

    public readonly getLoadingEditor = () => (
        <div>ASSET EDITOR</div>
    );

    public readonly getEditor = (props: Props) => {
        const {update} = useEditorTransactions();
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

        if (!mediaBrowserUri) {
            throw this.error('Could not resolve mediaBrowserUri.');
        }

        if (props.assetIdentifier) {
            return (
                <iframe
                    name="neos-media-selection-screen"
                    src={`${mediaBrowserUri}/images/edit.html?asset[__identity]=${props.assetIdentifier}`}
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
    };
}
