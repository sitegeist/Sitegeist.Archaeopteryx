import * as React from 'react';

import {useAssetSummary, useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, Field, makeLinkType} from '../../../domain';
import {ImageCard, IconLabel} from '../../../presentation';

import {MediaBrowser} from './MediaBrowser';

export const Asset = makeLinkType<{
    identifier: string
}>('Sitegeist.Archaeopteryx:Asset', ({createError}) => ({
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

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="camera">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Asset:title')}
            </IconLabel>
        );
    },

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
        const i18n = useI18n();

        return (
            <Field
                name="identifier"
                initialValue={props.model?.identifier}
                validate={value => {
                    if (!value) {
                        return i18n('Sitegeist.Archaeopteryx:LinkTypes.Asset:identifier.validation.required');
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
}));

