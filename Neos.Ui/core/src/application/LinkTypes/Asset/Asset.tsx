import * as React from 'react';

import {Icon} from '@neos-project/react-ui-components';

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
                return Process.success({identifier: match[1]});
            }

            return Process.error(
                createError(`Cannot handle href "${link.href}".`)
            );
        },

        convertModelToLink: asset => ({
            href: `asset://${asset.identifier}`
        }),

        TabHeader: () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="camera"/>
                Asset
            </div>
        ),

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
                    validate={value => {
                        if (!value) {
                            return 'identifier is required';
                        }
                    }}
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

