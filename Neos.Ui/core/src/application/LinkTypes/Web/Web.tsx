import * as React from 'react';
import { useState } from 'react';
import {useForm} from 'react-final-form';

import {SelectBox, TextInput} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, Field} from '../../../framework';
import {ILink, makeLinkType} from '../../../domain';
import {IconCard, IconLabel} from '../../../presentation';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

type WebLinkModel = {
    protocol: 'http' | 'https'
    urlWithoutProtocol: string
}

function removeHttp(url: string) {
    return url.replace(/^https?:\/\//, '');
}

export const Web = makeLinkType<WebLinkModel>('Sitegeist.Archaeopteryx:Web', ({createError}) => ({
    supportedLinkOptions: ['anchor', 'title', 'targetBlank', 'relNofollow'],

    isSuitableFor: (link: ILink) => {
        const isHttp = link.href.startsWith('http://');
        const isHttps = link.href.startsWith('https://');

        return isHttp || isHttps;
    },

    useResolvedModel: (link: ILink) => {
        const matches = link.href.match(/^(https?):\/\/(.*)$/);
        if (matches) {
            const [, protocol, urlWithoutProtocol] = matches;

            return Process.success({
                protocol: protocol as 'http' | 'https',
                urlWithoutProtocol
            });
        }

        return Process.error(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink:(model: WebLinkModel) => ({
        href: `${model.protocol}://${removeHttp(model.urlWithoutProtocol)}`
    }),

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="globe">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:title')}
            </IconLabel>
        );
    },

    Preview: ({model}: {model: WebLinkModel}) => (
        <IconCard
            icon="external-link"
            title={`${model.protocol}://${removeHttp(model.urlWithoutProtocol)}`}
        />
    ),

    Editor: ({model}: {model: Nullable<WebLinkModel>}) => {
        const [protocol, setProtocol] = useState<string>("");

        const i18n = useI18n();
        const form = useForm();
        const prefix = `linkTypeProps.Sitegeist_Archaeopteryx:Web`;

        return (
            <div>
                <label htmlFor="linkTypeProps.Sitegeist_Archaeopteryx:Web.urlWithoutProtocol">
                    {i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:label.link')}:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', minWidth: '600px' }}>
                    <Field<string>
                        name="protocol"
                        format={value => {
                            if(value === undefined){
                                form.change(`${prefix}.protocol`, protocol);
                            }
                            return value;
                        }}
                        initialValue={model?.protocol ?? 'https'}
                        validate={value => {
                            if (!value) {
                                return i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:protocol.validation.required');
                            }
                        }}
                    >{({input}) => (
                        <>
                            <SelectBox
                                onValueChange={input.onChange}
                                allowEmpty={false}
                                value={input.value}
                                options={[{
                                    value: 'https',
                                    label: 'HTTPS',
                                    icon: 'lock'
                                }, {
                                    value: 'http',
                                    label: 'HTTP',
                                    icon: 'unlock'
                                }]}
                            />
                            {input.value !== undefined && setProtocol(input.value)}
                        </>
                    )}</Field>
                    <Field<string>
                        name="urlWithoutProtocol"
                        initialValue={model?.urlWithoutProtocol}
                        validate={value => {
                            if (!value) {
                                return i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:urlWithoutProtocol.validation.required');
                            }
                        }}
                    >{({input}) => (
                        <TextInput
                            id={input.name}
                            type="text"
                            placeholder={i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:urlWithoutProtocol.placeholder')}
                            {...input}
                        />
                    )}</Field>
                </div>
            </div>
        );
    }
}));
