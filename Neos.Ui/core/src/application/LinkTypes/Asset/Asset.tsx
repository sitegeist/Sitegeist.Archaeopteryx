import * as React from 'react';

import {useAssetSummary, useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, Field} from '../../../framework';
import {ILink, makeLinkType} from '../../../domain';
import {ImageCard, IconLabel} from '../../../presentation';

import {MediaBrowser} from './MediaBrowser';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

type AssetLinkModel = {
    identifier: string
}

export const Asset = makeLinkType<AssetLinkModel>('Sitegeist.Archaeopteryx:Asset', ({createError}) => ({
    supportedLinkOptions: ['title', 'targetBlank', 'relNofollow'],

    isSuitableFor: (link: ILink) => link.href.startsWith('asset://') && !link.href.includes('#'),

    useResolvedModel: (link: ILink) => {
        const match = /asset:\/\/(.*)/.exec(link.href);

        if (match) {
            return Process.success({identifier: match[1]});
        }

        return Process.error(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink: (asset: AssetLinkModel) => ({
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

    Preview: ({model}: {model: AssetLinkModel}) => {
        const asset = useAssetSummary(model.identifier);

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

    Editor: ({model}: {model: Nullable<AssetLinkModel>}) => {
        const i18n = useI18n();

        return (
            <Field
                name="identifier"
                initialValue={model?.identifier}
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

