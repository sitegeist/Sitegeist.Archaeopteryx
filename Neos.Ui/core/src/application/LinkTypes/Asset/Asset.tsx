import * as React from 'react';

import {Process, Field, LinkType, ILink} from '../../../domain';
import {MediaBrowser} from './MediaBrowser';

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

    public readonly convertPropsToLink = (props: Props) => {
        if (props.assetIdentifier === null) {
            return null;
        }

        return {
            href: `asset://${props.assetIdentifier}`
        };
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
        return (
            <Field
                name="assetIdentifier"
                initialValue={props.assetIdentifier}
            >{({input}) => (
                <MediaBrowser
                    assetIdentifier={input.value}
                    onSelectAsset={input.onChange}
                />
            )}</Field>
        );
    };
}
