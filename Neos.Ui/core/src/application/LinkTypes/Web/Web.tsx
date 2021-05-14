import * as React from 'react';
import {useForm} from 'react-final-form';

import {SelectBox, TextInput} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {Process, Field} from '../../../framework';
import {makeLinkType} from '../../../domain';
import {IconCard, IconLabel} from '../../../presentation';

export const Web = makeLinkType<{
    protocol: 'http' | 'https'
    urlWithoutProtocol: string
}>('Sitegeist.Archaeopteryx:Web', ({createError}) => ({
    enableLinkOptionsWhenPossible: true,

    isSuitableFor: link => {
        const isHttp = link.href.startsWith('http://');
        const isHttps = link.href.startsWith('https://');

        return isHttp || isHttps;
    },

    useResolvedModel: link => {
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

    convertModelToLink: model => ({
        href: `${model.protocol}://${model.urlWithoutProtocol}`
    }),

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="globe">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:title')}
            </IconLabel>
        );
    },

    Preview: ({model}) => (
        <IconCard
            icon="external-link"
            title={`${model.protocol}://${model.urlWithoutProtocol}`}
        />
    ),

    Editor: ({model}) => {
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
                        initialValue={model?.protocol ?? 'https'}
                        validate={value => {
                            if (!value) {
                                return i18n('Sitegeist.Archaeopteryx:LinkTypes.Web:protocol.validation.required');
                            }
                        }}
                    >{({input}) => (
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
                    )}</Field>
                    <Field<string>
                        name="urlWithoutProtocol"
                        format={value => {
                            const matches = value?.match(/^(https?):\/\/(.*)$/);
                            if (matches) {
                                const [, protocol, urlWithoutProtocol] = matches;
                                form.change(`${prefix}.protocol`, protocol);
                                return urlWithoutProtocol;
                            }

                            return value;
                        }}
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
