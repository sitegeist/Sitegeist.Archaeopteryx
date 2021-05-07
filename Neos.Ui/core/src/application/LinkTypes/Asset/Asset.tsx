import * as React from 'react';

import {useAssetSummary} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, Field, makeLinkType} from '../../../domain';
import {ImageCard} from '../../../presentation';

import {MediaBrowser} from './MediaBrowser';

interface Asset {
    identifier: string
}

export const Asset = makeLinkType<Asset>(
    'Sitegeist.Archaeopteryx:Asset',
    ({createError}) => ({
        isSuitableFor: link => link.href.startsWith('asset://'),

        useResolvedModel: link => {
            const match = /asset:\/\/(.*)/.exec(link.href);

            if (match) {
                return Process.success({assetIdentifier: match[1]});
            }

            return Process.error(
                createError(`Cannot handle href "${link.href}".`)
            );
        },

        convertModelToLink: assetIdentifier => ({
            href: `asset://${assetIdentifier}`
        }),

        StaticIcon: () => (<div>ASSET</div>),

        StaticTitle: () => 'ASSET',

        Preview: props => {
            const asset = useAssetSummary(props.model.identifier);

            if (!asset.value) {
                return null;
            }

            return (
                <ImageCard
                    label={asset.value?.label}
                    src={asset.value?.preview}
                />
            );
        },

        Editor: props => {
            return (
                <Field
                    name="identifier"
                    initialValue={props.model?.identifier}
                >{({input}) => (
                    <MediaBrowser
                        assetIdentifier={input.value}
                        onSelectAsset={input.onChange}
                    />
                )}</Field>
            );
        }
    })
);

