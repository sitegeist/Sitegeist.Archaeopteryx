import * as React from 'react';

import {useI18n} from "@sitegeist/archaeopteryx-neos-bridge";

import {TextInput} from '@neos-project/react-ui-components';

import {ILink, makeLinkType} from "../../../domain";
import {Process, Field} from '../../../framework';
import {IconCard, IconLabel} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';

type CustomLinkModel = {
    customLink: string,
}

export const CustomLink = makeLinkType<CustomLinkModel>('Sitegeist.Archaeopteryx:CustomLink', ({createError}) => ({
    isSuitableFor: (link: ILink) => {
        if ((link.href.startsWith('asset://') || link.href.startsWith('node://')) && link.href.includes('#')) {
            return true;
        }
        return !link.href.startsWith('node://') && !link.href.startsWith('asset://') && !link.href.startsWith('mailto:')
                && !link.href.startsWith('tel:') && !link.href.startsWith('http://') && !link.href.startsWith('https://');
    },

    useResolvedModel: (link: ILink) => {
        return Process.success({
            customLink: link.href,
        });
    },

    convertModelToLink: (model: CustomLinkModel) => {
        return {href: `${model.customLink}`};
    },

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.CustomLink:title')}
            </IconLabel>
        );
    },

    Preview: ({model}: { model: CustomLinkModel }) => {
        return (
            <IconCard
                icon=""
                title={`<a href="${model.customLink}">...</a>`}
            />
        )
    },

    Editor: ({model}: { model: Nullable<CustomLinkModel> }) => {
        const i18n = useI18n();

        return (
            <div>
                <label>
                    {i18n('Sitegeist.Archaeopteryx:LinkTypes.CustomLink:customLink.label')}
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', minWidth: '600px'}}>
                    <Field<string>
                        name="customLink"
                        initialValue={model?.customLink}
                        validate={
                            (value) => {
                                if (!value) {
                                    return i18n('Sitegeist.Archaeopteryx:LinkTypes.CustomLink:validation.required');
                                }
                            }
                        }
                    >{({input}) => (
                        <TextInput
                            id={input.name}
                            type="text"
                            placeHolder={i18n('Sitegeist.Archaeopteryx:LinkTypes.CustomLink:customLink.placeholder')}
                            {...input}
                        />
                    )}</Field>
                </div>
            </div>
        );
    }
}));

