import * as React from 'react';
import {useForm} from 'react-final-form';

import {Icon, SelectBox, TextInput} from '@neos-project/react-ui-components';

import {Process, makeLinkType, Field} from '../../../domain';
import {IconCard} from '../../../presentation';

interface WebLinkModel {
    protocol: 'http' | 'https'
    urlWithoutProtocol: string
}

export const Web = makeLinkType<WebLinkModel>(
    'Sitegeist.Archaeopteryx:Web',
    ({createError}) => ({
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

        StaticIcon: () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="globe"/>
                Web
            </div>
        ),

        StaticTitle: () => 'Web Link',

        Title: ({model}) => {
            const isSecure = model.protocol === 'https';

            if (isSecure) {
                return 'Web Link (secure)';
            } else {
                return 'Web Link (not secure)';
            }
        },

        Preview: ({model}) => (
            <IconCard
                icon="external-link"
                title={`${model.protocol}://${model.urlWithoutProtocol}`}
            />
        ),

        Editor: ({model}) => {
            const form = useForm();
            const prefix = `linkTypeProps.Sitegeist_Archaeopteryx:Web`;

            return (
                <div>
                    <label htmlFor="linkTypeProps.Sitegeist_Archaeopteryx:Web.urlWithoutProtocol">
                        Link:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', minWidth: '600px' }}>
                        <Field<string>
                            name="protocol"
                            initialValue={model?.protocol ?? 'https'}
                            validate={value => {
                                if (!value) {
                                    return 'protocol is required';
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
                                    return 'Url is required';
                                }
                            }}
                        >{({input}) => (
                            <TextInput id={input.name} type="text" {...input}/>
                        )}</Field>
                    </div>
                </div>
            );
        }
    })
);
