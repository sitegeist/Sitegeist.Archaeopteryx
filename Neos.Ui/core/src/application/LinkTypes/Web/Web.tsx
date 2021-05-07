import * as React from 'react';

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

        StaticIcon: () => (<div>WEB</div>),

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

        Editor: ({model}) => (
            <div>
                <Field<string>
                    name="value.protocol"
                    initialValue={model?.protocol ?? 'https'}
                >{({input}) => (
                    <select {...input}>
                        <option value="https">HTTTPS</option>
                        <option value="http">HTTP</option>
                    </select>
                )}</Field>
                <Field<string>
                    name="value.urlWithoutProtocol"
                    initialValue={model?.urlWithoutProtocol}
                    validate={value => {
                        if (!value) {
                            return 'Url is required';
                        }
                    }}
                >{({input}) => (
                    <input type="text" {...input}/>
                )}</Field>
            </div>
        )
    })
);
