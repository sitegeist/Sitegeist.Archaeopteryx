import * as React from 'react';

import {useI18n} from "@sitegeist/archaeopteryx-neos-bridge";

import {TextInput} from '@neos-project/react-ui-components';

import {ILink, makeLinkType} from "../../../domain";
import {Process, Field} from '../../../framework';
import {IconCard, IconLabel} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {parsePhoneNumber} from "libphonenumber-js/max";

type CustomLinkModel = {
    custom: string,
}

export const Custom = makeLinkType<CustomLinkModel>('Sitegeist.Archaeopteryx:Custom', ({createError}) => ({
    isSuitableFor: (link: ILink) => !link.href.startsWith('asset://') && !link.href.startsWith('mailto:')
        && !link.href.startsWith('node://') && !link.href.startsWith('tel:')
        && !link.href.startsWith('http://') && !link.href.startsWith('https://'),

    useResolvedModel: (link: ILink) => {
        return Process.success({
            custom: link.href,
        });
    },

    convertModelToLink: (model: CustomLinkModel) => {
        return {href: `${model.custom}`};
    },

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Custom:title')}
            </IconLabel>
        );
    },

    Preview: ({model}: { model: CustomLinkModel }) => {
        return (
            <IconCard
                icon=""
                title={`<a href="${model.custom}">...</a>`}
            />
        )
    },

    Editor: ({model}: { model: Nullable<CustomLinkModel> }) => {
        const i18n = useI18n();

        return (
            <div>
                <label htmlFor="linkTypeProps.Sitegeist_Archaeopteryx:PhoneNumber.phoneNumber">
                    {i18n('Sitegeist.Archaeopteryx:LinkTypes.Custom:custom.label')}
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', minWidth: '600px'}}>
                    <Field<string>
                        name="custom"
                        initialValue={model?.custom}
                        validate={
                            (value) => {
                                if (!value) {
                                    return i18n('Sitegeist.Archaeopteryx:LinkTypes.Custom:validation.required');
                                }
                            }
                        }
                    >{({input}) => (
                        <TextInput
                            id={input.name}
                            type="text"
                            placeHolder={i18n('Sitegeist.Archaeopteryx:LinkTypes.Custom:custom.placeholder')}
                            {...input}
                        />
                    )}</Field>
                </div>
            </div>
        );
    }
}));



