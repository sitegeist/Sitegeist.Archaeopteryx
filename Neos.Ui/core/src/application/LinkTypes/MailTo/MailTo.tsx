import * as React from 'react';

import {Icon, TextInput, TextArea} from '@neos-project/react-ui-components';

import {makeLinkType, Process, Field} from '../../../domain';
import {IconCard, Grid} from '../../../presentation';

interface EMail {
    recipient: string
    subject?: string
    cc?: string
    bcc?: string
    body?: string
}

export const MailTo = makeLinkType<EMail>(
    'Sitegeist.Archaeopteryx:MailTo',
    () => ({
        isSuitableFor: link => link.href.startsWith('mailto:'),

        useResolvedModel: link => {
            const url = new URL(link.href);

            return Process.success({
                recipient: url.pathname,
                subject: url.searchParams.get('subject') ?? undefined,
                cc: url.searchParams.get('cc') ?? undefined,
                bcc: url.searchParams.get('bcc') ?? undefined,
                body: url.searchParams.get('body') ?? undefined
            });
        },

        convertModelToLink: email => {
            const url = new URL(`mailto:${email.recipient}`);

            if (email.subject) {
                url.searchParams.set('subject', email.subject)
            }

            if (email.cc) {
                url.searchParams.set('cc', email.cc)
            }

            if (email.bcc) {
                url.searchParams.set('bcc', email.bcc)
            }

            if (email.body) {
                url.searchParams.set('body', email.body)
            }

            return {href: url.toString()};
        },

        TabHeader: () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="envelope"/>
                Mailto
            </div>
        ),

        Preview: ({model: email}) => (
            <IconCard
                icon="envelope"
                title={email.recipient}
                subTitle={
                    email.subject || email.body
                        ? `${email.subject ?? ''} ${email.body ?? ''}`.trim()
                        : undefined
                }
            />
        ),

        Editor: ({model: email}) => (
            <Grid>
                <Field<string>
                    name="recipient"
                    initialValue={email?.recipient}
                    validate={value => {
                        if (!value) {
                            return 'recipient is required';
                        }
                    }}
                >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>
                                Recipient:
                                <TextInput type="text" {...input}/>
                            </label>
                            {meta.error}
                        </div>
                )}</Field>
                <Field<string>
                    name="subject"
                    initialValue={email?.subject}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            Subject:
                            <TextInput type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="cc"
                    initialValue={email?.cc}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            CC:
                            <TextInput type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="bcc"
                    initialValue={email?.bcc}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            BCC:
                            <TextInput type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="body"
                    initialValue={email?.body}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            Body:
                            <TextArea {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
            </Grid>
        )
    })
);
