import * as React from 'react';

import {TextInput, TextArea} from '@neos-project/react-ui-components';
import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {makeLinkType, Process, Field} from '../../../domain';
import {IconCard, Grid, IconLabel} from '../../../presentation';

const simpleEmailRegex = /^[^\s@]+@[^\s@]+$/;

export const MailTo = makeLinkType<{
    recipient: string
    subject?: string
    cc?: string
    bcc?: string
    body?: string
}>('Sitegeist.Archaeopteryx:MailTo', () => ({
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

    TabHeader: () => {
        const i18n = useI18n();

        return (
            <IconLabel icon="envelope">
                {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:title')}
            </IconLabel>
        );
    },

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

    Editor: ({model: email}) => {
        const i18n = useI18n();

        return (
            <Grid>
                <Field<string>
                    name="recipient"
                    initialValue={email?.recipient}
                    validate={value => {
                        if (!value) {
                            return i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:recipient.validation.required');
                        }

                        if (!simpleEmailRegex.test(value)) {
                            return i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:recipient.validation.email');
                        }
                    }}
                >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>
                                {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:recipient.label')}:
                                <TextInput
                                    type="text"
                                    placeholder={i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:recipient.placeholder')}
                                    {...input}
                                />
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
                            {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:subject.label')}:
                            <TextInput type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="cc"
                    initialValue={email?.cc}
                    validate={value => {
                        if (value !== undefined && value !== null) {
                            if (!value.split(',').every(value => simpleEmailRegex.test(value.trim()))) {
                                return i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:cc.validation.emaillist');
                            }
                        }
                    }}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:cc.label')}:
                            <TextInput
                                type="text"
                                placeholder={i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:cc.placeholder')}
                                {...input}
                            />
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="bcc"
                    initialValue={email?.bcc}
                    validate={value => {
                        if (value !== undefined && value !== null) {
                            if (!value.split(',').every(value => simpleEmailRegex.test(value.trim()))) {
                                return i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:bcc.validation.emaillist');
                            }
                        }
                    }}
                >{({input, meta}) => (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>
                            {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:bcc.label')}:
                            <TextInput
                                type="text"
                                placeholder={i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:bcc.placeholder')}
                                {...input}
                            />
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
                            {i18n('Sitegeist.Archaeopteryx:LinkTypes.MailTo:body.label')}:
                            <TextArea {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
            </Grid>
        );
    }
}));
